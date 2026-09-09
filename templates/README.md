# Templates for artists

Everything here exists so you can start drawing instead of transcribing a specification.
Download what you need, or let the scaffolder set it up for you.

## The fastest route

From the repository root:

```bash
npm run new:design
```

It asks for the country, tier, motif, your credit name and a few metadata fields, then creates:

- the design folder under `src/collection/<tier>-patterns/<id>/`,
- a `meta.json` already filled in with everything it can infer,
- the correct artboard template, renamed to the right filename,
- the `dist/` directories for your country code.

It refuses to run if the design already exists, if the country or tier is unknown, or if the
motif is longer than three words, so you cannot accidentally break the naming standard.

Scripted, if you prefer flags:

```bash
node scripts/new-design.mjs --country ec --tier hero --motif guacamayo \
  --author "Your Name" --github @your-handle --region "Napo" --family fauna
```

## What is in this folder

### `artboards/`

Square SVG artboards at 300 DPI, one per tier. Sizes are round pixel values so a half-drop
offset always lands on a whole pixel, which is what keeps a hairline seam off the press.

| File | Pixels | At 300 DPI | Use for |
| --- | --- | --- | --- |
| `amazonia-template-hero-3000px-300dpi.svg` | 3000 x 3000 | 25.4 x 25.4 cm | Hero designs |
| `amazonia-template-secondary-2000px-300dpi.svg` | 2000 x 2000 | 16.93 x 16.93 cm | Secondary designs |
| `amazonia-template-blender-1200px-300dpi.svg` | 1200 x 1200 | 10.16 x 10.16 cm | Blender designs |

Each artboard carries:

- a solid tile boundary, so you can see exactly where the repeat cuts;
- dashed centre lines at 50%, to check how the motif reads as a half drop;
- faint thirds, to spot motifs drifting into diagonal trails;
- corner registration marks.

All guides sit in one group, `guides-delete-before-export`. **Delete that group before you
export.** The artwork group is empty and waiting for you.

Open them in Illustrator, Affinity Designer, Inkscape or any SVG editor. If you paint in
Procreate or Photoshop instead, use the pixel dimensions above for your canvas.

### `repeat-checker.html`

Open it in any browser and drop your exported tile on it. It shows the design repeated in a
3x3, 5x5 or 8x8 grid, simulates full drop, half drop and brick, and reports whether the tile
is square, whether a half drop lands on a whole pixel, and whether it meets the minimum size.

Everything runs locally in your browser. **Your file is never uploaded anywhere.**

Inspect the result at 25% zoom. Two failures only appear at that scale:

- a pale or dark hairline along a tile edge, from a sub-pixel offset or a non-opaque background;
- diagonal or vertical trails, from motifs quietly aligning across tiles.

### `meta.template.json`

A blank metadata record with every field and a note on what belongs in it. `npm run new:design`
writes one of these for you already filled in, so reach for this only if you are building a
record by hand.

Validate whatever you write with:

```bash
npm run validate:metadata
```

It checks the record against the asset schema, catches unknown values in every enumerated
field, and refuses any `TODO` left behind.

## Before you open a pull request

```bash
npm run validate    # naming, metadata, locales, terminology
npm run build       # catalog, credit roster, site, stylesheet
```

The full rules live in [`docs/production-specs.md`](../docs/production-specs.md) and
[`docs/seamless-repeat-guide.md`](../docs/seamless-repeat-guide.md). The contribution process is
in [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## A note on terminology

These are **surface pattern** templates: repeating visual compositions for printed surfaces.
This repository holds no garment manufacturing templates, no apparel cutting files and no
tailoring molds.
