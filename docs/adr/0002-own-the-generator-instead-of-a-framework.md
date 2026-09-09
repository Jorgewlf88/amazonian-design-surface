# ADR 0002 — Own the static generator instead of adopting a framework

- **Status:** Accepted
- **Date:** 2026-09-09
- **Supersedes:** the build-tooling choice implied by [ADR 0001](0001-static-site-with-file-based-i18n.md);
  its i18n contract (per-locale route trees, `en/` as source of truth) is unchanged.

## Context

ADR 0001 fixed the site's shape — a static build, one route tree per locale, translations as plain
files — without committing to a build tool. Astro was the assumed default.

Measured on 2026-09-09, installing the two candidate toolchains:

| Toolchain | Packages | Size | `npm audit` |
| --- | --- | --- | --- |
| `astro` 7.3.2 | 203 | 154 MB | 0 vulnerabilities |
| `@tailwindcss/cli` 4 + `marked` | 33 | 18 MB | 0 vulnerabilities |

Neither is vulnerable today, and neither ships anything to the browser — both produce static HTML, so
the runtime exposure to a visitor is identical. The difference is maintenance surface over time:
dependency alerts a maintainer must triage, and major-version migrations.

That matters unusually much here. **This repository is an archive.** Its TIFF masters are meant to be
openable in twenty years. Coupling that to a toolchain with a roughly annual major release is a
mismatch of lifespans, and a community project's alert fatigue is a real security failure mode — 200
dependencies of advisories is a queue nobody reads.

The site's actual rendering need is narrow: iterate locales, iterate catalog records, emit cards and
three long-form pages. That is a loop, not a framework.

## Decision

Build the site with **a generator we own** — [`scripts/build-site.mjs`](../../scripts/build-site.mjs),
roughly 400 lines — alongside the two build scripts that already exist for the same repository data.

Two runtime dependencies only:

- **`@tailwindcss/cli`** — styling. Tailwind 4 has Lightning CSS built in, so no PostCSS/autoprefixer chain.
- **`marked`** — renders the localized `pages/*.md` content blocks. Zero dependencies of its own.

Front matter is parsed by a ten-line reader rather than a YAML dependency. The preview server
([`scripts/serve.mjs`](../../scripts/serve.mjs)) uses only `node:http`.

## Consequences

**Positive**

- One lockfile, one `node_modules`, 33 packages. Dependabot output stays small enough to read.
- No framework migration is ever forced on the archive.
- The generator is the same shape as `build-catalog.mjs` and `build-authors.mjs`, so a contributor who
  can read one can read all three.
- Filtering is progressive enhancement over pre-rendered DOM: the collection is fully browsable and
  indexable with JavaScript disabled.

**Negative**

- No image optimisation, MDX, typed content collections, islands or HMR. If the site later needs any
  of these, this ADR should be revisited rather than worked around.
- Template correctness is on us. Mitigated by the locale validator, which fails the build on a missing
  key, and by `translate()` throwing rather than emitting an empty string.
- Tailwind's `@tailwindcss/oxide` ships platform-specific native binaries. Fine in CI; expected in the
  lockfile.

## Design patterns applied

- **Adapter** — catalog records are adapted into a locale-resolved view model; nothing in the templates
  reads `src/collection/` directly.
- **Template method** — one `layout()`, one renderer per page kind.
- **Strategy** — locale resolution order stays declared in `web/src/data/i18n.config.js`.
