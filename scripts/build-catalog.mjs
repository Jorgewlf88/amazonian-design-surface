#!/usr/bin/env node
/**
 * Catalog builder.
 *
 * Walks src/collection/, reads every design's meta.json, and emits dist/catalog.json —
 * the machine-readable index the showcase site consumes to render localized asset cards.
 *
 * Adapter design pattern: repository metadata in, site view model out. Nothing in web/
 * reads the collection directory directly.
 *
 * Run from the repository root:  node scripts/build-catalog.mjs
 */

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Anchor every path to the repository root so the script runs from any directory. */
const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const COLLECTION_DIR = 'src/collection';
const OUTPUT = 'dist/catalog.json';

const TIER_BY_FOLDER = {
  'hero-patterns': 'hero',
  'secondary-patterns': 'sec',
  'blender-patterns': 'blnd',
};

const assets = [];
const warnings = [];

for (const [folder, tierCode] of Object.entries(TIER_BY_FOLDER)) {
  const tierPath = fromRoot(COLLECTION_DIR, folder);
  if (!existsSync(tierPath)) continue;

  for (const design of readdirSync(tierPath).sort()) {
    const designPath = join(tierPath, design);
    if (!statSync(designPath).isDirectory()) continue;

    const metaPath = join(designPath, 'meta.json');
    if (!existsSync(metaPath)) {
      warnings.push(`${COLLECTION_DIR}/${folder}/${design}: missing meta.json — skipped`);
      continue;
    }

    const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    const country = meta.origin?.country ?? 'pan';
    const version = meta.version ?? 'v01';

    assets.push({
      id: meta.id,
      tier: tierCode,
      country,
      motif_family: meta.motif_family ?? null,
      title: meta.title,
      description: meta.description ?? {},
      repeat: meta.repeat,
      color: meta.color,
      author: meta.author,
      custodian_consent: meta.origin?.custodian_consent ?? 'not-applicable',
      cultural_reference: meta.origin?.cultural_reference ?? null,
      license: meta.license,
      version,
      files: {
        source: `${COLLECTION_DIR}/${folder}/${design}/`,
        tiff: `dist/tiff-300dpi/${country}/${meta.id}-${version}.tiff`,
        png: `dist/png-300dpi/${country}/${meta.id}-${version}.png`,
        preview: `dist/web-preview/${country}/${meta.id}-${version}.webp`,
      },
    });
  }
}

mkdirSync(fromRoot('dist'), { recursive: true });
writeFileSync(
  fromRoot(OUTPUT),
  `${JSON.stringify({ generated_at: new Date().toISOString(), count: assets.length, assets }, null, 2)}\n`,
);

warnings.forEach((warning) => console.warn(`  ! ${warning}`));
console.log(`✔ Wrote ${OUTPUT} with ${assets.length} asset(s).`);
