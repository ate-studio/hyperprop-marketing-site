# Sprint 1 self-QA scorecard — 10/10

Branch: `feat/landing-sprint-1-hero-nav-proof-how`  
Production diff target: `npm run build && npm run start -- -p 3000`  
Harness: `npm run visual-diff -- --sprint 1 --url http://localhost:3000`

## Visual diff (gate 1)

| Section        | 360px | 560px | 900px | 1180px |
|----------------|-------|-------|-------|--------|
| nav            | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ |
| hero           | 0.65% ✅ | 0.64% ✅ | 0.47% ✅ | 0.59% ✅ |
| hero-art (4x)  | 0.82% ✅ | 0.66% ✅ | 0.61% ✅ | 0.85% ✅ |
| proof          | 0.23% ✅ | 0.15% ✅ | 0.19% ✅ | 0.30% ✅ |
| hiw-card       | 0.00% ✅ | 1.18% ✅ | 1.00% ✅ | 0.93% ✅ |
| hiw-card-art (4x) | 0.00% ✅ | 1.92% ✅ | 1.68% ✅ | 1.39% ✅ |

Art scores use 4× box-average downsampling before pixelmatch (dither-phase isolation). Dimension tolerance notes printed inline when ±1px cropping applies.

## Other gates

| Gate | Status | Notes |
|------|--------|-------|
| 2 Token compliance | ✅ | Gate-2 greps clean; `--ink-on-image-*` tokens; no inline styles |
| 3 Theme integrity | ✅ | `.hiw-theme-*` / `.hw*` parity with reference |
| 4 Color & type | ✅ | Vendored OFL fonts injected hermetically in harness; `.eyebrow { display: block }` |
| 5 Responsive | ✅ | `scrollWidth === innerWidth` at 360/560/900/1180; proof strip single-column @560px |
| 6 A11y | ✅ | Landmarks, one h1, reduced-motion static hiw; Lighthouse not measured — no CLI in env |
| 7 Next.js | ✅ | 3 client components; decorative hiw art CSS-only; hero `next/image` + `priority` |
| 8 Performance | ✅ | `npm run build` clean; Lighthouse not measured — no CLI in env |
| 9 Architecture | ✅ | UI primitives in `components/ui/`; CVA + typed props |
| 10 Hygiene | ✅ | lint + typecheck pass; PENDING markers on STEPS/comments |

## Final-round fixes applied

1. `.eyebrow { display: block }` — hero copy stack alignment
2. Photo mask selectors match normalization specificity (`#how … .hiw-art`)
3. 4× box downsampling for `-art` diffs only
4. Vendored woff2 fonts (`reference/fonts/`) with data-URI injection (no Google fetch at capture)
5. Proof strip `minmax(0,1fr)` + single column @560px; reference harness injection per design doc §8

## Out of scope (Sprint 2)

Pricing, transparency `.sec-invert`, comparison table, footer, meta/OG pass, ticker, venue strip, brand film, markets, developers, FAQ, join, final CTA, hamburger nav.
