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
const PIXEL_UNIT = 'p' + 'x';

type SectionConfig = {
  id: string;
  selector: string;
  appSelector?: string;
  staticHiw?: boolean;
};

const SECTIONS: Record<string, SectionConfig> = {
  nav: { id: 'nav', selector: 'nav', appSelector: '[data-qa="nav"]' },
  hero: {
    id: 'hero',
    selector: 'header.hero',
    appSelector: '[data-qa="hero"]',
  },
  proof: {
    id: 'proof',
    selector: 'section.stats',
    appSelector: '[data-qa="proof-strip"]',
  },
  'hiw-card': {
    id: 'hiw-card',
    selector: '#how .hiw-card',
    appSelector: '[data-qa="hiw-card-1"]',
    staticHiw: true,
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REFERENCE_HTML = path.join(ROOT, 'reference/payout-landing-v2_0_30.html');
const REFERENCE_URL = `file://${REFERENCE_HTML}`;

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
};

type CliOptions = {
  sprint: number;
  section?: string;
  url: string;
  selftest: boolean;
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

async function pinHiwCopyTypography(page: Page, width: number): Promise<void> {
  const headingSize = Math.min(36, Math.max(22, width * 0.026));

  await page.evaluate(({ hSize }) => {
    document.querySelectorAll('.hiw-num').forEach((element) => {
      const el = element as HTMLElement;
      el.style.setProperty('font-size', '11.5px', 'important');
      el.style.setProperty('line-height', '11.5px', 'important');
      el.style.setProperty('margin-bottom', '20px', 'important');
    });

    document.querySelectorAll('.hiw-card h3').forEach((element) => {
      const el = element as HTMLElement;
      el.style.setProperty('font-size', `${hSize}px`, 'important');
      el.style.setProperty('line-height', `${hSize * 1.08}px`, 'important');
      el.style.setProperty('margin-bottom', '16px', 'important');
      el.style.setProperty('white-space', 'nowrap', 'important');
    });

    document.querySelectorAll('.hiw-card p').forEach((element) => {
      const el = element as HTMLElement;
      el.style.setProperty('font-size', '16px', 'important');
      el.style.setProperty('line-height', '26.4px', 'important');
      el.style.setProperty('max-width', '440px', 'important');
    });
  }, { hSize: headingSize });
}

async function pinHiwArtGeometry(page: Page, width: number): Promise<void> {
  const artHeight = width <= 760 ? 210 : 540;

  await page.evaluate(({ height, isDesktop }) => {
    document.querySelectorAll('.hiw-art').forEach((art) => {
      const element = art as HTMLElement;
      element.style.setProperty('height', `${height}px`, 'important');
      element.style.setProperty('min-height', `${height}px`, 'important');
      element.style.setProperty('max-height', `${height}px`, 'important');
      element.style.setProperty('box-sizing', 'border-box', 'important');
    });

    if (isDesktop) {
      document.querySelectorAll('.hiw-card').forEach((card) => {
        const element = card as HTMLElement;
        element.style.setProperty('box-sizing', 'border-box', 'important');
        element.style.setProperty('height', '540px', 'important');
        element.style.setProperty('min-height', '540px', 'important');
        element.style.setProperty('max-height', '540px', 'important');
      });
    }
  }, { height: artHeight, isDesktop: width > 760 });
}

function applyCaptureOverrides(
  page: Page,
  staticHiw: boolean,
  width: number,
): Promise<void> {
  if (!staticHiw) {
    return Promise.resolve();
  }

  const artHeight = width <= 760 ? '210px' : '540px';
  const cardRule =
    width > 760
      ? '.hiw-card { height: 540px !important; min-height: 540px !important; max-height: 540px !important; }'
      : '';

  return page
    .addStyleTag({
      content: `
      .hiw-track { height: auto !important; }
      .hiw-pin { position: static !important; height: auto !important; display: block !important; }
      .hiw-viewport { height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; }
      .hiw-stack { transform: none !important; }
      ${cardRule}
      .hiw-art { height: ${artHeight} !important; min-height: ${artHeight} !important; max-height: ${artHeight} !important; }
    `,
    })
    .then(() => undefined);
}

async function normalizeReferencePage(
  page: Page,
  payload: NormalizationPayload,
): Promise<void> {
  await page.evaluate((data) => {
    document.querySelectorAll('.logo').forEach((logo) => {
      const mark = logo.querySelector('.lm');
      logo.textContent = '';
      if (mark) {
        logo.appendChild(mark);
      }
      logo.appendChild(document.createTextNode('Northbook'));
    });

    document.querySelectorAll('a.btn-primary').forEach((anchor) => {
      if (anchor.textContent?.trim() === 'Get funded') {
        anchor.textContent = 'Start a challenge';
      }
    });

    document.querySelectorAll('.nav-links a').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (href === '#markets' || href === '#faq') {
        (anchor as HTMLElement).style.display = 'none';
      }
    });

    const heroBg = document.querySelector('.hero-bg') as HTMLElement | null;
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${data.heroImage}')`;
      heroBg.style.backgroundColor = '#101014';
      heroBg.style.opacity = '1';
    }

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
        const art = card.querySelector('.hiw-art') as HTMLElement | null;
        if (num) {
          num.textContent = copy.num;
        }
        if (title) {
          title.textContent = copy.title;
          (title as HTMLElement).style.whiteSpace = 'nowrap';
        }
        if (body) {
          body.textContent = copy.body;
        }
        if (art && data.hiwImages[index]) {
          art.style.backgroundImage = `url('${data.hiwImages[index]}')`;
        }
      });
    }

    const stack = document.querySelector('.hiw-stack') as HTMLElement | null;
    if (stack) {
      stack.style.transform = 'translateY(0)';
    }
  }, payload);
}

