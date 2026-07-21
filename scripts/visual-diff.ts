import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium, type Browser, type Page } from 'playwright';

const VIEWPORTS = [360, 560, 900, 1180] as const;
const SELFTEST_MAX_MISMATCH_PCT = 0.05;
const GATE_MAX_MISMATCH_PCT = 2;
const CAPTURE_SETTLE_MS = 250;
const ART_DOWNSAMPLE_FACTOR = 4;

type CaptureMode = 'structure' | 'art';

type SectionConfig = {
  id: string;
  selector: string;
  appSelector?: string;
  staticHiw?: boolean;
  artSelector?: string;
  appArtSelector?: string;
  maskPhotoLayers?: boolean;
};

const SECTIONS: Record<string, SectionConfig> = {
  nav: { id: 'nav', selector: 'nav', appSelector: '[data-qa="nav"]' },
  hero: {
    id: 'hero',
    selector: 'header.hero',
    appSelector: '[data-qa="hero"]',
    artSelector: '.hero-bg',
    appArtSelector: '.hero-bg',
    maskPhotoLayers: true,
  },
  proof: {
    id: 'proof',
    selector: 'section.stats',
    appSelector: '[data-qa="proof-strip"]',
  },
  pricing: {
    id: 'pricing',
    selector: '#pricing',
    appSelector: '[data-qa="pricing"]',
  },
  transparency: {
    id: 'transparency',
    selector: '#transparency',
    appSelector: '[data-qa="transparency"]',
  },
  'hiw-card': {
    id: 'hiw-card',
    selector: '#how .hiw-card',
    appSelector: '[data-qa="hiw-card-1"]',
    artSelector: '#how .hiw-card .hiw-art',
    appArtSelector: '[data-qa="hiw-card-1"] .hiw-art',
    staticHiw: true,
    maskPhotoLayers: true,
  },
  footer: {
    id: 'footer',
    selector: 'footer',
    appSelector: '[data-qa="footer"]',
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REFERENCE_HTML = path.join(ROOT, 'reference/payout-landing-v2_0_30.html');
const REFERENCE_URL = `file://${REFERENCE_HTML}`;
const FONTS_DIR = path.join(ROOT, 'reference/fonts');
const FONTS_CSS_PATH = path.join(FONTS_DIR, 'faces.css');

let vendoredFontCssCache: string | null = null;

type NormalizationPayload = {
  heroImage: string;
  hiwImages: string[];
};

function buildNormalizationPayload(appUrl: string): NormalizationPayload {
  const base = appUrl.replace(/\/$/, '');

  return {
    heroImage: `${base}/images/hero-markets.png`,
    hiwImages: [1, 2, 3, 4].map(
      (index) => `${base}/images/hiw-0${index}.jpg`,
    ),
  };
}

type CaptureOptions = {
  isReference: boolean;
  staticHiw: boolean;
  normalizationPayload: NormalizationPayload;
  mode: CaptureMode;
  maskPhotoLayers: boolean;
  hideFixedNav: boolean;
};

type CliOptions = {
  sprint: number;
  section?: string;
  url: string;
  selftest: boolean;
};

type DiffResult = {
  mismatchPct: number;
  diffPng: Buffer;
  failed: boolean;
  reason?: string;
  dimensionNote?: string;
};

function parseArgs(argv: string[]): CliOptions {
  let sprint = 0;
  let section: string | undefined;
  let url = 'http://localhost:3000';
  let selftest = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--sprint') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --sprint');
      }
      sprint = Number.parseInt(value, 10);
      index += 1;
      continue;
    }
    if (arg === '--section') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --section');
      }
      section = value;
      index += 1;
      continue;
    }
    if (arg === '--url') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --url');
      }
      url = value;
      index += 1;
      continue;
    }
    if (arg === '--selftest') {
      selftest = true;
    }
  }

  if (Number.isNaN(sprint)) {
    throw new Error('Invalid --sprint value');
  }

  return { sprint, section, url, selftest };
}

async function launchBrowser(): Promise<Browser> {
  try {
    return await chromium.launch();
  } catch {
    return await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  }
}

