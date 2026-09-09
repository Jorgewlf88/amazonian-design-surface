#!/usr/bin/env node
/**
 * Scaffolder for a new surface design.
 *
 * Creates the collection folder, a prefilled meta.json, the matching artboard
 * template and the distribution directories, so an artist starts from a valid
 * skeleton instead of transcribing the naming standard by hand.
 *
 * Interactive:  npm run new:design
 * Scripted:     node scripts/new-design.mjs --country ec --tier hero \
 *                 --motif guacamayo --author "Ana Ruiz" --github @handle
 *
 * See docs/nomenclature.md and CONTRIBUTING.md.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const COUNTRIES = {
  ec: 'Ecuador', pe: 'Peru', br: 'Brazil', co: 'Colombia', bo: 'Bolivia',
  ve: 'Venezuela', gy: 'Guyana', sr: 'Suriname', gf: 'French Guiana',
  pan: 'Pan-Amazonian (basin-wide)',
};

const TIERS = {
  hero: { folder: 'hero-patterns', long: 'hero', px: 3000, cm: 25.4,
          template: 'amazonia-template-hero-3000px-300dpi.svg',
          blurb: 'complex focal graphic, carries the collection' },
  sec:  { folder: 'secondary-patterns', long: 'secondary', px: 2000, cm: 16.93,
          template: 'amazonia-template-secondary-2000px-300dpi.svg',
          blurb: 'supporting motif, coordinates with a hero' },
  blnd: { folder: 'blender-patterns', long: 'blender', px: 1200, cm: 10.16,
          template: 'amazonia-template-blender-1200px-300dpi.svg',
          blurb: 'structural texture, geometric or circular filler' },
};

const FAMILIES = ['flora', 'fauna', 'geometric', 'ritual_geometry', 'landscape', 'fiber'];
const REPEATS = ['full-drop', 'half-drop', 'brick'];
const CONSENT = ['not-applicable', 'documented', 'pending'];

// ---------------------------------------------------------------------------

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const flag = process.argv[i];
  if (flag.startsWith('--')) args.set(flag.slice(2), process.argv[i + 1]);
}

const fail = (message) => {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
};

/** ASCII-fold and slugify, matching the nomenclature standard. */
const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/gi, 'n')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const listing = (obj) =>
  Object.entries(obj).map(([key, value]) =>
    `  ${key.padEnd(5)} ${typeof value === 'string' ? value : value.blurb}`).join('\n');

