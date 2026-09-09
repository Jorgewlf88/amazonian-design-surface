# Building and verifying a seamless repeat

A practical guide. The binding rules live in
[`production-specs.md`](production-specs.md#3-seamless-repeat-boundary-rules).

## Choosing a repeat type

| Type | When to use | Declared as |
| --- | --- | --- |
| **Full-drop** | Strong grid motifs, ritual geometry, structural blenders. | `"type": "full-drop"` |
| **Half-drop** | Organic flora and fauna. Breaks the vertical grid, hides the tile. | `"type": "half-drop", "offset_percent": 50` |
| **Brick / offset** | Horizontal motifs: leaves, feathers, river bands. | `"type": "brick", "offset_percent": 33` |

## Raster workflow (Photoshop / Procreate)

1. Start on a square canvas at 300 DPI: 2000x2000 px minimum. Set the document to your authoring
   RGB space; convert to CMYK on export only.
2. Compose the interior of the tile first. Leave the outer 15 % empty at this stage.
3. Apply an **offset of exactly half the canvas** in both axes (Filter > Other > Offset,
   *Wrap Around*). Whole pixels only.
4. Fill the seam cross that now runs through the centre. Never paint outside the canvas bounds after
   this step.
5. Offset back and check. Repeat steps 3-4 until the cross is invisible.
6. Flatten to an opaque background. Export TIFF as specified.

## Vector workflow (Illustrator)

1. Build inside a square artboard whose dimensions are round numbers in cm.
2. Elements crossing an edge must be **duplicated**: copy, then move by exactly the artboard width or
   height using the Transform panel with numeric entry. Never drag.
3. Do not rely on the clipping mask to define the tile: the exported bounds must match the artboard.
4. Convert text to outlines, embed all images, expand all live effects before export.
5. Export SVG for the open master, then `.ai`/`.eps` for print delivery.

## Verification: required in every submission

Produce a **3x3 tiled render**, saved as `*-repeat-proof.png`:

```bash
# ImageMagick: build the proof from your exported tile
magick montage tile.png tile.png tile.png \
              tile.png tile.png tile.png \
              tile.png tile.png tile.png \
              -tile 3x3 -geometry +0+0 \
              amazonia-pe-hero-kene-geometry-v01-repeat-proof.png
```

Inspect the proof at **25 % zoom**. Two failure modes appear only at this scale:

- **Hairline seams**: caused by sub-pixel offsets or a non-opaque background.
- **Trailing / tramlines**: unintended diagonal or vertical alignment of motifs. Fix by redistributing
  motifs, not by adding more.

## Common rejection causes

| Symptom | Cause |
| --- | --- |
| One-pixel light line on the seam | Offset applied at a fractional value, or anti-aliased transparent edge |
| Colour shift at the boundary | Layer effect or adjustment layer clipped to the canvas |
| Motif cut in half | Element clipped instead of wrapped |
| Visible grid at 25 % | Full-drop used for an organic motif: switch to half-drop |
| Repeat size mismatch | Metadata `size_cm` not recalculated after a canvas resize |
