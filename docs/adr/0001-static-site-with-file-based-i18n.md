# ADR 0001: Static site with file-based internationalisation

- **Status:** Accepted
- **Date:** 2026-09-08

## Context

The showcase site must be hosted on GitHub Pages (static only, no server runtime), must serve English,
Spanish and Portuguese as equals, and must be editable by translators who are designers rather than
developers.

## Decision

Build a **static site generated per locale**, with translations stored as plain JSON and Markdown files
under `web/locales/<tag>/`.

- Routes are generated per locale: `/en/`, `/es/`, `/pt/`. `/` redirects to the visitor's best match,
  falling back to `en`.
- `web/locales/en/` is the source of truth for key structure; CI enforces key parity across locales.
- The catalog index (`dist/catalog.json`) is built from each asset's `meta.json`; localized titles and
  descriptions are resolved against `web/locales/<tag>/collection.json`.
- The language toggle renders from `web/src/data/i18n.config.js`, so adding a locale requires no
  component changes.

## Consequences

**Positive**: translators contribute through the GitHub web editor with no toolchain. Every page is
statically indexable in-language. Adding a locale is a directory copy plus one config line.

**Negative**: key parity must be enforced mechanically or locales drift; hence
`scripts/validate-locales.mjs` and the `validate-locales` workflow. Build time grows linearly with
locale count, which is acceptable at this scale.

## Design patterns applied

- **Adapter**: `web/src/data/` adapts `meta.json` records into the site's view model.
- **Strategy**: locale resolution is a swappable strategy (URL segment, then stored preference, then
  `Accept-Language`, then default).
