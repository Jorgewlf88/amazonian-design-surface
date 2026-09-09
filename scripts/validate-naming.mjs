#!/usr/bin/env node
/**
 * Nomenclature validator.
 *
 * Enforces  amazonia-[country_origin]-[tier]-[motif_name]-[v][-suffix].[ext]
 * across src/collection/, dist/ and mockups/.
 *
 * Run from the repository root:  node scripts/validate-naming.mjs
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Anchor every path to the repository root so the script runs from any directory. */
const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const ROOTS = ['src/collection', 'dist', 'mockups'];
const IGNORED = new Set(['.gitkeep', 'README.md', 'meta.json', 'meta.example.json', 'catalog.json', '.DS_Store']);

const ASSET_NAME =
  /^amazonia-(ec|pe|br|co|bo|ve|gy|sr|gf|pan)-(hero|sec|blnd)-[a-z0-9]+(-[a-z0-9]+){0,2}-v\d{2}(-(repeat-proof|flat|mono|cw\d{2}|mock-[a-z0-9-]+))?\.[a-z0-9]+$/;

const FOLDER_NAME =
  /^amazonia-(ec|pe|br|co|bo|ve|gy|sr|gf|pan)-(hero|sec|blnd)-[a-z0-9]+(-[a-z0-9]+){0,2}$/;

const TIER_FOLDERS = new Set(['hero-patterns', 'secondary-patterns', 'blender-patterns']);

const errors = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (IGNORED.has(entry)) continue;
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      const isStructural = TIER_FOLDERS.has(entry) || /^(tiff-300dpi|png-300dpi|web-preview|textile|interior|stationery|templates|ec|pe|br|co|bo|ve|gy|sr|gf|pan)$/.test(entry);
      if (!isStructural && !FOLDER_NAME.test(entry)) {
        errors.push(`${path}: folder name does not follow the nomenclature standard`);
      }
      walk(path);
      continue;
    }

    if (!ASSET_NAME.test(entry)) {
      errors.push(`${path}: file name does not follow amazonia-[country]-[tier]-[motif]-[v]`);
    }
  }
};

// Every design folder must carry a meta.json.
const checkMetadata = () => {
  const collection = fromRoot('src/collection');
  if (!existsSync(collection)) return;
  for (const tier of readdirSync(collection)) {
    const tierPath = join(collection, tier);
    if (!statSync(tierPath).isDirectory()) continue;
    for (const design of readdirSync(tierPath)) {
      const designPath = join(tierPath, design);
      if (!statSync(designPath).isDirectory()) continue;
      if (!existsSync(join(designPath, 'meta.json'))) {
        errors.push(`${designPath}: missing meta.json (regional origin declaration is mandatory)`);
      }
    }
  }
};

ROOTS.map((root) => fromRoot(root)).filter(existsSync).forEach(walk);
checkMetadata();

if (errors.length > 0) {
  console.error(`\n✖ ${errors.length} naming issue(s):\n`);
  errors.forEach((error) => console.error(`  - ${error}`));
  console.error('\nSee docs/nomenclature.md.\n');
  process.exit(1);
}

console.log('✔ All asset names follow the nomenclature standard.');
