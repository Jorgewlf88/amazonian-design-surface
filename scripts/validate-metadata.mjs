#!/usr/bin/env node
/**
 * Metadata validator.
 *
 * Checks every design's meta.json against web/src/data/asset.schema.json.
 * The schema is read at run time, so the rules live in one place and cannot
 * drift from what the site consumes.
 *
 * This implements the JSON Schema subset the asset schema actually uses rather
 * than pulling in a validator dependency. See docs/adr/0002.
 *
 * Run from the repository root:  node scripts/validate-metadata.mjs
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const SCHEMA_PATH = 'web/src/data/asset.schema.json';
const COLLECTION_DIR = 'src/collection';
const TIER_FOLDERS = ['hero-patterns', 'secondary-patterns', 'blender-patterns'];

const schema = JSON.parse(readFileSync(fromRoot(SCHEMA_PATH), 'utf8'));
const errors = [];

const typeOf = (value) =>
  value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value === 'number'
    ? (Number.isInteger(value) ? 'integer' : 'number')
    : typeof value;

const matchesType = (value, expected) => {
  const kinds = Array.isArray(expected) ? expected : [expected];
  const actual = typeOf(value);
  return kinds.some((kind) => kind === actual || (kind === 'number' && actual === 'integer'));
};

function validate(value, rules, path, report) {
  if (rules.const !== undefined && value !== rules.const) {
    report(`${path}: must be ${JSON.stringify(rules.const)}, found ${JSON.stringify(value)}`);
    return;
  }
  if (rules.enum && !rules.enum.includes(value)) {
    report(`${path}: must be one of ${rules.enum.map((v) => JSON.stringify(v)).join(', ')}, found ${JSON.stringify(value)}`);
    return;
  }
  if (rules.type && !matchesType(value, rules.type)) {
    report(`${path}: expected ${Array.isArray(rules.type) ? rules.type.join(' or ') : rules.type}, found ${typeOf(value)}`);
    return;
  }

  if (typeof value === 'string') {
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      report(`${path}: "${value}" does not match ${rules.pattern}`);
    }
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      report(`${path}: needs at least ${rules.minLength} characters, has ${value.length}`);
    }
    if (rules.format === 'uri' && !/^https?:\/\/\S+$/.test(value)) {
      report(`${path}: "${value}" is not an absolute http(s) URL`);
    }
    if (value.startsWith('TODO')) {
      report(`${path}: still contains a TODO placeholder`);
    }
  }

  if (Array.isArray(value)) {
    if (rules.minItems !== undefined && value.length < rules.minItems) {
      report(`${path}: needs at least ${rules.minItems} item(s), has ${value.length}`);
    }
    if (rules.maxItems !== undefined && value.length > rules.maxItems) {
      report(`${path}: allows at most ${rules.maxItems} item(s), has ${value.length}`);
    }
    if (rules.items) value.forEach((item, i) => validate(item, rules.items, `${path}[${i}]`, report));
  }

  if (typeof value === 'number') {
    if (rules.minimum !== undefined && value < rules.minimum) {
      report(`${path}: must be at least ${rules.minimum}`);
    }
    if (rules.exclusiveMinimum !== undefined && value <= rules.exclusiveMinimum) {
      report(`${path}: must be greater than ${rules.exclusiveMinimum}`);
    }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of rules.required ?? []) {
      if (!(key in value)) report(`${path}: missing required field "${key}"`);
    }
    if (rules.additionalProperties === false && rules.properties) {
      for (const key of Object.keys(value)) {
        if (!(key in rules.properties)) report(`${path}: unknown field "${key}"`);
      }
    }
    for (const [key, sub] of Object.entries(rules.properties ?? {})) {
      if (key in value) validate(value[key], sub, path === '' ? key : `${path}.${key}`, report);
    }
    if (rules.additionalProperties && typeof rules.additionalProperties === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (!(rules.properties && key in rules.properties)) {
          validate(item, rules.additionalProperties, `${path}.${key}`, report);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------

let checked = 0;
for (const folder of TIER_FOLDERS) {
  const tierPath = fromRoot(COLLECTION_DIR, folder);
  if (!existsSync(tierPath)) continue;

  for (const design of readdirSync(tierPath).sort()) {
    const designPath = join(tierPath, design);
    if (!statSync(designPath).isDirectory()) continue;

    const label = `${COLLECTION_DIR}/${folder}/${design}/meta.json`;
    const metaPath = join(designPath, 'meta.json');
    if (!existsSync(metaPath)) {
      errors.push(`${label}: missing`);
      continue;
    }

    let meta;
    try {
      meta = JSON.parse(readFileSync(metaPath, 'utf8'));
    } catch (error) {
      errors.push(`${label}: invalid JSON, ${error.message}`);
      continue;
    }

    validate(meta, schema, '', (message) => errors.push(`${label} ${message}`));

    // Cross-checks the schema alone cannot express.
    if (meta.id && meta.id !== design) {
      errors.push(`${label} id "${meta.id}" does not match its folder name "${design}"`);
    }
    const expectedTier = { 'hero-patterns': 'hero', 'secondary-patterns': 'secondary', 'blender-patterns': 'blender' }[folder];
    if (meta.tier && meta.tier !== expectedTier) {
      errors.push(`${label} tier "${meta.tier}" does not match its folder, expected "${expectedTier}"`);
    }
    if (meta.id && meta.tier) {
      const code = { hero: 'hero', secondary: 'sec', blender: 'blnd' }[meta.tier];
      if (code && !meta.id.includes(`-${code}-`)) {
        errors.push(`${label} id "${meta.id}" does not carry the "${code}" tier segment`);
      }
    }
    if (meta.repeat?.type && meta.repeat.type !== 'full-drop' && meta.repeat.offset_percent === undefined) {
      errors.push(`${label} repeat.type "${meta.repeat.type}" requires an explicit offset_percent`);
    }
    checked += 1;
  }
}

if (errors.length > 0) {
  console.error(`\nERROR: ${errors.length} metadata issue(s):\n`);
  errors.forEach((error) => console.error(`  - ${error}`));
  console.error('\nSee CONTRIBUTING.md, "Regional origin declaration", and templates/meta.template.json.\n');
  process.exit(1);
}

console.log(`Metadata valid for ${checked} design(s).`);
