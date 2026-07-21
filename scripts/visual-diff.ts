/**
 * Visual regression stub — full wiring in Sprint 0.
 *
 * Planned flow:
 * 1. Open reference HTML via file:// (reference/payout-landing-v2_0_30.html)
 * 2. Screenshot live Next.js page at 360 / 560 / 900 / 1180px per section
 * 3. Diff with pixelmatch
 * 4. Write PNG diffs + numeric mismatch % to qa-screenshots/
 */

const VIEWPORTS = [360, 560, 900, 1180] as const;

async function main() {
  console.log('visual-diff: stub only — Sprint 0 wiring pending.');
  console.log('Target viewports (px):', VIEWPORTS.join(', '));
  console.log('Output directory: qa-screenshots/');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
