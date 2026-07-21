# Sprint 1 self-QA scorecard (partial — not 10/10)

Branch: `feat/landing-sprint-1-hero-nav-proof-how`  
Production diff target: `npm run build && npm run start -- -p 3000`  
Harness: `npm run visual-diff -- --sprint 1 --url http://localhost:3000`

## Visual diff (gate 1)

| Section   | 360px | 560px | 900px | 1180px |
|-----------|-------|-------|-------|--------|
| nav       | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ | 0.00% ✅ |
| hero      | 12.10% ❌ | 7.95% ❌ | 2.11% ❌ | 1.12% ✅ |
| proof     | 0.81% ✅ | 0.81% ✅ | 0.50% ✅ | 0.78% ✅ |
| hiw-card  | 0.10% ✅ | 24.43% ❌ | 19.77% ❌ | 20.36% ❌ |

Root cause (investigated):
- **hiw-card @ 560+**: `.hiw-art` backgrounds match at 0.00% when isolated; full-card mismatch is overwhelmingly in `.hiw-copy` (Inter/next/font vs reference Google Fonts metrics) and at desktop widths a 540px vs 541px art column height shifts `background-size: cover` crop.
- **hero @ 360/560**: hero-bg pixel crop differs between reference (CSS bg) and app (CSS bg + hidden next/image layer) across the large min-height viewport; desktop widths pass.

## Other gates

| Gate | Status | Notes |
|------|--------|-------|
| 2 Token compliance | ✅ | `grep` clean on `components/`, `app/*.tsx`, `app/tokens/` |
| 3 Theme integrity | ⚠️ | Not manually re-verified this cycle |
| 4 Color & type | ✅ | Reference wins applied (mono stat `.v`, sans uppercase `.hiw-card h3`, serif hero `em`) |
| 5 Responsive | ⚠️ | No horizontal scroll observed; mid-width hiw/hero diffs remain |
| 6 A11y | ⚠️ | Landmarks + one h1 + reduced-motion paths implemented; Lighthouse not run |
| 7 Next.js | ✅ | Exactly 3 `"use client"` files; `next/image` + hero `priority` only |
| 8 Performance | ⚠️ | `npm run build` clean; Lighthouse not run |
| 9 Architecture | ✅ | UI primitives in `components/ui/`; CVA + typed props |
| 10 Hygiene | ✅ | lint + typecheck pass; PENDING markers use exact format |

## Out of scope (not built)

Pricing, transparency, comparison, footer, ticker, venue strip, brand film, markets, developers, FAQ, join, final CTA, hamburger nav.

## Recommended next steps

1. Align capture fonts: inject reference Google Fonts stylesheet on app during visual-diff freeze **or** serve reference HTML from the same origin as the app.
2. Pin `.hiw-art` height to exactly 540px (desktop) / 210px (mobile) via inline styles on **both** ref and app before screenshot (verify computed height in harness).
3. Hero mobile: use CSS-only hero background during capture (already partially done); consider identical hero-bg geometry pin on both sides.
