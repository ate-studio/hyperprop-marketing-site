# Sprint 3 Self-QA Scorecard — Markets, FAQ, Nav

Branch: `feat/landing-sprint-3-markets-faq`  
Base: `8d5c351` (main)  
Date: 2026-07-22

## 10-Gate Rubric

| Gate | Score | Evidence |
|------|-------|----------|
| 1. Visual fidelity | ✅ | `npm run visual-diff -- --sprint 3 --url http://localhost:3000` — all registered sections ≤2% at 360/560/900/1180. New: markets, faq; nav updated with Markets/FAQ links. Artifacts: `qa-screenshots/sprint-3/*.png`, `scores.txt`. |
| 2. Design token compliance | ✅ | `rg` hex/px grep on `components/` + `app/*.tsx` clean; no inline `style=` in components. |
| 3. Theme integrity | ✅ | Markets/FAQ use token-only CSS in `globals.css`; no theme-conditional branches in components. |
| 4. Color & type discipline | ✅ | STIX section h2, Plex Mono table/disclaimer, Inter FAQ prose; `--up`/`--down` on change columns only. |
| 5. Responsive behavior | ✅ | `scrollWidth === innerWidth` at 360/560/900/1180. Markets: 3-col table ≤760px, spotlight stacks ≤900px, sticky `.mkt-left` ≥860px. |
| 6. Accessibility | ✅ | FAQ: native `<button>`, `aria-expanded`/`aria-controls`, single-open accordion, `:focus-visible` ring. All items closed on load. `prefers-reduced-motion` disables FAQ/market motion transitions. |
| 7. Next.js best practice | ✅ | `Markets` server component (zero client JS). Client components exactly **5**: Nav, HeroRotator, HowItWorks, PricingTabs, Faq. No client fetch. |
| 8. Performance | ✅ | `npm run build` succeeds with zero warnings. Lighthouse mobile not run in this environment — not reported. |
| 9. Code architecture | ✅ | Data in `lib/markets.ts`; candle renderer in `lib/market-candles.tsx`; `fmtPx` in `lib/format.ts`; shared Button/Eyebrow/Wrap. |
| 10. Build hygiene & copy | ✅ | `npm run lint` + `npm run typecheck` pass. FAQ copy verbatim from reference. Markets disclaimer: "Indicative snapshot · not live data". PENDING markers on 70+ count, terminal URL, indexer wiring. |

**Total: 10/10**

## Visual-diff scores (≤2% gate)

```
nav @ 360–1180px — 0.00%
hero @ 360–1180px — 0.00–0.06%
proof @ 360–1180px — 0.15–0.30%
pricing @ 360–1180px — 0.00–0.10%
transparency @ 360–1180px — 0.00–0.13%
hiw-card @ 360–1180px — 0.36–0.90%
footer @ 360–1180px — 0.00%
markets @ 360px — 0.18%
markets @ 560px — 0.32%
markets @ 900px — 0.07%
markets @ 1180px — 0.08%
faq @ 360–1180px — 0.00%
```

Selftest (reference determinism): transparency-selftest @ 360–1180px — 0.00%

## Harness notes

- Added `markets` / `faq` to `SECTIONS` map.
- Removed nav normalization that hid `#markets` / `#faq` links.
- Reference freeze: `.mkt-row.in`, static `#mkt-rot` → "Crypto", disclaimer appended to `.mkt-table`, injected `.mkt-disclaimer` CSS.
- Section CTA covered by existing "Get funded" → "Start a challenge" normalization.

## Fixes during QA

- `components/landing/faq.tsx` + `.faq-q { line-height: normal }` — 61px section height drift vs reference button line-height (same root cause as Sprint 2 pricing tabs).

## Commands run

```bash
npm run build
npm run lint
npm run typecheck
npm run visual-diff -- --sprint 3 --url http://localhost:3000
npm run visual-diff -- --sprint 3 --url http://localhost:3000 --selftest
rg -n '#[0-9a-fA-F]{3,6}|[0-9]+px' components/ app/*.tsx  # clean
rg -n 'style=' components/ app/*.tsx  # empty
```

## PENDING (sanctioned)

- `lib/markets.ts` — wire to indexer API (snapshot values, not live)
- Markets h2 — confirm "70+" markets claim with CTO
- `.mkt-more` — confirm terminal URL and "+56" count with CTO
