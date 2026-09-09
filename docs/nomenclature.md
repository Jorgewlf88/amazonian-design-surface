# Global nomenclature standard (normative)

Every file in `src/collection/`, `dist/` and `mockups/` follows one identifier grammar. This keeps the
archive searchable, machine-indexable and free of clutter as it grows across countries.

## Grammar

```text
amazonia-[country_origin]-[tier]-[motif_name]-[v][-suffix].[ext]
```

| Segment | Rule |
| --- | --- |
| `amazonia` | Fixed namespace. Always present, always lowercase. Never translated. |
| `country_origin` | ISO 3166-1 alpha-2, lowercase. `pan` when the motif is basin-wide. |
| `tier` | `hero` \| `sec` \| `blnd` |
| `motif_name` | 1-3 words, `lower-case-with-hyphens`, ASCII-folded, in the language of origin where a local name exists. |
| `v` | `v` + zero-padded two digits. Increment on any visual change; never overwrite a published version. |

**Character set:** `a-z`, `0-9`, `-`. Nothing else. No spaces, no underscores, no uppercase, no
accents (`é` becomes `e`, `ñ` becomes `n`), no `#`, `&`, `(`, `)`.

## Country codes

| Code | Country | Code | Country |
| --- | --- | --- | --- |
| `ec` | Ecuador | `ve` | Venezuela |
| `pe` | Peru | `gy` | Guyana |
| `br` | Brazil | `sr` | Suriname |
| `co` | Colombia | `gf` | French Guiana |
| `bo` | Bolivia | `pan` | Pan-Amazonian (basin-wide) |

Use `pan` only when the motif genuinely cannot be attributed to a single country: and explain why in
`meta.json`, field `origin.inspiration_notes`. **Never guess a country to fill the field.**

## Tier codes

| Code | Folder | Definition |
| --- | --- | --- |
| `hero` | `src/collection/hero-patterns/` | Complex focal graphic. Carries the story of the collection. Large repeat, high motif density. |
| `sec` | `src/collection/secondary-patterns/` | Supporting motif. Coordinates with a hero at a smaller scale, shares its palette. |
| `blnd` | `src/collection/blender-patterns/` | Structural texture, geometric filler or circular design. Reads as near-solid at distance. |

## Reserved suffixes

Appended **after** the version, before the extension.

| Suffix | Meaning |
| --- | --- |
| `-repeat-proof` | 3x3 tiled verification render. Required in every submission. |
| `-flat` | Flattened preview of a layered source. |
| `-mono` | Single-colour separation variant. |
| `-cwNN` | Colourway variant, zero-padded: `-cw02`. |
| `-mock-[surface]` | Mockup application: `-mock-cushion`, `-mock-yardage`. |

## Folder placement

Each design occupies one folder named as its base identifier **without** the version:

```text
src/collection/hero-patterns/amazonia-pe-hero-kene-geometry/
├── meta.json
├── amazonia-pe-hero-kene-geometry-v01.ai
├── amazonia-pe-hero-kene-geometry-v01.svg
├── amazonia-pe-hero-kene-geometry-v01-cw02.svg
└── amazonia-pe-hero-kene-geometry-v01-repeat-proof.png
```

Distribution mirrors the identifier flat, tagged by region:

```text
dist/tiff-300dpi/pe/amazonia-pe-hero-kene-geometry-v01.tiff
dist/png-300dpi/pe/amazonia-pe-hero-kene-geometry-v01.png
dist/web-preview/pe/amazonia-pe-hero-kene-geometry-v01.webp
```

## Validation

`scripts/validate-naming.mjs` enforces the grammar in CI:

```regex
^amazonia-(ec|pe|br|co|bo|ve|gy|sr|gf|pan)-(hero|sec|blnd)-[a-z0-9]+(-[a-z0-9]+){0,2}-v\d{2}(-(repeat-proof|flat|mono|cw\d{2}|mock-[a-z0-9-]+))?\.[a-z0-9]+$
```

## Prohibited vocabulary

Never appears in a file name, folder name, branch, commit message or metadata value:
`sewing`, `apparel-pattern`, `patternmaking`, `pattern-block`, `cutting-file`, `molde`, `patron-de-costura`.
This archive contains no garment manufacturing templates. See
[CONTRIBUTING.md](../CONTRIBUTING.md#terminology-constraint-non-negotiable).
