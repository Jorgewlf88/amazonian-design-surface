## What does this pull request contribute?

<!-- Tick one -->
- [ ] 🎨 New surface design (artwork)
- [ ] 🧵 Fix to an existing asset (repeat, colour, export, metadata)
- [ ] 🌎 Localization (`web/locales/`)
- [ ] 🛠️ Website code, validators or build tooling
- [ ] 📖 Documentation

## Summary

<!-- One or two sentences. -->

---

## For surface design submissions

**Asset identifier:** `amazonia-__-____-__________-v__`
**Tier:** hero / secondary / blender
**Country of origin:** `__` (ISO 3166-1 alpha-2, or `pan`)
**Repeat type:** full-drop / half-drop / brick (____%)
**Physical repeat size:** ____ × ____ cm at 300 DPI

### Provenance
- [ ] 100% original artwork authored by me.
- [ ] No unregulated commercial AI-generated imagery, including as a traced underlayer.
- [ ] Any machine assistance (vectorisation, denoise, procedural generation I authored) is disclosed in `meta.json` → `tooling`.
- [ ] I license this artwork under CC BY-SA 4.0.

### Regional origin declaration
- [ ] `country_origin` present in the file name.
- [ ] `meta.json` declares `origin.country`, `origin.region`, `origin.cultural_reference` and `origin.custodian_consent`.
- [ ] Sacred or restricted imagery is **not** included.

### Technical compliance
- [ ] Nomenclature standard followed exactly: `amazonia-[country_origin]-[tier]-[motif_name]-[v]`.
- [ ] Editable source committed under `src/assets/` in the correct format folder.
- [ ] Seamless repeat verified — whole-pixel edge continuity, no drift, no seam halo.
- [ ] `*-repeat-proof.png` (3 × 3 tiled render) included.
- [ ] `dist/` export at **300 DPI minimum**, never upscaled.
- [ ] TIFF master: CMYK **Coated FOGRA39**, embedded profile, flattened, LZW, ≤ 300% TAC.
- [ ] Binary files tracked via Git LFS.

---

## For localization submissions

**Locale:** `__` — <!-- endonym -->
- [ ] Key structure mirrors `web/locales/en/` exactly (no added, missing or renamed keys).
- [ ] Interpolation placeholders preserved verbatim (`{count}`, `{country}`…).
- [ ] Markdown structure preserved in `pages/*.md`; link URLs untouched.
- [ ] Identifiers (`hero`, `sec`, `blnd`, ISO codes, `amazonia` prefix) left untranslated.
- [ ] Motif names kept in their original language.
- [ ] `npm run validate:locales` passes.
- [ ] New locale only: registered in `web/src/data/i18n.config.js` with its endonym.

---

## Terminology check (required for every pull request)

- [ ] This PR does **not** use the terms *sewing pattern*, *apparel pattern*, *patternmaking* or *cutting file* — in any language, in code, copy, file names or commit messages.
- [ ] "Pattern" is used only for **surface pattern design** or **software design patterns**.

## Related issues

Closes #
