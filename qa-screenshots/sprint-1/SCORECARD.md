# Sprint 1 self-QA scorecard (partial — REJECT fix pass)

Branch: `feat/landing-sprint-1-hero-nav-proof-how`  
Production diff target: `npm run build && npm run start -- -p 3000`  
Harness: `npm run visual-diff -- --sprint 1 --url http://localhost:3000`

## Visual diff (gate 1)

| Section        | 360px | 560px | 900px | 1180px |
|----------------|-------|-------|-------|--------|
| nav            | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ |
| hero           | 3.67% ❌ | 2.75% ❌ | 2.01% ❌ | 0.95% ✅ |
| hero-art       | 3.12% ❌ | 2.46% ❌ | 1.65% ✅ | 0.89% ✅ |
| proof          | 0.20% ✅ | 0.31% ✅ | 0.19% ✅ | 0.30% ✅ |
| hiw-card       | 0.00% ✅ (304×422 vs 304×423) | 23.66% ❌ (504×397 vs 504×396) | 19.65% ❌ | 20.17% ❌ |
| hiw-card-art   | 0.00% ✅ | 42.65% ❌ | 37.85% ❌ | 39.02% ❌ |

Dimension tolerance notes are printed inline when ±1px cropping applies (see `scores.txt`).

### REJECT fix pass — verified

- `.hiw-card h3`: `overflow-wrap: break-word`; `white-space: nowrap` removed (app + harness mirrors deleted).
- Hero: single visible layer (`next/image` only); CSS bg + opacity hack removed; `unoptimized` dropped.
- How-it-works: hidden sr-only images removed; `staticLayout` hydration flip removed; `.hiw-static` moved to `prefers-reduced-motion` only; art via `.hiw-art-N` classes.
- Harness: typography/geometry pinning removed; photo layers masked for structure diffs; separate `-art` captures; app-side Google Fonts injection; glass/shadow capture disables removed; `px` score lines with dimension suffixes; asset normalization via stylesheet.

### Still open

- **hero @ 360–900**: structure diff ~2–3.7% — residual layout/type variance with masked photos; art layer ~2–3% at smaller widths (CSS `background-image` ref vs `next/image` app rasterization).
- **hiw-card @ 560+**: structure ~20–24% — desktop card typography/layout + restored `backdrop-filter` / `box-shadow` in diff.
- **hiw-card-art @ 560+**: ~38–43% despite identical normalized asset URLs and matching element box (502×211); likely `background-size: cover` crop / subpixel mismatch on desktop static-layout override — needs follow-up isolation.
- **Horizontal scroll @ 360px**: `document.scrollingElement.scrollWidth === 360` **fails** (app 475px, reference 400px). `#how h3` no longer overflows; offender is `.stats-grid` / `.stat` column sizing (pre-existing sprint-1 proof strip layout, not hiw).

## Other gates

| Gate | Status | Notes |
|------|--------|-------|
| 2 Token compliance | ✅ | `--ink-on-image-*` tokens added; repeated rgba literals promoted |
| 3 Theme integrity | ⚠️ | Not manually re-verified this cycle |
| 4 Color & type | ✅ | App capture injects reference Google Fonts; gate 4 still auditable via computed styles |
| 5 Responsive | ❌ | Horizontal scroll at 360px (proof strip); mid-width hero/hiw diffs remain |
| 6 A11y | ⚠️ | Landmarks + one h1 + reduced-motion paths; Lighthouse not run |
| 7 Next.js | ✅ | 3 client components; decorative hiw art is CSS-only (no hidden next/image) |
| 8 Performance | ⚠️ | `npm run build` clean; Lighthouse not run |
| 9 Architecture | ✅ | UI primitives in `components/ui/`; CVA + typed props |
| 10 Hygiene | ✅ | lint + typecheck pass; PENDING markers on STEPS/comments |

## Out of scope (not built)

Pricing, transparency, comparison, footer, ticker, venue strip, brand film, markets, developers, FAQ, join, final CTA, hamburger nav.
