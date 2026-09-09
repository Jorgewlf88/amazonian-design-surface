# Contributing to `amazonian-design-surface`

Thank you for helping build an open archive of Amazonian surface design. This document is the
governance contract for two kinds of contribution: **artwork** and **website localization**. Both are
equally valued and both are reviewed against the same standard of rigour.

Before anything else, read the [Code of Conduct](CODE_OF_CONDUCT.md) and the
[Terminology](README.md#terminology-read-before-contributing) section of the README.

---

## Table of contents

- [Terminology constraint (non-negotiable)](#terminology-constraint-non-negotiable)
- [Artistic contribution path](#artistic-contribution-path)
  - [Creative rules](#creative-rules)
  - [Regional origin declaration](#regional-origin-declaration)
  - [Cultural custodianship](#cultural-custodianship)
  - [Technical acceptance checklist](#technical-acceptance-checklist)
  - [Submission workflow](#submission-workflow)
- [Web localization contribution path](#web-localization-contribution-path)
- [Website code contributions](#website-code-contributions)
- [Review, licensing and attribution](#review-licensing-and-attribution)
  - [How you are credited](#how-you-are-credited)

---

## Terminology constraint (non-negotiable)

Use **"pattern"** only for:

- **Surface pattern design**: the repeating visual compositions this archive catalogs.
- **Software design patterns**: architectural solutions in the `web/` codebase and `docs/adr/`.

**Prohibited terms** anywhere in this project: commit messages, branch names, file names, metadata,
issue titles, pull request descriptions, documentation and website copy:

> ❌ `sewing pattern` ❌ `apparel pattern` ❌ `patternmaking` ❌ `pattern block` ❌ `cutting file`

This repository holds **no garment manufacturing templates, no apparel cutting files and no tailoring
molds**. Pull requests using these terms will be asked to rename before review continues. Say
*surface design*, *repeat*, *motif*, *colourway* or *tile* instead.

---

## Artistic contribution path

### Creative rules

1. **Original artwork only.** You must be the sole author of every element you submit, and you must
   hold full rights to license it under [CC BY-SA 4.0](LICENSE-ASSETS.md).

2. **Strict prohibition of copyright infringement.** The following are rejected on sight and may lead
   to removal of contributor access:
   - Tracing, redrawing or "restyling" someone else's illustration, photograph or commercial print.
   - Assets lifted from stock libraries, marketplaces, Pinterest, brand collections or museum
     reproductions that are still under copyright.
   - Photographs you did not take, used as a direct base without transformation and permission.
   - Fonts, brushes or texture packs whose licence forbids redistribution inside an open repository.

3. **Strict prohibition of unregulated commercial AI-generated art.** Artwork produced by
   general-purpose commercial generative image models, trained on scraped, unlicensed corpora, is
   **not accepted**, in whole or in part, including as an underlayer that was later traced or painted
   over. This is a provenance rule, not an aesthetic one: the archive cannot make an attribution
   guarantee for output whose training data cannot be audited.

   *Narrow, disclosed exceptions:* deterministic procedural or algorithmic generation you authored
   (scripts, parametric tiling, noise fields), and machine-assisted **cleanup** of your own hand-drawn
   work: vectorisation, denoise, upscaling of your own scan. Both must be disclosed in `meta.json`
   under `"tooling"`. Undisclosed use is treated as misrepresentation of authorship.

4. **Declare your sources of inspiration.** Field sketches, your own reference photos, public-domain
   botanical plates and ethnographic literature are all legitimate: cite them.

5. **No sacred or restricted imagery without consent.** See
   [Cultural custodianship](#cultural-custodianship).

### Regional origin declaration

**Every submission must explicitly declare the regional or national inspiration of the work.** This is
mandatory metadata, not a courtesy. Without it, the pull request cannot be merged.

Declare it in two places:

**1. In the file name**, via the `country_origin` segment of the
[nomenclature standard](README.md#global-nomenclature-guideline):

```text
amazonia-[country_origin]-[tier]-[motif_name]-[v]
```

**2. In the design's `meta.json`**, with the full context:

```jsonc
{
  "id": "amazonia-pe-hero-kene-geometry",
  "title": { "en": "Kené Geometry", "es": "Geometría Kené", "pt": "Geometria Kené" },
  "tier": "hero",                          // hero | secondary | blender
  "origin": {
    "country": "pe",                       // ISO 3166-1 alpha-2, or "pan" for basin-wide
    "region": "Ucayali, Peruvian Amazon",
    "cultural_reference": "Shipibo-Konibo kené visual tradition",
    "custodian_consent": "documented",     // not-applicable | documented | pending
    "inspiration_notes": "Drawn from field study of textile kené line structure, 2025."
  },
  "author": {
    "display_name": "Ana Ruiz",              // The name you sign with, a pseudonym is fine
    "github": "@handle",
    "country": "ec",
    "url": "https://example.com/ana-ruiz"    // Optional portfolio link, shown on your asset card
  },
  "repeat": { "type": "half-drop", "offset_percent": 50, "size_cm": [24.0, 24.0] },
  "color": { "profile": "Coated FOGRA39", "colorways": 2, "flat_colors": 5 },
  "tooling": ["Adobe Illustrator 2026", "hand-drawn ink scan"],
  "license": "CC-BY-SA-4.0",
  "version": "v01"
}
```

If a motif genuinely spans the basin and cannot be attributed to one country, use `"pan"` and say why
in `inspiration_notes`. **Do not guess a country to fill the field.**

### Cultural custodianship

Amazonian visual traditions belong to living peoples. Where a motif derives from an identifiable
Indigenous or local tradition:

- Name the tradition in `cultural_reference`: never flatten it to "tribal" or "ethnic".
- Set `custodian_consent` honestly. `documented` requires a link or note in the PR describing the
  permission or collaboration. `pending` is acceptable for community-in-progress work and will be
  labelled as such on the website.
- Do not submit ceremonial, funerary or otherwise restricted imagery. If you are unsure whether a
  motif is restricted, open a discussion issue before drawing.
- Read [`docs/cultural-attribution.md`](docs/cultural-attribution.md) in full.

### Technical acceptance checklist

Run through this before opening a pull request. The `validate-assets` workflow checks the mechanical
items; a human maintainer checks the rest.

- [ ] File and folder names follow the [nomenclature standard](README.md#global-nomenclature-guideline) exactly.
- [ ] Design placed in the correct tier: `hero-patterns`, `secondary-patterns` or `blender-patterns`.
- [ ] Editable source committed to `src/assets/` in its correct format folder (`vector/ai`, `vector/eps`,
      `vector/svg`, `raster/psd`, `raster/procreate`).
- [ ] Repeat is genuinely seamless: whole-pixel edge continuity, no sub-pixel drift, no seam halo.
- [ ] `*-repeat-proof.png` included, showing a 3x3 tiled render.
- [ ] `dist/` export at **300 DPI minimum** at final print size: never upscaled.
- [ ] TIFF master is **CMYK, Coated FOGRA39, embedded profile, flattened, LZW**, 300 % TAC maximum.
- [ ] `meta.json` complete, including the regional origin declaration and `tooling`.
- [ ] Binary files tracked through **Git LFS** (`git lfs track` is preconfigured in `.gitattributes`).
- [ ] No prohibited terminology anywhere in the diff.

### Submission workflow

1. **Open a `pattern-submission` issue first** for hero designs, or anything larger than a single
   blender. This avoids duplicated motifs and lets maintainers flag custodianship questions early.
2. Fork, then branch: `surface/amazonia-ec-hero-guacamayo`.
3. Commit sources, `dist/` exports, `meta.json` and the repeat proof together.
4. Open the pull request using the template and tick the checklist.
5. Expect review on **repeat integrity, colour compliance, provenance and origin declaration**: in
   that order. Two maintainer approvals are required for `hero` tier, one for `secondary` and `blender`.

---

## Web localization contribution path

The showcase site is internationalised from the ground up. Translation is a first-class contribution
and does not require design or build tooling: you can do it entirely in the GitHub web editor.

### Where the files live

```text
web/locales/
├── en/                     # Source of truth: English
│   ├── ui.json             # Interface strings: navigation, buttons, filters, toggle labels
│   ├── collection.json     # Tier names, motif families, country names, colour terms
│   ├── meta.json           # SEO titles, descriptions, Open Graph copy per route
│   └── pages/
│       ├── about.md        # Long-form localized content blocks
│       ├── manifesto.md
│       └── how-to-use.md
├── es/                     # Español: same structure, same keys
└── pt/                     # Português: same structure, same keys
```

**Rule:** `en/` is the source of truth. Every other locale must mirror its **key structure exactly**.
The `validate-locales` workflow fails the build on any missing, extra or misnested key.

### Updating an existing language

1. Fork the repository and branch: `i18n/es-filter-labels`.
2. Edit the relevant file under `web/locales/<lang>/`. Change **values only**: never key names.
3. Keep interpolation placeholders and their names intact:
   `"results_count": "{count} patterns found"` becomes `"{count} patrones encontrados"`.
4. Preserve Markdown structure in `pages/*.md`: same heading levels, same link targets, same front
   matter keys. Translate link *text*, not link *URLs*.
5. Run `npm run validate:locales` from `web/` and confirm it passes.
6. Open a pull request titled `i18n(es): <what you changed>`.

### Adding a brand-new language

We especially welcome **Indigenous and regional languages of the basin** alongside the three base
locales.

1. Open a `localization-request` issue naming the language, its
   [BCP 47](https://www.rfc-editor.org/info/bcp47) tag and whether you can maintain it long-term.
2. Copy the entire `web/locales/en/` directory to `web/locales/<tag>/`, for example
   `web/locales/qu/` for Quechua. Keep every key; translate every value.
3. Register the locale in the site configuration:

   ```js
   // web/src/data/i18n.config.js
   export const locales = ['en', 'es', 'pt', 'qu'];
   export const defaultLocale = 'en';
   export const localeLabels = {
     en: 'English',
     es: 'Español',
     pt: 'Português',
     qu: 'Runasimi',        // Always the endonym, the language's own name
   };
   ```

4. Add the language to the header **language toggle** by adding its entry above: the toggle renders
   from this list, so no component changes are needed.
5. If the language is right-to-left, set `dir: 'rtl'` in its config entry and note it in the PR so a
   maintainer can verify the layout.
6. State in the pull request whether you commit to maintaining the locale as new strings land.

### Translation quality expectations

- **Translate meaning, not words.** UI copy should read as if written natively.
- **Do not translate:** the repository name, the fixed `amazonia` namespace prefix, file names, the
  nomenclature segments, ISO country codes, or the tier identifiers `hero` / `sec` / `blnd`. The
  *display labels* for tiers **are** translated in `collection.json`; the identifiers are not.
- **Motif names:** keep the original-language motif name (`kené`, `vitória-régia`, `achiote`) and add a
  translated gloss in parentheses where helpful. Never replace an Indigenous term with a generic one.
- **Prohibited terminology applies to every language.** Do not translate "pattern" into the local
  garment-construction term: Spanish `patrón de costura`/`molde`, Portuguese `molde de costura`.
  Use `patrón de superficie` / `estampado` (es) and `padrão de superfície` / `estampa` (pt).
- Machine translation as a *starting point* is fine; submitting unreviewed machine output is not.
  Declare it in the PR if you used it.

---

## Website code contributions

- The site is a static build published to GitHub Pages. Keep it dependency-light and fully functional
  without JavaScript wherever possible.
- Follow the established **design patterns** documented in [`docs/adr/`](docs/adr/). New architectural
  decisions require a short ADR in the same pull request.
- Every user-facing string must go through `web/locales/`: **no hardcoded copy in components.** A PR
  that introduces an untranslated literal will be asked to extract it.
- Accessibility is a merge requirement: WCAG 2.1 AA contrast, keyboard-reachable language toggle,
  meaningful `alt` text sourced from the localized catalog.

---

## Review, licensing and attribution

- By submitting, you certify you are the author, and you license artwork under **CC BY-SA 4.0** and
  code under **GPL-3.0**. You are granting a licence: you are **not** transferring ownership.

### How you are credited

**You keep your copyright.** Your name travels with your work, and anyone who uses it, commercially
included, must name *you*, not this repository alone. That obligation is enforced in four places:

| Where | What it does |
| --- | --- |
| Your asset's `meta.json` | The authoritative record. `author.display_name` is **required**; the build fails without it. |
| [`AUTHORS.md`](AUTHORS.md) | Generated from that metadata by `npm run build:authors`. Never edited by hand, so it cannot drift. |
| Your asset card on the site | Shows your name, your portfolio link and a **Copy attribution** button, in all three languages. |
| [`CHANGELOG.md`](CHANGELOG.md) | Credits you in the release that introduces your work. |

`display_name` is the name you sign with: **a pseudonym or studio name is as binding as a legal
name**, and downstream users must reproduce it verbatim. Add `legal_name` only if you want it on
record alongside it; it is never substituted for `display_name` in public credits. If you worked with
a workshop or community, name it in `author.collective`: it is credited *alongside* you, never
instead of you.

The attribution formats users must follow are defined in
[LICENSE-ASSETS.md, "How to credit"](LICENSE-ASSETS.md#how-to-credit-required-attribution-format).
Crediting `amazonian-design-surface` while omitting the artist does not satisfy the licence.
- Maintainers may request changes for repeat integrity, colour compliance, naming or provenance.
  Provenance concerns are the only category where a maintainer may close a PR without a revision cycle.
- Assets found to violate the creative rules after merge are removed, and the removal is documented in
  the changelog.

Questions? Open a [discussion issue](.github/ISSUE_TEMPLATE/config.yml) or read
[SUPPORT.md](.github/SUPPORT.md).
