# Showcase site

The public front door to the archive, published to **GitHub Pages** by
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml).

## Architecture

A static site generated **once per locale** (`/en/`, `/es/`, `/pt/`) by a generator we own,
[`scripts/build-site.mjs`](../scripts/build-site.mjs), with **two dependencies total**
(`@tailwindcss/cli` and `marked`). The reasoning is in
[ADR 0002](../docs/adr/0002-own-the-generator-instead-of-a-framework.md); the i18n contract is in
[ADR 0001](../docs/adr/0001-static-site-with-file-based-i18n.md).

```text
web/
├── public/          Copied verbatim into the build (app.js, images, icons, fonts)
├── src/
│   ├── styles/      main.css: Tailwind entry point and the component layer
│   └── data/        i18n.config.js, asset.schema.json
├── locales/         en/ (source of truth), es/, pt/
└── dist/            Build output: generated, git-ignored
```

## Build pipeline

Run from the **repository root**:

```bash
npm install
npm run build      # catalog, credit roster, pages, stylesheet
npm run dev        # build, then serve on http://localhost:4321/amazonian-design-surface/
```

| Step | Script | Produces |
| --- | --- | --- |
| `build:catalog` | `build-catalog.mjs` | `dist/catalog.json` + ready-made credit lines |
| `build:authors` | `build-authors.mjs` | `AUTHORS.md` |
| `build:site` | `build-site.mjs` | `web/dist/**/*.html`, 5 routes across 3 locales |
| `build:css` | `@tailwindcss/cli` | `web/dist/assets/main.css` |

Order matters: Tailwind scans the generated HTML, so the pages must exist before the stylesheet is
compiled.

The site is served from a subpath. Override it for a custom domain:

```bash
BASE_PATH="" npm run build
```

## Rules

- **No hardcoded user-facing copy.** Every string resolves through `locales/` via `translate()`, which
  **throws on a missing key** rather than rendering an empty element.
- **No component change to add a language.** Register it in
  [`src/data/i18n.config.js`](src/data/i18n.config.js) and the header toggle picks it up.
- **Progressive enhancement.** Filtering narrows a list that is already in the HTML; the language
  toggle is a set of plain links. Everything works with `app.js` blocked.
- **Accessibility is a merge requirement:** WCAG 2.1 AA contrast, keyboard-reachable toggle, localized
  `alt` text, a skip link, and `aria-current` on the active route.
