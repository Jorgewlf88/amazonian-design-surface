#!/usr/bin/env node
/**
 * Locale key parity validator.
 *
 * `web/locales/en/` is the source of truth. Every other locale must mirror its key
 * structure exactly: no missing keys, no extra keys, no renamed keys, and must
 * preserve every {placeholder} used in the English string.
 *
 * Run from the repository root:  node scripts/validate-locales.mjs
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Anchor every path to the repository root so the script runs from any directory. */
const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const LOCALES_DIR = 'web/locales';
const SOURCE_LOCALE = 'en';

const errors = [];

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flatten(value, path)
      : [[path, value]];
  });

const placeholders = (value) =>
  typeof value === 'string' ? [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort() : [];

const jsonFiles = (dir) =>
  readdirSync(dir)
    .filter((entry) => entry.endsWith('.json'))
    .sort();

const markdownFiles = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((entry) => entry.endsWith('.md')).sort() : [];

const sourceDir = fromRoot(LOCALES_DIR, SOURCE_LOCALE);
const targets = readdirSync(fromRoot(LOCALES_DIR)).filter(
  (entry) => statSync(fromRoot(LOCALES_DIR, entry)).isDirectory() && entry !== SOURCE_LOCALE,
);

for (const file of jsonFiles(sourceDir)) {
  const source = JSON.parse(readFileSync(join(sourceDir, file), 'utf8'));
  const sourceEntries = new Map(flatten(source));

  for (const locale of targets) {
    const targetPath = fromRoot(LOCALES_DIR, locale, file);
    if (!existsSync(targetPath)) {
      errors.push(`${locale}: missing file ${relative('.', targetPath)}`);
      continue;
    }

    const targetEntries = new Map(flatten(JSON.parse(readFileSync(targetPath, 'utf8'))));

    for (const [key, value] of sourceEntries) {
      if (!targetEntries.has(key)) {
        errors.push(`${locale}/${file}: missing key "${key}"`);
        continue;
      }
      const expected = placeholders(value).join(',');
      const actual = placeholders(targetEntries.get(key)).join(',');
      if (expected !== actual) {
        errors.push(
          `${locale}/${file}: key "${key}" placeholder mismatch, expected {${expected}}, found {${actual}}`,
        );
      }
    }

    for (const key of targetEntries.keys()) {
      if (!sourceEntries.has(key)) {
        errors.push(`${locale}/${file}: unknown key "${key}" not present in ${SOURCE_LOCALE}/`);
      }
    }
  }
}

// Long-form content blocks must exist in every locale too.
const sourcePages = markdownFiles(join(sourceDir, 'pages'));
for (const locale of targets) {
  const localePages = markdownFiles(fromRoot(LOCALES_DIR, locale, 'pages'));
  for (const page of sourcePages) {
    if (!localePages.includes(page)) {
      errors.push(`${locale}/pages: missing content block "${page}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\nERROR: ${errors.length} locale issue(s):\n`);
  errors.forEach((error) => console.error(`  - ${error}`));
  console.error('\nSee CONTRIBUTING.md, "Web localization contribution path".\n');
  process.exit(1);
}

console.log(`Locales ${[SOURCE_LOCALE, ...targets].join(', ')} are in sync.`);