function loadVendoredFontCss(): string {
  if (vendoredFontCssCache) {
    return vendoredFontCssCache;
  }

  const facesCss = fs.readFileSync(FONTS_CSS_PATH, 'utf8');
  const inlined = facesCss.replace(
    /url\(\s*['"]?\.\/([^'")]+)['"]?\s*\)/g,
    (_match, filename: string) => {
      const filePath = path.join(FONTS_DIR, filename);
      const data = fs.readFileSync(filePath);
      return `url(data:font/woff2;base64,${data.toString('base64')})`;
    },
  );

  vendoredFontCssCache = `${inlined}
:root {
  --serif: 'STIX Two Text', 'Times New Roman', serif;
  --sans: 'Inter', -apple-system, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
}
`;

  return vendoredFontCssCache;
}

async function injectVendoredFonts(page: Page): Promise<void> {
  await page.addStyleTag({ content: loadVendoredFontCss() });
  await page.evaluate(() => document.fonts.ready);
}

function buildHiwArtSelectorList(): string {
  return [1, 2, 3, 4]
    .flatMap((index) => [
      `.hiw-art-${index}`,
      `#how .hiw-card:nth-of-type(${index}) .hiw-art`,
    ])
    .join(',\n      ');
}

function buildAssetNormalizationCss(payload: NormalizationPayload): string {
  const hiwRules = payload.hiwImages
    .map(
      (url, index) => `
      .hiw-art-${index + 1},
      #how .hiw-card:nth-of-type(${index + 1}) .hiw-art {
        background-image: url('${url}') !important;
      }`,
    )
    .join('');

  return `
    .hero-bg {
      background-image: url('${payload.heroImage}') !important;
      background-color: #101014 !important;
      background-size: cover !important;
      background-position: center center !important;
      opacity: 1 !important;
    }
    ${hiwRules}
  `;
}

async function injectAssetNormalizationStylesheet(
  page: Page,
  payload: NormalizationPayload,
): Promise<void> {
  await page.addStyleTag({
    content: buildAssetNormalizationCss(payload),
  });
}

async function injectProofStripReferenceLayout(page: Page): Promise<void> {
  // Design doc §8: phone <560px = single column. Sanctioned reference deviation
  // so proof diff stays meaningful at 360px (reference HTML lacks this rule).
  await page.addStyleTag({
    content: `
      @media (max-width: 560px) {
        .stats-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `,
  });
}

async function normalizeAppHeroImage(
  page: Page,
  payload: NormalizationPayload,
): Promise<void> {
  await page.evaluate((heroImage) => {
    const heroBg = document.querySelector('.hero-bg');
    const img = heroBg?.querySelector('img');
    if (img instanceof HTMLImageElement) {
      img.src = heroImage;
    }
  }, payload.heroImage);
}

async function pinHeroBackgroundGeometry(page: Page): Promise<void> {
  await page.evaluate(() => {
    const heroBg = document.querySelector('.hero-bg') as HTMLElement | null;
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (!heroBg || !hero) {
      return;
    }

    const inset = Math.round(hero.offsetHeight * 0.12);
    heroBg.style.setProperty('top', `-${inset}px`, 'important');
    heroBg.style.setProperty('bottom', `-${inset}px`, 'important');
    heroBg.style.setProperty('left', '0', 'important');
    heroBg.style.setProperty('right', '0', 'important');
    heroBg.style.setProperty('background-size', 'cover', 'important');
    heroBg.style.setProperty('background-position', 'center center', 'important');
  });
}

function applyCaptureOverrides(page: Page, staticHiw: boolean): Promise<void> {
  if (!staticHiw) {
    return Promise.resolve();
  }

  return page
    .addStyleTag({
      content: `
      .hiw-track { height: auto !important; }
      .hiw-pin { position: static !important; height: auto !important; display: block !important; }
      .hiw-viewport { height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; }
      .hiw-stack { transform: none !important; }
    `,
    })
    .then(() => undefined);
}

function buildPhotoLayerMaskCss(): string {
  const hiwSelectors = buildHiwArtSelectorList();

  return `
    .hero-bg {
      background-image: none !important;
    }
    .hero-bg img {
      visibility: hidden !important;
    }
    ${hiwSelectors} {
      background-image: none !important;
    }
  `;
}

async function applyPhotoLayerMask(page: Page): Promise<void> {
  await page.addStyleTag({
    content: buildPhotoLayerMaskCss(),
  });
}

