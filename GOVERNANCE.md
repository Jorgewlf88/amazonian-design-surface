# Governance

## Roles

| Role | Responsibility | How it is granted |
| --- | --- | --- |
| **Contributor** | Submits artwork, translations, code or documentation. | Open a pull request. |
| **Locale maintainer** | Owns one language under `web/locales/`; reviews i18n pull requests. | Sustained translation contributions; self-nomination in a `localization-request` issue. |
| **Design council member** | Reviews artwork for repeat integrity, colour compliance and provenance. | Invitation after ≥ 3 merged assets. |
| **Core maintainer** | Merge rights, release tagging, Code of Conduct enforcement. | Consensus of existing core maintainers. |

## Decision-making

- **Routine changes** (a new asset, a translation fix, a bug fix) — lazy consensus. One approval for
  `secondary` and `blender` assets, code and docs; **two** approvals for `hero` assets and for any
  change to the normative standards in `docs/production-specs.md` or `docs/nomenclature.md`.
- **Architectural changes** to the website require an Architecture Decision Record in
  [`docs/adr/`](docs/adr/), merged with the implementation.
- **Policy changes** (licensing, creative rules, cultural attribution) require a public issue open for
  at least 14 days and the consent of a majority of core maintainers.

## Cultural attribution board

Motifs flagged `custodian_consent: pending` are reviewed by the design council together with any
community representatives who join the discussion. An asset may be delisted from the showcase site
while a custodianship question is open, without being deleted from history.

## Releases

The collection is versioned with [Semantic Versioning](https://semver.org) applied to the *catalog*:

- **MAJOR** — a breaking change to the nomenclature standard or production specs.
- **MINOR** — new assets, new locales.
- **PATCH** — asset corrections, translation fixes, site fixes.

Each release updates [CHANGELOG.md](CHANGELOG.md) and credits every contributor by name.