async function main() {
  const interactive = !args.has('country') || !args.has('tier') || !args.has('motif');
  const rl = interactive ? createInterface({ input: stdin, output: stdout }) : null;

  const ask = async (question, fallback) => {
    if (!interactive) return fallback;
    const answer = (await rl.question(question)).trim();
    return answer || fallback;
  };

  if (interactive) {
    console.log('\namazonian-design-surface: new surface design\n');
    console.log('Answer the prompts, or press Enter to accept the value in brackets.\n');
  }

  // --- Country -------------------------------------------------------------
  let country = args.get('country');
  if (!country) {
    console.log('Country of origin. This is a mandatory declaration, never a guess.\n' + listing(COUNTRIES) + '\n');
    country = await ask('Country code [ec]: ', 'ec');
  }
  country = country.toLowerCase();
  if (!COUNTRIES[country]) fail(`Unknown country code "${country}". Expected one of: ${Object.keys(COUNTRIES).join(', ')}`);

  // --- Tier ----------------------------------------------------------------
  let tier = args.get('tier');
  if (!tier) {
    console.log('\nSurface hierarchy tier.\n' + listing(TIERS) + '\n');
    tier = await ask('Tier [hero]: ', 'hero');
  }
  tier = tier.toLowerCase();
  if (tier === 'secondary') tier = 'sec';
  if (tier === 'blender') tier = 'blnd';
  if (!TIERS[tier]) fail(`Unknown tier "${tier}". Expected hero, sec or blnd.`);
  const tierInfo = TIERS[tier];

  // --- Motif ---------------------------------------------------------------
  let motif = args.get('motif');
  if (!motif) {
    console.log('\nMotif name. One to three words, in the language of origin where a local name exists.');
    motif = await ask('Motif: ', '');
  }
  motif = slugify(motif || '');
  if (!motif) fail('A motif name is required.');
  if (motif.split('-').length > 3) fail(`Motif "${motif}" has more than three words.`);

  const id = `amazonia-${country}-${tier}-${motif}`;
  if (!/^amazonia-(ec|pe|br|co|bo|ve|gy|sr|gf|pan)-(hero|sec|blnd)-[a-z0-9]+(-[a-z0-9]+){0,2}$/.test(id)) {
    fail(`Generated id "${id}" does not match the nomenclature standard. See docs/nomenclature.md.`);
  }

  const designDir = fromRoot('src/collection', tierInfo.folder, id);
  if (existsSync(designDir)) {
    fail(`${designDir} already exists. To publish a revision, increment the version inside it instead.`);
  }

  // --- Remaining metadata --------------------------------------------------
  const author = args.get('author') || (await ask('\nName to credit (a pseudonym is fine): ', ''));
  if (!author) fail('An author display name is required. Attribution is a licence condition.');

  const github = args.get('github') || (await ask('GitHub handle [@your-handle]: ', '@your-handle'));
  const region = args.get('region') || (await ask(`Region within ${COUNTRIES[country]} (province, river, area): `, 'TODO: name the region'));

  let family = args.get('family');
  if (!family && interactive) {
    console.log('\nMotif family: ' + FAMILIES.join(', '));
    family = await ask('Family [flora]: ', 'flora');
  }
  family = family || 'flora';
  if (!FAMILIES.includes(family)) fail(`Unknown motif family "${family}". Expected: ${FAMILIES.join(', ')}`);

  let repeat = args.get('repeat');
  if (!repeat && interactive) {
    console.log('\nRepeat type: ' + REPEATS.join(', '));
    repeat = await ask('Repeat [half-drop]: ', 'half-drop');
  }
  repeat = repeat || 'half-drop';
  if (!REPEATS.includes(repeat)) fail(`Unknown repeat type "${repeat}". Expected: ${REPEATS.join(', ')}`);

  let consent = args.get('consent');
  if (!consent && interactive) {
    console.log('\nCultural custodianship. Use not-applicable only when no living tradition is referenced.');
    console.log('  ' + CONSENT.join(', '));
    consent = await ask('Custodianship [not-applicable]: ', 'not-applicable');
  }
  consent = consent || 'not-applicable';
  if (!CONSENT.includes(consent)) fail(`Unknown custodianship state "${consent}". Expected: ${CONSENT.join(', ')}`);

  if (rl) rl.close();

  // --- Scaffold ------------------------------------------------------------
  const version = 'v01';
  const readable = motif.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

  const meta = {
    id,
    title: { en: readable, es: readable, pt: readable },
    description: {
      en: 'TODO: one or two sentences on what the design shows and how it repeats.',
      es: 'TODO: una o dos frases sobre que muestra el diseno y como se repite.',
      pt: 'TODO: uma ou duas frases sobre o que o desenho mostra e como se repete.',
    },
    tier: tierInfo.long,
    motif_family: family,
    origin: {
      country,
      region,
      cultural_reference: consent === 'not-applicable' ? null : 'TODO: name the specific tradition, never "tribal" or "ethnic".',
      custodian_consent: consent,
      inspiration_notes: 'TODO: how you researched or observed this. Cite your sources.',
    },
    author: { display_name: author, github, country },
    repeat: {
      type: repeat,
      ...(repeat === 'full-drop' ? {} : { offset_percent: 50 }),
      size_cm: [tierInfo.cm, tierInfo.cm],
    },
    color: { profile: 'Coated FOGRA39', dominant: ['green'], colorways: 1, flat_colors: 5 },
    tooling: ['TODO: every tool used, including any disclosed machine assistance on your own artwork'],
    license: 'CC-BY-SA-4.0',
    version,
  };

  mkdirSync(designDir, { recursive: true });
  writeFileSync(join(designDir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);

  const artboard = join(designDir, `${id}-${version}.svg`);
  copyFileSync(fromRoot('templates/artboards', tierInfo.template), artboard);

  for (const bucket of ['tiff-300dpi', 'png-300dpi', 'web-preview']) {
    mkdirSync(fromRoot('dist', bucket, country), { recursive: true });
  }

  // --- Next steps ----------------------------------------------------------
  const rel = (p) => p.replace(`${REPO_ROOT}/`, '');
  console.log(`\nCreated ${rel(designDir)}/\n`);
  console.log('  meta.json');
  console.log(`  ${id}-${version}.svg      (${tierInfo.px} x ${tierInfo.px} px artboard, guides included)\n`);
  console.log('Next steps:\n');
  console.log(`  1. Draw inside ${id}-${version}.svg, or replace it with your own source file.`);
  console.log('     Delete the guide group before exporting.');
  console.log('  2. Open templates/repeat-checker.html and drop your exported tile on it');
  console.log('     to confirm the repeat is seamless before you go further.');
  console.log('  3. Export at 300 DPI into:');
  console.log(`       dist/tiff-300dpi/${country}/${id}-${version}.tiff   CMYK Coated FOGRA39, flattened, LZW`);
  console.log(`       dist/png-300dpi/${country}/${id}-${version}.png     RGB`);
  console.log(`       dist/web-preview/${country}/${id}-${version}.webp   sRGB, shown on the site`);
  console.log(`  4. Save a 3x3 tiled render as ${id}-${version}-repeat-proof.png in the design folder.`);
  console.log('  5. Fill in every TODO in meta.json, then run:\n');
  console.log('       npm run validate');
  console.log('       npm run build\n');
  console.log('  6. Commit on a branch named surface/' + id + ' and open a pull request.\n');
}

main().catch((error) => fail(error.message));
