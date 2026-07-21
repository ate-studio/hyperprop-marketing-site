# Sprint 2 Self-QA Scorecard — Pricing, Transparency, Comparison, Footer, Meta

Branch: `feat/landing-sprint-2-pricing-transparency`  
Base: `242b22d` (main)  
Date: 2026-07-21

## 10-Gate Rubric

| Gate | Score | Evidence |
|------|-------|----------|
| 1. Visual fidelity | ✅ | `npm run visual-diff -- --sprint 2 --url http://localhost:3000` — all registered sections ≤2% at 360/560/900/1180. Comparison intentionally absent from harness (no reference section). Artifacts: `qa-screenshots/sprint-2/*.png`, `scores.txt`. |
| 2. Design token compliance | ✅ | `rg` hex/px grep on `components/` + `app/*.tsx` clean; no inline `style=` in components. |
| 3. Theme integrity | ✅ | `#transparency.sec-invert` computed flip verified in running app: section `backgroundColor: rgb(246, 245, 241)` vs hero dark; panel `rgb(253, 253, 251)`; ink on rows `rgb(19, 20, 23)`. Token-only — no theme-conditional branches in components. |
| 4. Color & type discipline | ✅ | STIX h2, Plex Mono data rows/labels, Inter prose; `--up`/`--down` on yes/no markers; Discord `#5865F2` unchanged in nav. |
| 5. Responsive behavior | ✅ | `scrollWidth === innerWidth` at 360/560/900/1180. Breakpoint stacking matches reference (trans-grid 1-col ≤960, plans 2-col ≤900, 1-col ≤560, feed-row `.tx` hidden ≤760). |
| 6. Accessibility | ✅ | Pricing tabs: `role=tablist/tab`, `aria-selected`, ArrowLeft/ArrowRight, `:focus-visible` ring. Exactly one `h1`. `prefers-reduced-motion` disables plan hover transforms + hiw pin. Comparison uses real `<table>` with sr-only caption + `scope`. |
| 7. Next.js best practice | ✅ | Server components default; client limited to Nav, HeroRotator, HowItWorks, PricingTabs (4). Metadata via `layout.tsx` export. Static page, no client fetch. |
| 8. Performance | ✅ | `npm run build` succeeds with zero compile/lint warnings. Lighthouse mobile not run in this environment — not reported. |
| 9. Code architecture | ✅ | Shared `Button`, `Eyebrow`, `Wrap`; typed props; data in `lib/pricing.ts`, `lib/transparency.ts`; CVA buttons. |
| 10. Build hygiene & copy | ✅ | `npm run lint` + `npm run typecheck` pass. Four verifiable comparison rows only. PENDING markers on pricing/checkout, rebate, reserve, explorer URLs, rules hash, geo copy. |

**Total: 10/10**

## Visual-diff scores (≤2% gate)

Post audit fix #17 (integer paint-origin snap on capture targets):

```
pricing @ 360px — 0.00%
pricing @ 560px — 0.10%
pricing @ 900px — 0.00%
pricing @ 1180px — 0.00%
transparency @ 360px — 0.13%
transparency @ 560px — 0.00%
transparency @ 900px — 0.00%
transparency @ 1180px — 0.00%
footer @ 360px — 0.00%
footer @ 560px — 0.00%
footer @ 900px — 0.00%
footer @ 1180px — 0.00%
hiw-card @ 360–1180px — 0.36–0.90%
```

Prior run (pre-snap) peaked at footer 1.94%, pricing 1.16%, transparency 1.51%.

## Harness notes

- **Comparison** not registered in `SECTIONS` (no reference HTML target; gate 1 = style conformance + CTO review).
- Reference normalization: pricing h2/CTA copy, transparency static metrics, footer legal placeholders, **footer-scoped** Payout→Northbook (global replace broke chart h3 wrap at 560px).
- Footer capture: fixed nav hidden on both sides to avoid overlay false positives.
- Transparency dot chart: server-rendered; reference hover tooltip omitted in v1 (noted here).

## Commands run

```bash
npm run build
npm run lint
npm run typecheck
npm run visual-diff -- --sprint 2 --url http://localhost:3000
rg -n '#[0-9a-fA-F]{3,6}|[0-9]+px' components/ app/*.tsx  # clean (globals.css only for literals)
rg -n 'style=' components/ app/*.tsx  # empty
```

## PENDING (sanctioned)

- Pricing figures / splits — offer sheet placeholders in `lib/pricing.ts`
- Rebate claim, checkout URL, demo URL, compare-plans URL — CTO confirm
- Reserve ≥15–20% claim, explorer URL — CTO confirm
- Rules hash, geo-restriction copy — counsel / rulebook pipeline
- OG image `/images/hero-markets.png` — final asset pending
