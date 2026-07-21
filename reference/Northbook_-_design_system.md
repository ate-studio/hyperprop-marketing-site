# Design System — Payout
> Category: Fintech / Trading
> Crypto-native prop firm. Transparency-first: on-chain payouts, published metrics, machine-readable rules. Dark near-black default, light "audit" theme, one blueprint-blue accent, serif that shows its work.

Extracted from `payout-landing-v2_0_30.html`. Token values live in `tokens.json`.

## 1. Visual Theme & Atmosphere

Payout looks like a trading terminal that also happens to be a proof. The default surface is near-black (`#131417`), and the entire interface is built from a tight neutral base (one near-black, one off-white) plus a **single** accent — blueprint blue (`#5E8BFF`). There is no second brand hue; hierarchy comes from weight, type family, and the blue, not from a palette.

The signature move is the **type pairing**: a serif (`STIX Two Text`, the typeface of mathematical journals) carries every heading, price, and big number, while a monospace (`IBM Plex Mono`) handles uppercase labels, data rows, and transaction hashes, and `Inter` carries body copy. The serif "shows its work" — it reads like a proof, which is the brand's whole thesis. Numbers use tabular figures so ledgers and prices align.

A second defining trait is the **dual theme via token override**. The Transparency section flips to a light "audit" theme (`.sec-invert`) by re-valuing the *same* tokens — `--paper`, `--ink`, `--blueprint` all shift — so every component adapts automatically. Light = "here's the audited, on-the-record view"; dark = the product.

**Key Characteristics:**
- Near-black + off-white neutral base; one accent (blueprint blue), no secondary hue
- Serif display (STIX Two Text) for headings/prices/numbers — "shows its work"
- Mono (IBM Plex) for uppercase labels, data rows, tx hashes; tabular figures
- Dual theme by token re-valuation (dark default, light `.sec-invert`)
- Green/red reserved strictly for market up/down and yes/no — never decoration
- Glass surfaces (translucent panels + hairline borders) over a faint grid
- Pill and circle geometry for CTAs; 8–24px radii for cards

## 2. Color Palette & Roles

### Accent (brand)
- **Blueprint** `--blueprint` `#5E8BFF` — the brand color. Badges, links, active states, chart highlights, the Desk-Eval accent bar. On the light theme it shifts to `#2B3BEA` to stay legible.
- **Blueprint Light** `--blueprint-light` `#8FB0FF` — hovers, italic accent words ("audit yourself", the rotating market word).
- **Blueprint Strong** `--blueprint-strong` `#2B3BEA` — saturated fills (ReserveVault bar).

### Surface
- **Paper** `--paper` `#131417` — page background (light: `#F6F5F1`).
- **Paper Raised** `--paper-raised` `#1B1C20` — cards, panels (light: `#FDFDFB`).
- **Paper Deep** `--paper-deep` `#0D0E10` — deepest wells / tooltips.
- **Glass** `--glass` `rgba(22,23,27,.52)` — translucent nav / floating panels.

### Text
- **Ink** `--ink` `#F6F5F1` — primary text (light: `#131417`).
- **Ink 60** `--ink-60` `#9B9CA4` — secondary/muted (light: `#5C5E66`).
- **Ink 30** `--ink-30` `#4A4B52` — faint/disabled (light: `#B9BAC0`).

### Border
- **Line** `--line` `#2A2B30` — dividers, card borders, table hairlines (light: `#E3E1DA`).
- **Glass Line** `--glass-line` `rgba(246,245,241,.13)` — borders on glass.
- **Grid Ink** `--grid-ink` `rgba(246,245,241,.09)` — background grid.

### Semantic (data only)
- **Up** `--up` `#3FBE8F` — gains, ✓, on-chain success (light: `#0E8F62`).
- **Down** `--down` `#E5705F` — losses, ✕ (light: `#CE3B2C`).
*Green/red are reserved for market direction and yes/no. Never use them for UI chrome or emphasis.*

## 3. Typography Rules

### Families
- **Display**: `STIX Two Text` (serif) — headings, prices, big numbers.
- **Body**: `Inter` (sans) — paragraphs, UI.
- **Label**: `IBM Plex Mono` — uppercase eyebrows, tags, data rows, tx hashes.

### Scale
Use scale tokens only — never raw px. 13 fixed steps plus 3 responsive clamps.

| Token | Size | Typical use |
| --- | --- | --- |
| `--text-2xs` | 10px | tiny mono tags, foot labels |
| `--text-xs` | 11.5px | mono eyebrows, dot labels |
| `--text-sm` | 13px | data rows, fine print |
| `--text-base` | 14.5px | body copy |
| `--text-md` | 16px | lead body, footer |
| `--text-lg` | 18px | sub-headings, intros |
| `--text-xl` | 21px | small headings |
| `--text-2xl` | 25px | card titles |
| `--text-3xl` | 30px | feature headings |
| `--text-4xl` | 36px | section display |
| `--text-5xl` | 44px | large display / stats |
| `--text-6xl` / `--text-7xl` | 56 / 62px | hero numbers |
| `--text-heading` | clamp(22,2.6vw,36) | responsive section h2 |
| `--text-hero` / `--text-hero-sm` | clamp(42,6.2vw,68) / clamp(36,4.8vw,58) | hero h1 |