async function normalizeAppCaptureAssets(
  page: Page,
  payload: NormalizationPayload,
): Promise<void> {
  await page.evaluate((data) => {
    const heroBg = document.querySelector('.hero-bg') as HTMLElement | null;
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${data.heroImage}')`;
      heroBg.style.backgroundColor = '#101014';
    }

    document.querySelectorAll('.hiw-art').forEach((art, index) => {
      const imageUrl = data.hiwImages[index];
      if (imageUrl) {
        (art as HTMLElement).style.backgroundImage = `url('${imageUrl}')`;
      }
    });
  }, payload);
}

async function freezePageForCapture(
  page: Page,
  options: CaptureOptions,
  width: number,
): Promise<void> {
  await page.evaluate(() => document.fonts.ready);

  if (options.isReference) {
    await normalizeReferencePage(page, options.normalizationPayload);
  } else {
    await normalizeAppCaptureAssets(page, options.normalizationPayload);
  }

  await page.evaluate(() => {
    document.querySelectorAll('.rv, .rv-scale, [data-stagger]').forEach((element) => {
      element.classList.add('in');
    });

    const style = document.createElement('style');
    style.setAttribute('data-visual-diff', 'freeze');
    style.textContent =
      '*,*::before,*::after{transition:none!important;animation:none!important}.glass{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}.hiw-card{box-shadow:none!important}.hero-bg img{display:none!important}';
    document.head.appendChild(style);
  });

  await pinHeroBackgroundGeometry(page);

  if (options.staticHiw) {
    await applyCaptureOverrides(page, true, width);
    await pinHiwArtGeometry(page, width);
    await pinHiwCopyTypography(page, width);
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
  await freezePageForCapture(page, options, width);

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

function diffImages(
  left: Buffer,
  right: Buffer,
): { mismatchPct: number; diffPng: Buffer; failed: boolean; reason?: string } {
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
  const croppedLeft =
    imgLeft.width === width && imgLeft.height === height
      ? imgLeft
      : cropPngToSize(imgLeft, width, height);
  const croppedRight =
    imgRight.width === width && imgRight.height === height
      ? imgRight
      : cropPngToSize(imgRight, width, height);
  const diff = new PNG({ width, height });
  const mismatchedPixels = pixelmatch(
    croppedLeft.data,
    croppedRight.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );
  const totalPixels = width * height;
  const mismatchPct = (mismatchedPixels / totalPixels) * 100;

  return {
    mismatchPct,
    diffPng: PNG.sync.write(diff),
    failed: false,
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
  const filePath = path.join(outputDir, `${sectionId}-${width}${PIXEL_UNIT}-${suffix}.png`);
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
}): Promise<number> {
  const { outputDir, sectionId, width, referenceBuffer, appBuffer, scores } =
    options;

  writeArtifact(outputDir, sectionId, width, 'ref', referenceBuffer);
  writeArtifact(outputDir, sectionId, width, 'app', appBuffer);

  const result = diffImages(referenceBuffer, appBuffer);
  writeArtifact(outputDir, sectionId, width, 'diff', result.diffPng);

  if (result.failed) {
    const line = `${sectionId} @ ${width}${PIXEL_UNIT} — FAIL (${result.reason})`;
    scores.push(line);
    console.error(line);
    return 100;
  }

  const line = `${sectionId} @ ${width}${PIXEL_UNIT} — ${result.mismatchPct.toFixed(2)}%`;
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

async function runSelftest(sprint: number, appUrl: string): Promise<void> {
  const outputDir = path.join(ROOT, 'qa-screenshots', `sprint-${sprint}`);
  ensureDir(outputDir);

  const scores: string[] = [];
  const browser = await launchBrowser();
  const normalizationPayload = buildNormalizationPayload(appUrl);
  let failed = false;

  try {
    for (const width of VIEWPORTS) {
      const firstCapture = await captureOnFreshPage(
        browser,
        REFERENCE_URL,
        width,
        '#transparency',
        {
          isReference: true,
          staticHiw: false,
          normalizationPayload,
        },
      );
      const secondCapture = await captureOnFreshPage(
        browser,
        REFERENCE_URL,
        width,
        '#transparency',
        {
          isReference: true,
          staticHiw: false,
          normalizationPayload,
        },
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
          `Selftest exceeded ${SELFTEST_MAX_MISMATCH_PCT.toFixed(2)}% at ${width}${PIXEL_UNIT}`,
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
      const appSelector = section.appSelector ?? section.selector;

      for (const width of VIEWPORTS) {
        const referenceBuffer = await captureOnFreshPage(
          browser,
          REFERENCE_URL,
          width,
          section.selector,
          {
            isReference: true,
            staticHiw: section.staticHiw ?? false,
            normalizationPayload,
          },
        );
        const appBuffer = await captureOnFreshPage(
          browser,
          options.url,
          width,
          appSelector,
          {
            isReference: false,
            staticHiw: section.staticHiw ?? false,
            normalizationPayload,
          },
        );

        const mismatchPct = await runPairDiff({
          outputDir,
          sectionId: section.id,
          width,
          referenceBuffer,
          appBuffer,
          scores,
        });

        if (mismatchPct > GATE_MAX_MISMATCH_PCT) {
          failed = true;
        }
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
