import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium, type Browser, type Page } from 'playwright';

const VIEWPORTS = [360, 560, 900, 1180] as const;

type SectionConfig = {
  id: string;
  selector: string;
};

/** Sprint 1+ sections register here. Empty for Sprint 0 harness-only. */
const SECTIONS: Record<string, SectionConfig> = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REFERENCE_HTML = path.join(ROOT, 'reference/payout-landing-v2_0_30.html');
const REFERENCE_URL = `file://${REFERENCE_HTML}`;

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

async function preparePage(page: Page, targetUrl: string, width: number): Promise<void> {
  await page.setViewportSize({ width, height: 1200 });
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

async function screenshotSelector(
  page: Page,
  selector: string,
): Promise<Buffer> {
  const element = page.locator(selector).first();
  await element.waitFor({ state: 'visible' });
  const screenshot = await element.screenshot();
  if (!screenshot) {
    throw new Error(`Failed to capture screenshot for selector ${selector}`);
  }
  return screenshot;
}

function diffImages(
  left: Buffer,
  right: Buffer,
): { mismatchPct: number; diffPng: Buffer; failed: boolean; reason?: string } {
  const imgLeft = PNG.sync.read(left);
  const imgRight = PNG.sync.read(right);

  if (imgLeft.width !== imgRight.width || imgLeft.height !== imgRight.height) {
    return {
      mismatchPct: 100,
      diffPng: left,
      failed: true,
      reason: `Dimension mismatch: ${imgLeft.width}x${imgLeft.height} vs ${imgRight.width}x${imgRight.height}`,
    };
  }

  const diff = new PNG({ width: imgLeft.width, height: imgLeft.height });
  const mismatchedPixels = pixelmatch(
    imgLeft.data,
    imgRight.data,
    diff.data,
    imgLeft.width,
    imgLeft.height,
    { threshold: 0.1 },
  );
  const totalPixels = imgLeft.width * imgLeft.height;
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
}): Promise<number> {
  const { outputDir, sectionId, width, referenceBuffer, appBuffer, scores } =
    options;

  writeArtifact(outputDir, sectionId, width, 'ref', referenceBuffer);
  writeArtifact(outputDir, sectionId, width, 'app', appBuffer);

  const result = diffImages(referenceBuffer, appBuffer);
  writeArtifact(outputDir, sectionId, width, 'diff', result.diffPng);

  if (result.failed) {
    const line = `${sectionId} @ ${width}px — FAIL (${result.reason})`;
    scores.push(line);
    console.error(line);
    return 100;
  }

  const line = `${sectionId} @ ${width}px — ${result.mismatchPct.toFixed(2)}%`;
  scores.push(line);
  console.log(line);
  return result.mismatchPct;
}

async function runSelftest(sprint: number): Promise<void> {
  const outputDir = path.join(ROOT, 'qa-screenshots', `sprint-${sprint}`);
  ensureDir(outputDir);

  const scores: string[] = [];
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    for (const width of VIEWPORTS) {
      await preparePage(page, REFERENCE_URL, width);
      const screenshot = await screenshotSelector(page, '#transparency');
      await runPairDiff({
        outputDir,
        sectionId: 'transparency-selftest',
        width,
        referenceBuffer: screenshot,
        appBuffer: screenshot,
        scores,
      });
    }
  } finally {
    await page.close();
    await browser.close();
  }

  const scoresPath = path.join(outputDir, 'scores.txt');
  fs.writeFileSync(scoresPath, `${scores.join('\n')}\n`);
  console.log(`Scores written to ${scoresPath}`);
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
  const appPage = await browser.newPage();
  const refPage = await browser.newPage();

  try {
    for (const section of sectionEntries) {
      for (const width of VIEWPORTS) {
        await preparePage(refPage, REFERENCE_URL, width);
        const referenceBuffer = await screenshotSelector(refPage, section.selector);

        await preparePage(appPage, options.url, width);
        const appBuffer = await screenshotSelector(appPage, section.selector);

        await runPairDiff({
          outputDir,
          sectionId: section.id,
          width,
          referenceBuffer,
          appBuffer,
          scores,
        });
      }
    }
  } finally {
    await appPage.close();
    await refPage.close();
    await browser.close();
  }

  const scoresPath = path.join(outputDir, 'scores.txt');
  fs.writeFileSync(scoresPath, `${scores.join('\n')}\n`);
  console.log(`Scores written to ${scoresPath}`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.selftest) {
    await runSelftest(options.sprint);
    return;
  }

  await runVisualDiff(options);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