### Principles
- Headings, prices, and any number → **serif**. Labels/tags/tx → **mono, uppercase, letter-spaced**. Prose → **sans**.
- Numbers use tabular figures (`font-feature-settings:"tnum"`) so columns align.
- The hero headline rotates its predicate ("pays by smart contract." → "settles on-chain." → "publishes its pass rate.") in an italic blueprint em.

## 4. Component Stylings

### Buttons
- **Primary**: off-white fill (`--ink`), dark text, `--radius-pill`. Highest emphasis CTA.
- **Ghost**: transparent, `1px --line` (or `--glass-line`) border, `--radius-pill`.
- **Brand (Discord)**: `#5865F2` — an explicit third-party brand exception, not a system color.

### Cards & panels
- Background `--paper-raised`; border `1px --glass-line` or `--line`; radius `--radius-lg` (16px), inner wells `--radius-md`.
- Elevation `--shadow-1` at rest, `--shadow-2` on lift/hover.
- Pricing cards: joined 4-up grid on a `--line` panel; sig/prime variants carry a top accent bar and a translucent gradient over a `--line` base; hover = uniform `scale(1.035)` via `--ease-out-back`.

### Data surfaces
- Tables/ledgers: mono, `--text-sm`, `--line` row hairlines, tx hashes as `--blueprint` links.
- Featured market / spotlight: glass card with candlestick chart; up/down colored.
- Tooltip: `--paper-deep`/`--ink` fill, `--radius-sm`, mono `--text-xs`.

### Labels
- Eyebrow: mono, uppercase, `--text-xs`, `--ink-60`, positive letter-spacing.

## 5. Layout Principles
- Container: `--maxw` 1180px, centered, gutter ~24px.
- Section rhythm: `--section-y` 96 / 64 / 40px (desktop / tablet / phone).
- Full-bleed hero image with content anchored bottom; glass cards over it.
- Grids: 4-up pricing, 2-up split panels (transparency, join), snap/pinned "how it works".

## 6. Depth & Elevation
| Level | Treatment | Use |
| --- | --- | --- |
| Flat | none | page, most text |
| Ring | `1px --line` / `--glass-line` | cards, inputs, tables |
| Raised | `--shadow-1` | resting cards |
| Floating | `--shadow-2` | hover/lift, spotlight, tooltips |
Depth comes mainly from **hairline borders + translucency over the grid**, with shadows used sparingly.

## 7. Do's and Don'ts
### Do
- Pull every size from the scale tokens; every color/radius/timing from a token.
- Keep one accent (blueprint). Express it as `#5E8BFF` on dark, `#2B3BEA` on light.
- Serif for headings & numbers; mono uppercase for labels; sans for body.
- Reserve green/red for market direction and yes/no only.
- Theme by re-valuing tokens (`.sec-invert`), not by hardcoding light colors per element.
### Don't
- Don't introduce a second brand hue or decorative gradients outside the blueprint family.
- Don't use raw px font-sizes/radii/timings — no more `12.8px`, `13.5px`, one-off `.34s`.
- Don't put green/red on chrome, borders, or emphasis.
- Don't use the serif for labels or the mono for long prose.

## 8. Responsive Behavior
| Name | Width | Key changes |
| --- | --- | --- |
| Phone | <560px | single column; pricing 1-up; pinned "how it works" relaxes to stacked |
| Tablet | 560–900px | pricing 2-up; split panels stack; section-y → 64px |
| Desktop | 900–1180px | full 4-up pricing, split panels |
| Wide | >1180px | capped at `--maxw`, centered |
Hero type scales via `clamp()`. Section padding steps 96 → 64 → 40.

## 9. Agent Prompt Guide
### Quick reference
- Brand: "blueprint blue `#5E8BFF` (dark) / `#2B3BEA` (light), single accent."
- Surfaces: "near-black `#131417` page, `#1B1C20` cards" (dark).
- Type: "STIX Two Text serif headings/numbers, IBM Plex Mono uppercase labels, Inter body."

### Example prompts
- "Hero on a full-bleed dark image, content bottom-left. Headline `--text-hero` STIX serif, off-white, with a rotating italic `--blueprint-light` predicate. Off-white pill CTA (`--radius-pill`)."
- "Pricing: four joined cards on a `--line` panel, `--radius-lg`. Highlighted card gets a blueprint top bar and a `rgba(94,139,255,.10)` gradient over a `--line` base. Hover `scale(1.035)` with `--ease-out-back`."
- "Data row: IBM Plex Mono `--text-sm`, `--ink` values with tabular figures, `--line` hairline, tx hash as `--blueprint` link."
- "Section label: mono uppercase `--text-xs`, `--ink-60`, letter-spacing .08em."

### Iteration guide
1. One accent only (blueprint); green/red = data direction, never chrome.
2. Every size from the scale; every radius/timing from a token.
3. Serif = headings/numbers, mono = labels, sans = body.
4. Theme by token override (`.sec-invert`), light = "audit" view.