async function normalizeReferencePage(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('.logo').forEach((logo) => {
      const mark = logo.querySelector('.lm');
      logo.textContent = '';
      if (mark) {
        logo.appendChild(mark);
      }
      logo.appendChild(document.createTextNode('Northbook'));
    });

    document.querySelectorAll('a.btn-primary').forEach((anchor) => {
      const label = anchor.textContent?.trim();
      if (label === 'Get funded' || label === 'Add to cart') {
        anchor.textContent = 'Start a challenge';
      }
    });

    document.querySelectorAll('.nav-links a').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (href === '#markets' || href === '#faq') {
        (anchor as HTMLElement).style.display = 'none';
      }
    });

    const heroOdo = document.getElementById('hero-odo');
    if (heroOdo) {
      heroOdo.textContent = '$8,412,930';
    }

    const rot = document.getElementById('h1-rot');
    if (rot) {
      rot.textContent = 'pays by smart contract.';
    }

    const statData = [
      { label: 'Reserve balance', value: '$1,214,900', fill: 8, up: false },
      { label: 'Total paid out', value: '$123,012', fill: 10, up: true },
      { label: 'Median time-to-pay', value: '4h 12m', fill: 7, up: false },
      { label: 'Published pass rate', value: '11.2%', fill: 2, up: false },
    ];

    document.querySelectorAll('.stats-grid .stat').forEach((stat, index) => {
      const entry = statData[index];
      if (!entry) {
        return;
      }

      const eyebrow = stat.querySelector('.eyebrow');
      const value = stat.querySelector('.v');
      const row = stat.querySelector('.dm-row');

      if (eyebrow) {
        eyebrow.textContent = entry.label;
      }
      if (value) {
        value.textContent = entry.value;
        value.classList.toggle('up', entry.up);
        (value as HTMLElement).style.color = '';
      }
      if (row) {
        row.setAttribute('data-fill', String(entry.fill));
        row.innerHTML = '';
        for (let dotIndex = 0; dotIndex < 10; dotIndex += 1) {
          const dot = document.createElement('i');
          if (dotIndex >= entry.fill) {
            dot.className = 'off';
          }
          row.appendChild(dot);
        }
      }
    });

    const howSection = document.querySelector('#how');
    if (howSection) {
      const heading = howSection.querySelector('.sec-head h2');
      if (heading) {
        heading.textContent = 'Four steps to a funded account.';
      }

      const cards = howSection.querySelectorAll('.hiw-card');
      const cardCopy = [
        {
          num: '01 — Today',
          title: 'Start a challenge',
          body: 'Pick a challenge from $5K to $100K. One-time fee. No time limit.',
        },
        {
          num: '02 — Your pace',
          title: 'Prove your edge',
          body: "Hit the profit target inside two limits: max daily loss and max drawdown. That's the entire rule set.",
        },
        {
          num: '03 — Instant upgrade',
          title: 'Get funded',
          body: 'Hit the target and the account funds itself — no forms, no review queue. Trade the funded account the same day.',
        },
        {
          num: '04 — On demand, on-chain',
          title: 'Get paid in USDC',
          body: 'Keep the majority of your gains. Payouts settle on-chain with a public transaction hash — verify every single one.',
        },
      ];

      cards.forEach((card, index) => {
        const copy = cardCopy[index];
        if (!copy) {
          return;
        }
        const num = card.querySelector('.hiw-num');
        const title = card.querySelector('h3');
        const body = card.querySelector('p');
        if (num) {
          num.textContent = copy.num;
        }
        if (title) {
          title.textContent = copy.title;
        }
        if (body) {
          body.textContent = copy.body;
        }
        const art = card.querySelector('.hiw-art') as HTMLElement | null;
        if (art) {
          art.style.backgroundImage = '';
        }
      });
    }

    const stack = document.querySelector('.hiw-stack') as HTMLElement | null;
    if (stack) {
      stack.style.transform = 'translateY(0)';
    }

    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
      const heading = pricingSection.querySelector('.sec-head h2');
      if (heading) {
        heading.textContent =
          'Choose your challenge. One-time fee, 100% rebated at first payout.';
      }
    }

    const transparencySection = document.querySelector('#transparency');
    if (transparencySection) {
      const metricValues = ['$412,908', '11.2%', '32'];
      transparencySection.querySelectorAll('.big-metric .v').forEach((element, index) => {
        const value = metricValues[index];
        if (value) {
          element.textContent = value;
        }
      });
    }

    const footerLegal = document.querySelector('footer .legal');
    if (footerLegal && !footerLegal.textContent?.includes('Rules hash')) {
      const rulesLine = document.createElement('p');
      rulesLine.textContent = 'Rules hash: 0x0000…0000';
      const geoLine = document.createElement('p');
      geoLine.textContent =
        'Trading availability varies by jurisdiction. Geo-restriction copy pending counsel review.';
      footerLegal.append(rulesLine, geoLine);
    }

    const footer = document.querySelector('footer');
    if (footer) {
      const textWalker = document.createTreeWalker(
        footer,
        NodeFilter.SHOW_TEXT,
      );
      let textNode = textWalker.nextNode();
      while (textNode) {
        if (textNode.textContent?.includes('Payout')) {
          textNode.textContent = textNode.textContent.replaceAll(
            'Payout',
            'Northbook',
          );
        }
        textNode = textWalker.nextNode();
      }
    }
  });
}

