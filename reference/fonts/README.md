# Vendored capture fonts

WOFF2 files for visual-diff hermetic rasterization (STIX Two Text, Inter, IBM Plex Mono).

All files are sourced from Google Fonts and licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL). Used only by the QA harness; the app loads fonts via `next/font/google`.

Regenerate with:

```bash
node scripts/vendor-fonts.mjs
```
