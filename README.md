<div align="center">

# `amazonian-design-surface`

**An open, cross-border library of original illustrations, vectors and seamless repeating patterns inspired by the Amazon basin — built for textile and surface printing.**

[![License: GPL v3](https://img.shields.io/badge/code-GPL--3.0-blue.svg)](LICENSE)
[![Artwork: CC BY-SA 4.0](https://img.shields.io/badge/artwork-CC%20BY--SA%204.0-lightgrey.svg)](LICENSE-ASSETS.md)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![i18n: en · es · pt](https://img.shields.io/badge/i18n-en%20%C2%B7%20es%20%C2%B7%20pt-orange.svg)](web/locales/)

</div>

---

## Manifesto

The Amazon is not a border. It is a single living system that nine countries happen to share, and its
visual language — the geometry of Shipibo *kené*, the fauna of the *várzea*, the seed beadwork of the
Napo, the palm silhouettes that repeat from Leticia to Manaus — has been catalogued far less carefully
than its biology.

**`amazonian-design-surface` exists to change that.** It is a public, versioned, technically rigorous
archive of **original** surface designs: hero graphics, supporting motifs and structural textures, all
production-ready for digital textile printing, all traceable to the region and the artist that
inspired them.

We hold three commitments:

1. **Attribution over extraction.** Every asset declares its regional origin and its author. Motifs
   with a living cultural custodian are documented as such, never laundered into "generic tropical".
2. **Production over decoration.** An asset that is not seamless, not 300 DPI and not colour-managed
   is not finished. This repository ships files a mill can print, not moodboards.
3. **The whole basin, in its own languages.** Ecuador, Peru, Brazil, Colombia, Bolivia, Venezuela,
   Guyana, Suriname and French Guiana. Documentation and the project website are internationalised
   from day one — English, Spanish and Portuguese are first-class, not translations of an afterthought.

If you draw, if you translate, if you know the difference between a *rapport* that tiles and one that
merely looks like it does — there is work here for you. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Repository architecture

```text
amazonian-design-surface/
├── .github/                        # Community health & automation
│   ├── ISSUE_TEMPLATE/
│   │   ├── config.yml
│   │   ├── pattern-submission.yml      # Propose a new surface design
│   │   ├── asset-defect.yml            # Broken repeat, colour drift, bad export
│   │   ├── localization-request.yml    # New language / translation fix
│   │   └── feature-request.yml         # Website & tooling
│   ├── workflows/
│   │   ├── deploy-pages.yml            # Build & publish the showcase site
│   │   ├── validate-assets.yml         # Naming, DPI, colour profile, seamless check
│   │   └── validate-locales.yml        # Locale key parity across en/es/pt
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODE_OF_CONDUCT.md
│   ├── SECURITY.md
│   ├── SUPPORT.md
│   └── FUNDING.yml
│
├── docs/                           # Long-form standards
│   ├── nomenclature.md                 # File-tagging standard (normative)
│   ├── production-specs.md             # Colour, resolution, repeat rules (normative)
│   ├── seamless-repeat-guide.md        # How to build and verify a tiling repeat
│   ├── color-management.md             # ICC profiles, soft-proofing, ink limits
│   ├── cultural-attribution.md         # Origin declaration & custodianship policy
│   └── adr/                            # Architecture Decision Records (site & tooling)
│
├── src/                            # Editable sources — the working truth
│   ├── assets/                         # Raw design files, isolated by technical format
│   │   ├── vector/
│   │   │   ├── ai/                     # Adobe Illustrator working files
│   │   │   ├── eps/                    # Interchange / legacy RIP delivery
│   │   │   └── svg/                    # Open, diff-friendly vector master
│   │   ├── raster/
│   │   │   ├── psd/                    # Layered Photoshop documents
│   │   │   └── procreate/              # Native iPad painting files
│   │   └── palettes/                   # .ase / .aco shared colour libraries
│   │
│   └── collection/                 # The catalog, by textile surface hierarchy
│       ├── hero-patterns/              # Complex focal graphics — the statement print
│       ├── secondary-patterns/         # Supporting motifs — coordinate scale, same story
│       └── blender-patterns/           # Structural textures, geometric fillers, circular fills
│
├── dist/                           # Production-ready, seamless outputs (generated)
│   ├── tiff-300dpi/                    # CMYK master deliverables for the mill
│   ├── png-300dpi/                     # RGB/transparent working exports
│   ├── web-preview/                    # Compressed WebP tiles for the showcase site
│   └── catalog.json                    # Machine-readable index consumed by web/
│
├── mockups/                        # Product application visuals
│   ├── textile/                        # Yardage, scarves, apparel-surface renders
│   ├── interior/                       # Cushions, wallpaper, upholstery
│   ├── stationery/                     # Paper goods, packaging
│   └── templates/                      # Reusable smart-object mockup bases
│
├── web/                            # GitHub Pages showcase site
│   ├── public/                         # Static assets served verbatim
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── src/
│   │   ├── components/                 # UI building blocks
│   │   ├── layouts/                    # Page shells (locale-aware)
│   │   ├── pages/                      # Routes, generated per locale
│   │   ├── styles/
│   │   └── data/                       # Catalog loader / typed schema
│   └── locales/                    # Internationalisation resources
│       ├── en/                         # ui.json · collection.json · pages/*.md
│       ├── es/
│       └── pt/
│
├── scripts/                        # Maintainer tooling
│   ├── validate-naming.mjs             # Nomenclature + mandatory meta.json
│   ├── validate-locales.mjs            # Locale key parity and placeholder integrity
│   ├── check-terminology.sh            # Rejects garment-construction vocabulary
│   └── build-catalog.mjs               # meta.json → dist/catalog.json
│
├── package.json                    # Repository-level validators
├── .editorconfig
├── .gitattributes                  # Git LFS tracking for binary design files
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── GOVERNANCE.md
├── MAINTAINERS.md
├── LICENSE                         # GPL-3.0 — website source & tooling
├── LICENSE-ASSETS.md               # CC BY-SA 4.0 — artwork & pattern files
└── README.md
```

---

## Production technical specifications

These are **normative**. A pull request that misses them is not merged. Full detail lives in
[`docs/production-specs.md`](docs/production-specs.md).

### Colour

| Requirement | Value |
| --- | --- |
| Master delivery space | **CMYK — Coated FOGRA39 (ISO 12647-2:2004)** |
| Working / authoring space | sRGB IEC61966-2.1 or Adobe RGB (1998), converted on export |
| Rendering intent | Relative Colorimetric, black point compensation ON |
| Embedded profile | **Mandatory** on every `dist/` file — no untagged output |
| Total ink limit | ≤ 300 % TAC for reactive/pigment digital textile printing |
| Rich black | `C60 M40 Y40 K100` — never a four-plate 100 % build |
| Spot / limited-palette designs | Ship an accompanying `.ase` in `src/assets/palettes/` |

> **Why FOGRA39.** It is the most widely supported coated CMYK characterisation across European and
> Latin American print service providers, which makes it the safest neutral interchange target for a
> cross-border contributor base. Mills that require a specific in-house profile can re-separate from
> our tagged masters without guesswork.

### Resolution & format

| Requirement | Value |
| --- | --- |
| Minimum export resolution | **300 DPI at final print size** |
| Preferred repeat tile size | 2000 × 2000 px minimum (≈ 16.9 × 16.9 cm @ 300 DPI) |
| Master raster format | `.tiff` — LZW compression, **no layers, no alpha**, flattened |
| Secondary raster format | `.png` — 8-bit, RGB, alpha permitted for motif cut-outs |
| Vector format | `.svg` (open master) plus `.ai` or `.eps` for print workflows |
| Bit depth | 8-bit minimum; 16-bit accepted for gradient-heavy hero designs |
| Upscaling | **Prohibited.** Never interpolate a small file up to 300 DPI |

### Seamless repeat boundary rules

Every asset placed in `src/collection/` and exported to `dist/` **must** tile without a visible seam.
Mandatory rules:

1. **Full-drop or half-drop only.** Declare which in the asset's `meta.json`. Brick/half-brick repeats
   must state the offset percentage explicitly.
2. **Edge continuity.** Any element crossing the tile boundary must be duplicated at the exact opposite
   edge with **pixel-identical** offset (raster) or **numerically identical** coordinates (vector).
   Offset must be a whole-pixel value — no sub-pixel drift.
3. **No artwork on the artboard edge itself.** Bleed elements past the boundary, then wrap; do not clip.
4. **Verification is on the contributor.** Prove the tile with a 3 × 3 array render and include that
   proof image as `*-repeat-proof.png` in the pull request.
5. **No stray transparency or off-white halos** on the seam. Flatten to an opaque background before
   TIFF export.
6. **Scale honesty.** The declared physical repeat size (cm) in metadata must match the actual pixel
   dimensions at 300 DPI.

### Colour separation for blenders

`blender-patterns` intended for limited-colour production should stay within **≤ 6 flat colours** and
be delivered as vector wherever the motif allows, so a mill can recolour without re-drawing.

---

## Project website preview

A live showcase is published from this repository to **GitHub Pages**, built from [`web/`](web/).

- **Fully internationalised (i18n)** — the interface ships in **English, Spanish and Portuguese**, with
  an always-visible **language toggle** in the site header. The chosen locale is persisted per visitor
  and reflected in the URL (`/en/`, `/es/`, `/pt/`), so every page is directly shareable in-language.
- **Localised asset indexing** — pattern titles, motif descriptions, cultural origin notes and
  collection tiers are indexed per language, so searching for *guacamayo*, *macaw* or *arara* reaches
  the same asset from any locale.
- **Faceted browsing** — filter by tier (hero / secondary / blender), by country of origin, by motif
  family (flora, fauna, geometric, ritual-geometry) and by dominant colour.
- **Every card links back to the repository** — source file, licence, author and the exact `dist/`
  deliverable, so the site is a front door to the archive rather than a copy of it.

Translation resources live in [`web/locales/`](web/locales/) and are open to contribution — see the
[Web localization contribution path](CONTRIBUTING.md#web-localization-contribution-path).

---

## Global nomenclature guideline

One naming standard, applied to **every** file in `src/collection/`, `dist/` and `mockups/`. It keeps
the archive searchable, machine-indexable and free of clutter. Normative reference:
[`docs/nomenclature.md`](docs/nomenclature.md).

```text
amazonia-[country_origin]-[tier]-[motif_name]-[v]
```

| Segment | Rule | Allowed values |
| --- | --- | --- |
| `amazonia` | Fixed namespace prefix. Always present, always lowercase. | `amazonia` |
| `country_origin` | ISO 3166-1 alpha-2, lowercase. Use `pan` when the motif is basin-wide and cannot be attributed to a single country. | `ec` `pe` `br` `co` `bo` `ve` `gy` `sr` `gf` `pan` |
| `tier` | Position in the surface hierarchy. | `hero` `sec` `blnd` |
| `motif_name` | 1–3 words, `lower-case-with-hyphens`, in the language of origin where a local name exists, ASCII-folded (no accents, no `ñ` → use `n`). | e.g. `kene-geometry`, `guacamayo`, `vitoria-regia` |
| `v` | Zero-padded two-digit version, prefixed `v`. Increment on any visual change; never overwrite a published version. | `v01` `v02` … |

**Separator:** single hyphen `-` between segments. **Never** use spaces, underscores, uppercase,
accents or `#`, `&`, `(`, `)`.

### Examples

```text
amazonia-pe-hero-kene-geometry-v01.ai
amazonia-ec-sec-achiote-seed-v02.svg
amazonia-br-blnd-vitoria-regia-ripple-v01.tiff
amazonia-co-hero-guacamayo-v03.psd
amazonia-pan-blnd-palm-crosshatch-v01.png
```

### Reserved suffixes

Append **after** the version, before the extension:

| Suffix | Meaning |
| --- | --- |
| `-repeat-proof` | 3 × 3 tiled verification render (required in every submission PR) |
| `-flat` | Flattened preview of a layered source |
| `-mono` | Single-colour separation variant |
| `-cw` | Colourway variant, numbered: `-cw02` |
| `-mock-[surface]` | Mockup application, e.g. `-mock-cushion` |

### Folder placement

Each design lives in a folder named exactly as its base identifier (without version), inside its tier:

```text
src/collection/hero-patterns/amazonia-pe-hero-kene-geometry/
├── meta.json                       # Origin, author, licence, repeat type, physical size
├── amazonia-pe-hero-kene-geometry-v01.ai
├── amazonia-pe-hero-kene-geometry-v01.svg
└── amazonia-pe-hero-kene-geometry-v01-repeat-proof.png
```

---

## Terminology — read before contributing

This repository uses the word **pattern** in exactly two senses:

1. **Surface pattern** — a repeating visual composition applied to a printed surface (*Surface Pattern
   Design*). This is what the `src/collection/` catalog contains.
2. **Design pattern** — an established solution in software architecture, used only in `web/` and
   `docs/adr/` when discussing the website's code.

This project contains **no garment manufacturing templates, no apparel cutting files and no tailoring
molds.** The terms *sewing pattern*, *apparel pattern* and *patternmaking* are therefore **prohibited**
in issues, pull requests, file names, metadata, documentation and site copy. If you need to describe a
garment-related file, this is not the repository for it.

---

## Quick start

```bash
# 1. Clone (Git LFS is required for binary design sources)
git lfs install
git clone https://github.com/<org>/amazonian-design-surface.git
cd amazonian-design-surface

# 2. Run the showcase site locally
cd web
npm install
npm run dev            # http://localhost:4321/en/

# 3. Validate your submission before opening a pull request (from the repository root)
npm run validate           # naming + locale parity + terminology gate
```

The validators run from any directory and are the same checks CI enforces.

---

## Licensing

| Scope | Licence |
| --- | --- |
| Website source, scripts and tooling | [GPL-3.0](LICENSE) |
| Artwork, patterns and `dist/` deliverables | [CC BY-SA 4.0](LICENSE-ASSETS.md) — attribution + share-alike |

Attribution must name the individual artist and this repository. Commercial printing of the artwork is
permitted under share-alike; selling the *files themselves* as a standalone asset pack is not in the
spirit of the archive and is explicitly discouraged.

---

## Community

- [Contributing guide](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Governance](GOVERNANCE.md)
- [Cultural attribution policy](docs/cultural-attribution.md)
- Open a [pattern submission issue](.github/ISSUE_TEMPLATE/pattern-submission.yml) before starting a large hero design.
