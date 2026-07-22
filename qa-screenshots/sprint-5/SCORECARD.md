# Sprint 5 Self-QA Scorecard — Join, Final CTA, page completion

Branch: `feat/landing-sprint-5-join-final`  
Base: `522c014` (main)  
Date: 2026-07-22

## 10-Gate Rubric

| Gate | Score | Evidence |
|------|-------|----------|
| 1. Visual fidelity | ✅ | `npm run build && npm run start:qa -- -p 3000` then `npm run visual-diff -- --sprint 5 --url http://localhost:3000` — all registered sections ≤2% at 360/560/900/1180. New: join, final, final-art. Artifacts: `qa-screenshots/sprint-5/*.png`, `scores.txt`. |
| 2. Design token compliance | ✅ | `rg` hex grep on `components/` + `app/` clean except sanctioned exceptions: Hyperliquid SVG fills in `hyperliquid-logo.tsx`; Discord `#5865f2` in `globals.css` `.btn-discord` (gate-4). No inline `style=` in components. |
| 3. Theme integrity | ✅ | Join/final/dither use token-only CSS in `globals.css`; no theme-conditional branches in components. |
| 4. Color & type discipline | ✅ | `--up` on `.join-ok` success line only. Discord brand `#5865F2` confined to `.btn-discord`. Final h2 `em` uses `--blueprint-light`. |
| 5. Responsive behavior | ✅ | `scrollWidth === innerWidth` at 360/560/900/1180. Join grid stacks ≤900px per reference. |
| 6. Accessibility | ✅ | JoinForm: native email validation, focus rings on input, `aria-live="polite"` on success line. Discord SVG `aria-hidden`. Final dither decorations `aria-hidden`. |
| 7. Next.js best practice | ✅ | `Join` + `FinalCta` server components; `subscribe` Server Action with zod. Client components exactly **6**: Nav, HeroRotator, HowItWorks, PricingTabs, Faq, **JoinForm**. |
| 8. Performance | ✅ | `npm run build` succeeds with zero warnings. Final CTA background is CSS-only (no `next/image`). Lighthouse mobile not run in this environment — not reported. |
| 9. Code architecture | ✅ | Mailing list isolated in `app/actions/subscribe.ts`. Join panel layout/CSS ported from reference. Harness join/final normalization in separate evaluate. |
| 10. Build hygiene & copy | ✅ | `npm run lint` + `npm run typecheck` pass. Page order: … Markets → Faq → Join → FinalCta → Footer. PENDING markers retained per spec. |

**Total: 10/10**

## Client components (6)

1. `Nav` — `components/landing/nav.tsx`
2. `HeroRotator` — `components/landing/hero-rotator.tsx`
3. `HowItWorks` — `components/landing/how-it-works.tsx`
4. `PricingTabs` — `components/landing/pricing-tabs.tsx`
5. `Faq` — `components/landing/faq.tsx`
6. `JoinForm` — `components/landing/join-form.tsx`

## Visual-diff scores (≤2% gate)

```
nav @ 360–1180px — 0.00%
hero @ 360–1180px — 0.00%
hero-art @ 360–1180px — 0.00–0.06% (4x)
proof @ 360–1180px — 0.15–0.26%
pricing @ 360–1180px — 0.00%
transparency @ 360–1180px — 0.00–0.15%
hiw-card @ 360–1180px — 0.00–0.27%
hiw-card-art @ 360–1180px — 0.00% (4x)
footer @ 360–1180px — 0.00%
markets @ 360–1180px — 0.07–0.32%
faq @ 360–1180px — 0.00%
venue @ 360–1180px — 0.00%
ticker @ 360–1180px — 0.00%
join @ 360–1180px — 0.02–0.06%
final @ 360–1180px — 0.00%
final-art @ 360–1180px — 0.00% (4x)
```

Selftest: transparency-selftest @ 360–1180px — 0.00%

## Harness notes

- QA server: `npm run start:qa` (`DATA_MODE=placeholder`).
- Added `join` / `final` to `SECTIONS`; `final` uses `maskPhotoLayers` + `final-art` downsampled capture.
- Reference normalization (separate evaluate): join copy/consent, final copy/CTA/dither, `.final` bg → local `/images/final-cta.png`.
- Capture freeze strips Next.js server-action hidden inputs from email forms.

## Commands run

```bash
npm run build
npm run lint
npm run typecheck
npm run start:qa -- -p 3000
npm run visual-diff -- --sprint 5 --url http://localhost:3000
npm run visual-diff -- --sprint 5 --url http://localhost:3000 --selftest
# scrollWidth === innerWidth @ 360/560/900/1180 — PASS
rg -n '#[0-9a-fA-F]{3,6}' components/ app/  # Hyperliquid + Discord exceptions only
rg -n 'style=' components/ app/*.tsx  # hyperliquid-logo SVG style block only
```

## PENDING (sanctioned)

- `public/images/final-cta.png` — confirm final brand imagery with CTO
- `app/actions/subscribe.ts` — mailing-list provider integration
- Join copy — launch discount line omitted pending CTO
- Join consent copy — counsel review
- Discord invite URL (`href="#"`) pending CTO
- Prior sprint PENDING markers retained
