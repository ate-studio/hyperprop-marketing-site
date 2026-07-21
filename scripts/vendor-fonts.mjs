import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FONTS_DIR = path.join(ROOT, 'reference', 'fonts');

const GOOGLE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=STIX+Two+Text:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&display=swap';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      })
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(FONTS_DIR, { recursive: true });

  const css = execSync(
    `curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${GOOGLE_FONTS_CSS}"`,
    { encoding: 'utf8' },
  );

  const urlToFile = new Map();
  const blocks = css.match(/@font-face\s*\{[^}]+\}/g) ?? [];
  const outBlocks = [];

  for (const block of blocks) {
    const family = block.match(/font-family:\s*'([^']+)'/)?.[1];
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1] ?? '400';
    const style = block.match(/font-style:\s*(\w+)/)?.[1] ?? 'normal';
    const urls = [...block.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map(
      (match) => match[1],
    );
    if (!family || urls.length === 0) {
      continue;
    }

    const localUrls = [];
    for (const url of urls) {
      if (!urlToFile.has(url)) {
        const filename = path.basename(new URL(url).pathname);
        urlToFile.set(url, filename);
        const dest = path.join(FONTS_DIR, filename);
        if (!fs.existsSync(dest)) {
          process.stdout.write(`Downloading ${filename}\n`);
          await download(url, dest);
        }
      }
      localUrls.push(`url('./${urlToFile.get(url)}') format('woff2')`);
    }

    const unicode = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    outBlocks.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: ${localUrls.join(', ')};
${unicode ? `  unicode-range: ${unicode};` : ''}
}`);
  }

  fs.writeFileSync(path.join(FONTS_DIR, 'faces.css'), `${outBlocks.join('\n\n')}\n`);
  console.log(
    `Wrote ${urlToFile.size} woff2 files and ${outBlocks.length} @font-face blocks`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
