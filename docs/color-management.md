# Colour management

## Profile chain

```text
Authoring (sRGB / Adobe RGB)
        │  Relative Colorimetric + BPC
        ▼
Master delivery (CMYK: Coated FOGRA39, ISO 12647-2:2004)
        │
        ├──> dist/tiff-300dpi/   flattened, LZW, profile embedded
        ├──> dist/png-300dpi/    RGB working export
        └──> dist/web-preview/   sRGB WebP for the showcase site
```

## Setting up

In **Adobe applications**, under Edit > Colour Settings:

- RGB working space: `Adobe RGB (1998)` or `sRGB IEC61966-2.1`
- CMYK working space: `Coated FOGRA39 (ISO 12647-2:2004)`
- Engine: Adobe (ACE). Intent: Relative Colorimetric. Black Point Compensation: **on**
- Policies: Preserve Embedded Profiles. Ask on mismatch: **on**

**Procreate**: work in the P3 or sRGB canvas profile, export PSD, convert in Photoshop. Procreate
cannot produce a compliant CMYK master on its own.

## Ink limits

Digital textile printing on cotton and viscose with reactive or pigment inks saturates well before
offset does. Keep **Total Area Coverage at 300 % maximum**.

Check in Photoshop: Window > Info, set a readout to Total Ink, and hover the darkest areas.

## Green channel warning

Amazonian palettes are dominated by saturated greens, which sit largely outside the CMYK gamut. Always
soft-proof (View > Proof Setup > Custom > Coated FOGRA39, then View > Gamut Warning) and adjust the
artwork rather than accepting a flat clipped conversion. A green that looks vivid on screen and dull on
cloth is the single most common disappointment in this archive.

## Deliverables checklist

- [ ] Profile embedded, not merely assigned.
- [ ] TAC at or below 300 %, verified with the Info panel.
- [ ] Rich black is `C60 M40 Y40 K100`.
- [ ] Fine linework is 100 % K only.
- [ ] Limited-palette design ships an `.ase` in `src/assets/palettes/`.
- [ ] Web preview exported in sRGB: the site is not colour-managed for CMYK.