async function freezePageForCapture(
  page: Page,
  options: CaptureOptions,
): Promise<void> {
  await page.evaluate(() => document.fonts.ready);

  await injectVendoredFonts(page);

  if (options.isReference) {
    await normalizeReferencePage(page);
    await injectProofStripReferenceLayout(page);
  }

  await injectAssetNormalizationStylesheet(page, options.normalizationPayload);

  if (!options.isReference) {
    await normalizeAppHeroImage(page, options.normalizationPayload);
  }

  await page.evaluate(() => {
    document.querySelectorAll('.rv, .rv-scale, [data-stagger]').forEach((element) => {
      element.classList.add('in');
    });

    const style = document.createElement('style');
    style.setAttribute('data-visual-diff', 'freeze');
    style.textContent =
      '*,*::before,*::after{transition:none!important;animation:none!important}';
    document.head.appendChild(style);
  });

  await pinHeroBackgroundGeometry(page);

  if (options.staticHiw) {
    await applyCaptureOverrides(page, true);
  }

  if (options.mode === 'structure' && options.maskPhotoLayers) {
    await applyPhotoLayerMask(page);
  }

  if (options.hideFixedNav) {
    await page.addStyleTag({
      content: 'nav { visibility: hidden !important; }',
    });
  }
}

async function captureSectionScreenshot(
  page: Page,
  targetUrl: string,
  width: number,
  selector: string,
  options: CaptureOptions,
): Promise<Buffer> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width, height: 1200 });
  await page.goto(targetUrl, { waitUntil: 'load' });
  await freezePageForCapture(page, options);

  const element = page.locator(selector).first();
  await element.waitFor({ state: 'visible' });
  await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(CAPTURE_SETTLE_MS);

  const screenshot = await element.screenshot();
  if (!screenshot) {
    throw new Error(`Failed to capture screenshot for selector ${selector}`);
  }

  return screenshot;
}

function cropPngToSize(source: PNG, width: number, height: number): PNG {
  const cropped = new PNG({ width, height });
  PNG.bitblt(source, cropped, 0, 0, width, height, 0, 0);
  return cropped;
}

function boxAverageDownsample(source: PNG, factor: number): PNG {
  const outWidth = Math.floor(source.width / factor);
  const outHeight = Math.floor(source.height / factor);
  const output = new PNG({ width: outWidth, height: outHeight });

  for (let y = 0; y < outHeight; y += 1) {
    for (let x = 0; x < outWidth; x += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let dy = 0; dy < factor; dy += 1) {
        for (let dx = 0; dx < factor; dx += 1) {
          const sourceIndex = ((y * factor + dy) * source.width + (x * factor + dx)) * 4;
          r += source.data[sourceIndex] ?? 0;
          g += source.data[sourceIndex + 1] ?? 0;
          b += source.data[sourceIndex + 2] ?? 0;
          a += source.data[sourceIndex + 3] ?? 0;
          count += 1;
        }
      }

      const outputIndex = (y * outWidth + x) * 4;
      output.data[outputIndex] = Math.round(r / count);
      output.data[outputIndex + 1] = Math.round(g / count);
      output.data[outputIndex + 2] = Math.round(b / count);
      output.data[outputIndex + 3] = Math.round(a / count);
    }
  }

  return output;
}

