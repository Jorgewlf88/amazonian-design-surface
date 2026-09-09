# Production technical specifications (normative)

Requirements for any asset accepted into the collection and exported to `dist/`.

## 1. Colour management

| Parameter | Requirement |
| --- | --- |
| Master delivery space | **CMYK — Coated FOGRA39 (ISO 12647-2:2004)** |
| Authoring space | sRGB IEC61966-2.1 or Adobe RGB (1998) |
| Conversion | Relative Colorimetric, black point compensation **ON** |
| Profile embedding | **Mandatory.** Untagged files are rejected. |
| Total Area Coverage | ≤ **300 %** for reactive and pigment digital textile printing |
| Rich black | `C60 M40 Y40 K100`. Never `C100 M100 Y100 K100`. |
| Fine linework / text | 100 % K only — never a four-colour build |
| Limited-palette designs | Ship a matching `.ase` swatch file in `src/assets/palettes/` |

**Rationale for FOGRA39.** It is the most broadly supported coated CMYK characterisation across
European and Latin American print service providers, making it a safe neutral interchange target for a
cross-border contributor base. A mill with its own in-house profile can re-separate from a correctly
tagged master without guesswork; it cannot recover from an untagged one.

Soft-proof before export: assign the profile, view in proof mode, and check that saturated greens and
reds have not clipped. Amazonian palettes are green-heavy and this is where files fail most often.

## 2. Resolution and file format

| Parameter | Requirement |
| --- | --- |
| Minimum resolution | **300 DPI at final print size** |
| Minimum tile dimensions | 2000 × 2000 px (≈ 16.9 × 16.9 cm @ 300 DPI) |
| Raster master | `.tiff` — LZW, flattened, **no layers, no alpha** |
| Raster secondary | `.png` — 8-bit RGB, alpha permitted for cut-out motifs |
| Vector | `.svg` open master, plus `.ai` and/or `.eps` for print workflows |
| Bit depth | 8-bit minimum; 16-bit for gradient-heavy hero designs |
| Upscaling | **Prohibited.** Never interpolate a low-resolution file up to 300 DPI. |

Vector assets must have **all text converted to outlines** and **no linked images** — embed everything.

## 3. Seamless repeat boundary rules

Every collection asset must tile without a visible seam.

1. **Repeat type declared.** `full-drop`, `half-drop` or `brick` with an explicit offset percentage,
   recorded in `meta.json` → `repeat.type`.
2. **Edge continuity.** Elements crossing the boundary are duplicated at the exact opposite edge with
   **pixel-identical** offset (raster) or **numerically identical** coordinates (vector). Offsets must
   be whole-pixel values — sub-pixel drift produces a hairline seam on the press.
3. **Bleed, do not clip.** No artwork terminates on the artboard edge. Elements extend past the
   boundary and wrap.
4. **Proof required.** A 3 × 3 tiled render named `*-repeat-proof.png` accompanies every submission.
5. **Opaque seam.** No stray transparency or off-white halo at the boundary. Flatten to an opaque
   background before TIFF export.
6. **Scale honesty.** The physical repeat size in `meta.json` must equal the pixel dimensions divided
   by 300 DPI.
7. **Motif distribution.** Avoid unintended diagonal "trailing" — check the 3 × 3 proof at 25 % zoom,
   where alignment artefacts become visible.

## 4. Tier-specific expectations

| Tier | Repeat size guidance | Colour count |
| --- | --- | --- |
| `hero` | 24–64 cm repeat. Motif density high, clear focal hierarchy. | Open |
| `sec` | 8–24 cm repeat. Palette must match its hero. | Open |
| `blnd` | 2–12 cm repeat. Reads near-solid at 2 m. | **≤ 6 flat colours**, vector preferred |

## 5. Metadata

Every design folder carries a `meta.json` conforming to
[`web/src/data/asset.schema.json`](../web/src/data/asset.schema.json). Missing or inconsistent metadata
fails CI.

## 6. Version control

Binary sources are tracked with **Git LFS** (see [`.gitattributes`](../.gitattributes)). Never commit a
new visual state over an existing version — increment `v` instead. Published versions are immutable.
