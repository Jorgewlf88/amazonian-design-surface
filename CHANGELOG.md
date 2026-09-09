# Changelog

All notable changes to this archive are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the catalog follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Repository blueprint: directory architecture for assets, catalog, distribution, mockups and the
  internationalised showcase site.
- Normative production specifications (CMYK Coated FOGRA39, 300 DPI, seamless repeat boundary rules).
- Global nomenclature standard `amazonia-[country_origin]-[tier]-[motif_name]-[v]`.
- Community health files: contribution guide, code of conduct, governance, issue and pull request
  templates.
- Internationalisation scaffold for `en`, `es` and `pt` under `web/locales/`.
- Required attribution format for downstream users, with ready-to-copy short, inline and full credit
  lines, and an explicit list of what does not count as attribution.
- Generated `AUTHORS.md` credit roster, enforced in CI so it cannot drift from asset metadata.
- `author.display_name`, `author.url` and `author.collective` in the asset schema, so artists are
  credited under the name they sign with.
- Static site generator (`scripts/build-site.mjs`) rendering 5 routes across 3 locales with no framework,
  plus a `node:http` preview server. Two dependencies total (`@tailwindcss/cli` and `marked`), chosen
  over Astro's 203-package tree so an archive meant to last decades is not tied to a yearly major
  release cycle. Recorded as ADR 0002.

### Fixed
- `deploy-pages` no longer fails on a missing `web/package-lock.json`; the build now runs from a single
  root manifest.

[Unreleased]: https://github.com/Jorgewlf88/amazonian-design-surface/commits/main