function diffImages(left: Buffer, right: Buffer, downsampleFactor = 1): DiffResult {
  const imgLeft = PNG.sync.read(left);
  const imgRight = PNG.sync.read(right);

  const widthDiff = Math.abs(imgLeft.width - imgRight.width);
  const heightDiff = Math.abs(imgLeft.height - imgRight.height);

  if (widthDiff > 1 || heightDiff > 1) {
    return {
      mismatchPct: 100,
      diffPng: left,
      failed: true,
      reason: `Dimension mismatch: ${imgLeft.width}x${imgLeft.height} vs ${imgRight.width}x${imgRight.height}`,
    };
  }

  const width = Math.min(imgLeft.width, imgRight.width);
  const height = Math.min(imgLeft.height, imgRight.height);
  const dimensionNote =
    widthDiff > 0 || heightDiff > 0
      ? `${imgLeft.width}x${imgLeft.height} vs ${imgRight.width}x${imgRight.height}`
      : undefined;
  const croppedLeft =
    imgLeft.width === width && imgLeft.height === height
      ? imgLeft
      : cropPngToSize(imgLeft, width, height);
  const croppedRight =
    imgRight.width === width && imgRight.height === height
      ? imgRight
      : cropPngToSize(imgRight, width, height);

  let leftForDiff = croppedLeft;
  let rightForDiff = croppedRight;
  if (downsampleFactor > 1) {
    leftForDiff = boxAverageDownsample(croppedLeft, downsampleFactor);
    rightForDiff = boxAverageDownsample(croppedRight, downsampleFactor);
  }

  const diffWidth = leftForDiff.width;
  const diffHeight = leftForDiff.height;
  const diff = new PNG({ width: diffWidth, height: diffHeight });
  const mismatchedPixels = pixelmatch(
    leftForDiff.data,
    rightForDiff.data,
    diff.data,
    diffWidth,
    diffHeight,
    { threshold: 0.1 },
  );
  const totalPixels = diffWidth * diffHeight;
  const mismatchPct = (mismatchedPixels / totalPixels) * 100;

  return {
    mismatchPct,
    diffPng: PNG.sync.write(diff),
    failed: false,
    dimensionNote,
  };
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeArtifact(
  outputDir: string,
  sectionId: string,
  width: number,
  suffix: string,
  data: Buffer,
): string {
  const filePath = path.join(outputDir, `${sectionId}-${width}px-${suffix}.png`);
  fs.writeFileSync(filePath, data);
  return filePath;
}

async function runPairDiff(options: {
  outputDir: string;
  sectionId: string;
  width: number;
  referenceBuffer: Buffer;
  appBuffer: Buffer;
  scores: string[];
  downsampleFactor?: number;
}): Promise<number> {
  const {
    outputDir,
    sectionId,
    width,
    referenceBuffer,
    appBuffer,
    scores,
    downsampleFactor = 1,
  } = options;

  writeArtifact(outputDir, sectionId, width, 'ref', referenceBuffer);
  writeArtifact(outputDir, sectionId, width, 'app', appBuffer);

  const result = diffImages(referenceBuffer, appBuffer, downsampleFactor);
  writeArtifact(outputDir, sectionId, width, 'diff', result.diffPng);

  if (result.failed) {
    const line = `${sectionId} @ ${width}px — FAIL (${result.reason})`;
    scores.push(line);
    console.error(line);
    return 100;
  }

  const dimensionSuffix = result.dimensionNote ? ` (${result.dimensionNote})` : '';
  const downsampleSuffix =
    downsampleFactor > 1 ? ` (${downsampleFactor}x)` : '';
  const line = `${sectionId} @ ${width}px — ${result.mismatchPct.toFixed(2)}%${downsampleSuffix}${dimensionSuffix}`;
  scores.push(line);
  console.log(line);
  return result.mismatchPct;
}

async function captureOnFreshPage(
  browser: Browser,
  targetUrl: string,
  width: number,
  selector: string,
  options: CaptureOptions,
): Promise<Buffer> {
  const page = await browser.newPage();
  try {
    return await captureSectionScreenshot(page, targetUrl, width, selector, options);
  } finally {
    await page.close();
  }
}

function buildCaptureOptions(
  section: SectionConfig,
  mode: CaptureMode,
  isReference: boolean,
  normalizationPayload: NormalizationPayload,
): CaptureOptions {
  return {
    isReference,
    staticHiw: section.staticHiw ?? false,
    normalizationPayload,
    mode,
    maskPhotoLayers: section.maskPhotoLayers ?? false,
    hideFixedNav: section.id === 'footer',
  };
}

async function runSectionDiffs(options: {
  browser: Browser;
  outputDir: string;
  section: SectionConfig;
  appUrl: string;
  normalizationPayload: NormalizationPayload;
  scores: string[];
}): Promise<boolean> {
  const { browser, outputDir, section, appUrl, normalizationPayload, scores } =
    options;
  let failed = false;

  const captures: Array<{
    sectionId: string;
    selector: string;
    appSelector: string;
    mode: CaptureMode;
  }> = [
    {
      sectionId: section.id,
      selector: section.selector,
      appSelector: section.appSelector ?? section.selector,
      mode: 'structure',
    },
  ];

  if (section.artSelector) {
    captures.push({
      sectionId: `${section.id}-art`,
      selector: section.artSelector,
      appSelector: section.appArtSelector ?? section.artSelector,
      mode: 'art',
    });
  }

  for (const capture of captures) {
    for (const width of VIEWPORTS) {
      const referenceBuffer = await captureOnFreshPage(
        browser,
        REFERENCE_URL,
        width,
        capture.selector,
        buildCaptureOptions(section, capture.mode, true, normalizationPayload),
      );
      const appBuffer = await captureOnFreshPage(
        browser,
        appUrl,
        width,
        capture.appSelector,
        buildCaptureOptions(section, capture.mode, false, normalizationPayload),
      );

      const mismatchPct = await runPairDiff({
        outputDir,
        sectionId: capture.sectionId,
        width,
        referenceBuffer,
        appBuffer,
        scores,
        downsampleFactor:
          capture.mode === 'art' ? ART_DOWNSAMPLE_FACTOR : 1,
      });

      if (mismatchPct > GATE_MAX_MISMATCH_PCT) {
        failed = true;
      }
    }
  }

  return failed;
}

async function runSelftest(sprint: number, appUrl: string): Promise<void> {
  const outputDir = path.join(ROOT, 'qa-screenshots', `sprint-${sprint}`);
  ensureDir(outputDir);

  const scores: string[] = [];
  const browser = await launchBrowser();
  const normalizationPayload = buildNormalizationPayload(appUrl);
  let failed = false;

  try {
    for (const width of VIEWPORTS) {
      const captureOptions: CaptureOptions = {
        isReference: true,
        staticHiw: false,
        normalizationPayload,
        mode: 'structure',
        maskPhotoLayers: false,
        hideFixedNav: false,
      };

      const firstCapture = await captureOnFreshPage(
        browser,
        REFERENCE_URL,
        width,
        '#transparency',
        captureOptions,
      );
      const secondCapture = await captureOnFreshPage(
        browser,
        REFERENCE_URL,
        width,
        '#transparency',
        captureOptions,
      );

      const mismatchPct = await runPairDiff({
        outputDir,
        sectionId: 'transparency-selftest',
        width,
        referenceBuffer: firstCapture,
        appBuffer: secondCapture,
        scores,
      });

      if (mismatchPct > SELFTEST_MAX_MISMATCH_PCT) {
        failed = true;
        console.error(
          `Selftest exceeded ${SELFTEST_MAX_MISMATCH_PCT.toFixed(2)}% at ${width}px`,
        );
      }
    }
  } finally {
    await browser.close();
  }

  const scoresPath = path.join(outputDir, 'scores.txt');
  fs.writeFileSync(scoresPath, `${scores.join('\n')}\n`);
  console.log(`Scores written to ${scoresPath}`);

  if (failed) {
    process.exit(1);
  }
}

async function runVisualDiff(options: CliOptions): Promise<void> {
  const outputDir = path.join(ROOT, 'qa-screenshots', `sprint-${options.sprint}`);
  ensureDir(outputDir);

  const sectionEntries = Object.values(SECTIONS).filter((entry) =>
    options.section ? entry.id === options.section : true,
  );

  if (sectionEntries.length === 0) {
    console.log('No sections registered in SECTIONS map — nothing to diff.');
    return;
  }

  const scores: string[] = [];
  const browser = await launchBrowser();
  const normalizationPayload = buildNormalizationPayload(options.url);
  let failed = false;

  try {
    for (const section of sectionEntries) {
      const sectionFailed = await runSectionDiffs({
        browser,
        outputDir,
        section,
        appUrl: options.url,
        normalizationPayload,
        scores,
      });
      if (sectionFailed) {
        failed = true;
      }
    }
  } finally {
    await browser.close();
  }

  const scoresPath = path.join(outputDir, 'scores.txt');
  fs.writeFileSync(scoresPath, `${scores.join('\n')}\n`);
  console.log(`Scores written to ${scoresPath}`);

  if (failed) {
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.selftest) {
    await runSelftest(options.sprint, options.url);
    return;
  }

  await runVisualDiff(options);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
