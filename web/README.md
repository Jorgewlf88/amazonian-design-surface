# Showcase site

The public front door to the archive, published to **GitHub Pages** by
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml).

## Architecture

Static site generated **once per locale** — `/en/`, `/es/`, `/pt/` — with translations stored as plain
JSON and Markdown under [`locales/`](locales/). The rationale and the software design patterns applied
are recorded in [`docs/adr/0001-static-site-with-file-based-i18n.md`](../docs/adr/0001-static-site-with-file-based-i18n.md).

```text
web/
├── public/      Static assets served verbatim
├── src/
│   ├── components/   UI building blocks
│   ├── layouts/      Locale-aware page shells
│   ├── pages/        Routes, generated per locale
│   ├── styles/
│   └── data/         i18n.config.js · asset.schema.json · catalog loader
└── locales/     en/ (source of truth) · es/ · pt/
```

## Local development

```bash
npm install
npm run build:catalog     # regenerate dist/catalog.json from src/collection/*/meta.json
npm run dev               # http://localhost:4321/en/
```

## Rules

- **No hardcoded user-facing copy.** Every string resolves through `locales/`.
- **No component change to add a language.** The header toggle renders from
  [`src/data/i18n.config.js`](src/data/i18n.config.js).
- **Accessibility is a merge requirement:** WCAG 2.1 AA contrast, keyboard-reachable language toggle,
  localized `alt` text.

> The page implementation lands incrementally. The i18n contract, the catalog schema and the
> validators in this directory are already authoritative — build against them.
