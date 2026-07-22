# Sprint 4 Self-QA Scorecard — Live data layer, ticker, venue strip

Branch: `feat/landing-sprint-4-live-data`  
Base: `fc1f9c0` (main)  
Date: 2026-07-22

## 10-Gate Rubric

| Gate | Score | Evidence |
|------|-------|----------|
| 1. Visual fidelity | ✅ | `npm run build && npm run start:qa -- -p 3000` then `npm run visual-diff -- --sprint 4 --url http://localhost:3000` — all registered sections ≤2% at 360/560/900/1180. New: venue, ticker. Artifacts: `qa-screenshots/sprint-4/*.png`, `scores.txt`. |
| 2. Design token compliance | ✅ | `rg` hex/px grep on `components/` + `app/*.tsx` clean except sanctioned Hyperliquid SVG fills (`#97fce4`, `#fff`) inside `hyperliquid-logo.tsx` only. No inline `style=` attributes in components. |
| 3. Theme integrity | ✅ | Venue/ticker/provenance use token-only CSS in `globals.css`; no theme-conditional branches in components. |
| 4. Color & type discipline | ✅ | Hyperliquid brand mark ported verbatim with owner-approved `#97fce4` / `#fff` fills confined to SVG. `--up`/`--down` on ticker + market direction only. |
| 5. Responsive behavior | ✅ | `scrollWidth === innerWidth` at 360/560/900/1180. Ticker/venue center and reflow per reference CSS. |
| 6. Accessibility | ✅ | Venue SVG `role="img"` + `aria-label="Hyperliquid"`. Ticker `aria-hidden="true"` (decorative). FAQ accordion unchanged. |
| 7. Next.js best practice | ✅ | `app/page.tsx` async server component with `revalidate = 60`. Client components exactly **5** (Nav, HeroRotator, HowItWorks, PricingTabs, Faq). Data layer adds zero client JS. |
| 8. Performance | ✅ | `npm run build` succeeds with zero warnings. Lighthouse mobile not run in this environment — not reported. |
| 9. Code architecture | ✅ | `lib/data/` adapters (config, sourced, hyperliquid, indexer, page-data); presentational section props via `Sourced<T>`. Zod validation on live payloads. |
| 10. Build hygiene & copy | ✅ | `npm run lint` + `npm run typecheck` pass. Dynamic provenance labels per voice spec. PENDING on indexer shapes + existing CTO markers retained. |

**Total: 10/10**

## Visual-diff scores (≤2% gate)

```
nav @ 360–1180px — 0.00%
hero @ 360–1180px — 0.00–0.06%
proof @ 360–1180px — 0.15–0.26%
pricing @ 360–1180px — 0.00%
transparency @ 360–1180px — 0.00–0.15%
hiw-card @ 360–1180px — 0.00–0.27%
footer @ 360–1180px — 0.00%
markets @ 360–1180px — 0.07–0.32%
faq @ 360–1180px — 0.00%
venue @ 360–1180px — 0.00%
ticker @ 360–1180px — 0.00%
```

Selftest: transparency-selftest @ 360–1180px — 0.00%

## Live-mode evidence (`npm run data-smoke`)

```
Markets source: live asOf=2026-07-22T03:47:11.851Z
Top mapped rows:
1. BTC-USDC last=$66,303.2 chg=1.24% fund=0.0013% vol=$2.1B
2. ETH-USDC last=$1,933.9 chg=0.37% fund=0.0013% vol=$788M
3. HYPE-USDC last=$60.2883 chg=-3.69% fund=-0.0018% vol=$321M
4. SOL-USDC last=$78.0890 chg=-0.18% fund=-0.0001% vol=$104M
5. ZEC-USDC last=$531.21 chg=-3.40% fund=0.0013% vol=$81M
6. XRP-USDC last=$1.1408 chg=1.54% fund=0.0009% vol=$81M
7. PUMP-USDC last=$0.002048 chg=2.04% fund=0.0013% vol=$34M
8. LIT-USDC last=$2.3468 chg=4.60% fund=0.0013% vol=$23M
9. ONDO-USDC last=$0.39888 chg=9.82% fund=0.0013% vol=$20M
10. NEAR-USDC last=$1.9244 chg=-4.88% fund=0.0013% vol=$16M
11. DOGE-USDC last=$0.073358 chg=0.97% fund=0.0013% vol=$14M
12. CASHCAT-USDC last=$0.063563 chg=-19.57% fund=0.0144% vol=$12M
Featured: BTC-USDC $66,303.2
Candle count: 18
```

Fixtures committed: `reference/fixtures/hyperliquid-metaAndAssetCtxs.json`, `reference/fixtures/hyperliquid-candleSnapshot-btc-1h.json`.

## Harness notes

- QA server: `npm run start:qa` (`DATA_MODE=placeholder`).
- Added `venue` / `ticker` to `SECTIONS`.
- Reference normalization: rebuild ticker from app placeholder rows; append provenance lines to proof strip + transparency; ticker track frozen at `translateX(0)`.

## Commands run

```bash
npm install zod
npm run build
npm run lint
npm run typecheck
npm run start:qa -- -p 3000
npm run visual-diff -- --sprint 4 --url http://localhost:3000
npm run visual-diff -- --sprint 4 --url http://localhost:3000 --selftest
npm run data-smoke
rg -n '#[0-9a-fA-F]{3,6}|[0-9]+px' components/ app/*.tsx  # SVG brand exception only
rg -n 'style=' components/ app/*.tsx  # empty
```

## PENDING (sanctioned)

- `lib/data/indexer.ts` — confirm endpoint shapes with CTO before backend build
- Existing markets/terminal/indexer PENDING markers from prior sprints retained
