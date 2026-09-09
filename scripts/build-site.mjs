#!/usr/bin/env node
/**
 * Static site generator.
 *
 * Renders one complete route tree per locale from web/locales/ and dist/catalog.json,
 * with no framework. The archive is meant to outlive framework major versions, so the
 * generator is ~400 lines we own rather than a dependency tree we track.
 *
 * Design patterns applied:
 *   - Adapter  — catalog records are adapted into a locale-resolved view model.
 *   - Template — one layout, one renderer per page kind.
 *   - Strategy — locale resolution order is declared in web/src/data/i18n.config.js.
 *
 * Run from the repository root:  node scripts/build-site.mjs
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

import { locales, defaultLocale, localeLabels, localeDir } from '../web/src/data/i18n.config.js';

/** Anchor every path to the repository root so the script runs from any directory. */
const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const fromRoot = (...segments) => join(REPO_ROOT, ...segments);

const LOCALES_DIR = 'web/locales';
const PUBLIC_DIR = 'web/public';
const OUT_DIR = 'web/dist';
const CATALOG = 'dist/catalog.json';
const PREVIEW_DIR = 'dist/web-preview';

/** GitHub Pages serves this project from a subpath. Override for a custom domain. */
const BASE = (process.env.BASE_PATH ?? '/amazonian-design-surface').replace(/\/$/, '');
const REPO_URL = 'https://github.com/Jorgewlf88/amazonian-design-surface';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const readJson = (path) => JSON.parse(readFileSync(fromRoot(path), 'utf8'));

const escape = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** Resolve a dot path such as "asset_card.author" against a locale dictionary. */
const lookup = (dict, path) => path.split('.').reduce((node, key) => node?.[key], dict);

/** Resolve and interpolate: t(ui, 'filters.results_count', { count: 12 }). */
const translate = (dict, path, vars = {}) => {
  const value = lookup(dict, path);
  if (value === undefined) throw new Error(`Missing locale key: ${path}`);
  return String(value).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
};

/** Minimal front matter reader — avoids a YAML dependency for three known fields. */
const parseFrontMatter = (raw) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(\w+):\s*(.*)$/);
    if (pair) data[pair[1]] = pair[2].trim();
  }
  return { data, body: raw.slice(match[0].length) };
};

const url = (...segments) => `${BASE}/${segments.filter(Boolean).join('/')}`.replace(/\/+$/, '/') || '/';

/** dist/web-preview/pe/x.webp -> previews/pe/x.webp, the path the built site serves. */
const previewPath = (asset) => (asset.files?.preview ?? '').replace(/^dist\/web-preview\//, 'previews/');

const writePage = (relativePath, html) => {
  const target = fromRoot(OUT_DIR, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** route key -> { segment, navKey, kind } */
const ROUTES = [
  { key: 'home', segment: '', navKey: null, kind: 'home' },
  { key: 'collection', segment: 'collection', navKey: 'nav.collection', kind: 'collection' },
  { key: 'about', segment: 'about', navKey: 'nav.about', kind: 'content', page: 'about.md' },
  { key: 'manifesto', segment: 'manifesto', navKey: 'nav.manifesto', kind: 'content', page: 'manifesto.md' },
  { key: 'how-to-use', segment: 'how-to-use', navKey: 'nav.how_to_use', kind: 'content', page: 'how-to-use.md' },
];

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const renderNav = (ui, locale, activeKey) =>
  ROUTES.filter((route) => route.navKey)
    .map((route) => {
      const active = route.key === activeKey;
      return `<a href="${url(locale, route.segment)}" class="nav-link${active ? ' nav-link-active' : ''}"${
        active ? ' aria-current="page"' : ''
      }>${escape(translate(ui, route.navKey))}</a>`;
    })
    .join('');

const renderLanguageToggle = (ui, locale, routeKey) => {
  const segment = ROUTES.find((route) => route.key === routeKey)?.segment ?? '';
  const options = locales
    .map((tag) => {
      const current = tag === locale;
      return `<a href="${url(tag, segment)}" lang="${tag}" hreflang="${tag}" class="lang-option${
        current ? ' lang-option-active' : ''
      }"${current ? ' aria-current="true"' : ''}>${escape(localeLabels[tag])}</a>`;
    })
    .join('');

  return `<nav class="lang-toggle" aria-label="${escape(translate(ui, 'language_toggle.aria_label'))}">
        <span class="lang-label">${escape(translate(ui, 'language_toggle.label'))}</span>
        ${options}
      </nav>`;
};

const renderAlternates = (routeKey) => {
  const segment = ROUTES.find((route) => route.key === routeKey)?.segment ?? '';
  return [
    ...locales.map((tag) => `<link rel="alternate" hreflang="${tag}" href="${url(tag, segment)}">`),
    `<link rel="alternate" hreflang="x-default" href="${url(defaultLocale, segment)}">`,
  ].join('\n    ');
};

const layout = ({ ui, locale, routeKey, title, description, body }) => `<!doctype html>
<html lang="${locale}" dir="${localeDir[locale] ?? 'ltr'}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}">
    <meta property="og:title" content="${escape(title)}">
    <meta property="og:description" content="${escape(description)}">
    <meta property="og:type" content="website">
    ${renderAlternates(routeKey)}
    <link rel="stylesheet" href="${url('assets/main.css')}">
  </head>
  <body class="bg-canvas text-ink antialiased">
    <a href="#main" class="skip-link">${escape(translate(ui, 'actions.back_to_collection'))}</a>
    <header class="site-header">
      <div class="shell flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <a href="${url(locale)}" class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-name">${escape(translate(ui, 'site.name'))}</span>
        </a>
        <nav class="nav" aria-label="${escape(translate(ui, 'nav.collection'))}">
          ${renderNav(ui, locale, routeKey)}
          <a href="${REPO_URL}" class="nav-link">${escape(translate(ui, 'nav.repository'))}</a>
        </nav>
        ${renderLanguageToggle(ui, locale, routeKey)}
      </div>
    </header>

    <main id="main">${body}</main>

    <footer class="site-footer">
      <div class="shell grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p class="footer-title">${escape(translate(ui, 'site.name'))}</p>
          <p class="footer-note">${escape(translate(ui, 'site.tagline'))}</p>
        </div>
        <div class="footer-links">
          <a href="${REPO_URL}/blob/main/CONTRIBUTING.md">${escape(translate(ui, 'footer.contribute_cta'))}</a>
          <a href="${REPO_URL}/blob/main/CONTRIBUTING.md#web-localization-contribution-path">${escape(
            translate(ui, 'footer.translate_cta'),
          )}</a>
          <a href="${REPO_URL}/blob/main/AUTHORS.md">${escape(translate(ui, 'footer.authors_cta'))}</a>
        </div>
        <div class="footer-links">
          <a href="${REPO_URL}/blob/main/LICENSE-ASSETS.md">${escape(translate(ui, 'footer.artwork_license'))}</a>
          <a href="${REPO_URL}/blob/main/LICENSE">${escape(translate(ui, 'footer.code_license'))}</a>
        </div>
      </div>
    </footer>
    <script src="${url('app.js')}" defer></script>
  </body>
</html>
`;

// ---------------------------------------------------------------------------
// Page renderers
// ---------------------------------------------------------------------------

const renderHome = ({ ui, collection, locale, assets }) => {
  const tiers = ['hero', 'sec', 'blnd']
    .map(
      (tier) => `<article class="tier-card">
            <h3 class="tier-name">${escape(translate(collection, `tiers.${tier}.label`))}</h3>
            <p class="tier-copy">${escape(translate(collection, `tiers.${tier}.description`))}</p>
          </article>`,
    )
    .join('');

  return `
      <section class="hero">
        <div class="shell py-20 md:py-28">
          <p class="hero-eyebrow">${escape(translate(ui, 'site.name'))}</p>
          <h1 class="hero-title">${escape(translate(ui, 'site.tagline'))}</h1>
          <div class="hero-actions">
            <a href="${url(locale, 'collection')}" class="btn-primary">${escape(
              translate(ui, 'nav.collection'),
            )}</a>
            <a href="${url(locale, 'how-to-use')}" class="btn-ghost">${escape(
              translate(ui, 'nav.how_to_use'),
            )}</a>
          </div>
          <dl class="hero-stats">
            <div><dt>${escape(translate(ui, 'nav.collection'))}</dt><dd>${assets.length}</dd></div>
            <div><dt>DPI</dt><dd>300</dd></div>
            <div><dt>CMYK</dt><dd>FOGRA39</dd></div>
          </dl>
        </div>
      </section>

      <section class="shell py-16">
        <div class="tier-grid">${tiers}</div>
      </section>
  `;
};

const renderCard = ({ ui, collection, asset, locale }) => {
  const title = asset.title?.[locale] ?? asset.title?.en ?? asset.id;
  const description = asset.description?.[locale] ?? asset.description?.en ?? '';
  const artist = asset.author?.display_name ?? '';
  const [width, height] = asset.repeat?.size_cm ?? ['—', '—'];
  const custodianship =
    asset.custodian_consent === 'pending'
      ? `<p class="badge badge-warn">${escape(translate(ui, 'asset_card.custodianship_pending'))}</p>`
      : asset.custodian_consent === 'documented'
        ? `<p class="badge badge-ok">${escape(translate(ui, 'asset_card.custodianship_documented'))}</p>`
        : '';

  return `<article class="card"
        data-tier="${escape(asset.tier)}"
        data-country="${escape(asset.country)}"
        data-family="${escape(asset.motif_family ?? '')}"
        data-colors="${escape((asset.color?.dominant ?? []).join(' '))}">
        <div class="card-preview">
          <img src="${url(previewPath(asset))}" alt="${escape(title)}" loading="lazy" width="600" height="600">
        </div>
        <div class="card-body">
          <p class="card-tier">${escape(translate(collection, `tiers.${asset.tier}.label`))} · ${escape(
            translate(collection, `countries.${asset.country}`),
          )}</p>
          <h3 class="card-title">${escape(title)}</h3>
          ${description ? `<p class="card-copy">${escape(description)}</p>` : ''}
          <p class="card-author">${escape(translate(ui, 'asset_card.author', { author: artist }))}</p>
          <p class="card-meta">${escape(translate(ui, 'asset_card.repeat_size', { width, height }))}</p>
          <p class="card-meta">${escape(translate(ui, 'asset_card.resolution'))}</p>
          ${custodianship}
          <p class="card-attribution-note">${escape(translate(ui, 'asset_card.attribution_note'))}</p>
          <div class="card-actions">
            <a class="btn-small" href="${REPO_URL}/blob/main/${asset.files.tiff}">${escape(
              translate(ui, 'asset_card.download_master'),
            )}</a>
            <button type="button" class="btn-small btn-copy"
              data-attribution="${escape(asset.attribution?.full ?? '')}"
              data-copied-label="${escape(translate(ui, 'actions.attribution_copied'))}">${escape(
                translate(ui, 'actions.copy_attribution'),
              )}</button>
          </div>
        </div>
      </article>`;
};

const renderFilter = ({ collection, group, keys, label }) => {
  const options = keys
    .map(
      (key) =>
        `<label class="chip"><input type="checkbox" name="${group}" value="${escape(key)}"> <span>${escape(
          translate(collection, `${group === 'tier' ? 'tiers' : group === 'country' ? 'countries' : 'motif_families'}.${key}${group === 'tier' ? '.label' : ''}`),
        )}</span></label>`,
    )
    .join('');
  return `<fieldset class="filter-group"><legend>${escape(label)}</legend><div class="chip-row">${options}</div></fieldset>`;
};

const renderCollection = ({ ui, collection, assets, locale }) => {
  const tiers = [...new Set(assets.map((asset) => asset.tier))];
  const countries = [...new Set(assets.map((asset) => asset.country))];
  const families = [...new Set(assets.map((asset) => asset.motif_family).filter(Boolean))];

  const filters = assets.length
    ? `<form class="filters" id="filters">
          ${renderFilter({ collection, group: 'tier', keys: tiers, label: translate(ui, 'filters.tier') })}
          ${renderFilter({ collection, group: 'country', keys: countries, label: translate(ui, 'filters.country') })}
          ${families.length ? renderFilter({ collection, group: 'family', keys: families, label: translate(ui, 'filters.motif_family') }) : ''}
          <button type="reset" class="btn-ghost btn-small">${escape(translate(ui, 'filters.clear'))}</button>
        </form>`
    : '';

  const body = assets.length
    ? `<p class="results-count" id="results-count" data-template="${escape(
        lookup(ui, 'filters.results_count'),
      )}">${escape(translate(ui, 'filters.results_count', { count: assets.length }))}</p>
        <div class="card-grid" id="card-grid">${assets
          .map((asset) => renderCard({ ui, collection, asset, locale }))
          .join('')}</div>
        <p class="empty-state" id="no-results" hidden>${escape(translate(ui, 'filters.no_results'))}</p>`
    : `<div class="empty-state empty-archive">
          <h2>${escape(translate(ui, 'collection_page.empty_title'))}</h2>
          <p>${escape(translate(ui, 'collection_page.empty_body'))}</p>
          <a class="btn-primary" href="${REPO_URL}/blob/main/CONTRIBUTING.md">${escape(
            translate(ui, 'footer.contribute_cta'),
          )}</a>
        </div>`;

  return `
      <section class="shell py-12">
        <h1 class="page-title">${escape(translate(ui, 'nav.collection'))}</h1>
        ${filters}
        ${body}
      </section>
  `;
};

const renderContent = ({ html }) => `
      <section class="shell py-12">
        <div class="prose">${html}</div>
      </section>
  `;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const catalog = existsSync(fromRoot(CATALOG)) ? readJson(CATALOG) : { assets: [] };
const assets = catalog.assets ?? [];

rmSync(fromRoot(OUT_DIR), { recursive: true, force: true });
mkdirSync(fromRoot(OUT_DIR), { recursive: true });

let pageCount = 0;

for (const locale of locales) {
  const ui = readJson(`${LOCALES_DIR}/${locale}/ui.json`);
  const collection = readJson(`${LOCALES_DIR}/${locale}/collection.json`);
  const meta = readJson(`${LOCALES_DIR}/${locale}/meta.json`);

  for (const route of ROUTES) {
    let body;
    let title;
    let description;

    if (route.kind === 'home') {
      body = renderHome({ ui, collection, locale, assets });
      title = meta.home.title;
      description = meta.home.description;
    } else if (route.kind === 'collection') {
      body = renderCollection({ ui, collection, assets, locale });
      title = meta.collection.title;
      description = meta.collection.description;
    } else {
      const raw = readFileSync(fromRoot(LOCALES_DIR, locale, 'pages', route.page), 'utf8');
      const { data, body: markdown } = parseFrontMatter(raw);
      body = renderContent({ html: marked.parse(markdown) });
      title = `${data.title ?? route.key} — ${translate(ui, 'site.name')}`;
      description = meta[route.key]?.description ?? translate(ui, 'site.tagline');
    }

    writePage(join(locale, route.segment, 'index.html'), layout({ ui, locale, routeKey: route.key, title, description, body }));
    pageCount += 1;
  }
}

// Root entry point: resolve the visitor's language, then fall back to the default.
const redirect = `<!doctype html>
<html lang="${defaultLocale}">
  <head>
    <meta charset="utf-8">
    <title>amazonian-design-surface</title>
    <link rel="canonical" href="${url(defaultLocale)}">
    <meta http-equiv="refresh" content="0; url=${url(defaultLocale)}">
    <script>
      // Strategy: stored preference -> Accept-Language -> default. See i18n.config.js.
      (function () {
        var supported = ${JSON.stringify(locales)};
        var stored = null;
        try { stored = localStorage.getItem('ads-locale'); } catch (e) {}
        var wanted = supported.indexOf(stored) > -1 ? stored : null;
        if (!wanted) {
          var languages = navigator.languages || [navigator.language || ''];
          for (var i = 0; i < languages.length; i++) {
            var tag = String(languages[i]).slice(0, 2).toLowerCase();
            if (supported.indexOf(tag) > -1) { wanted = tag; break; }
          }
        }
        location.replace('${BASE}/' + (wanted || '${defaultLocale}') + '/');
      })();
    </script>
  </head>
  <body>
    <p><a href="${url(defaultLocale)}">amazonian-design-surface</a></p>
  </body>
</html>
`;
writePage('index.html', redirect);
writePage('404.html', redirect);

// Web previews live in dist/ so the mill-facing archive stays the source of truth;
// the site gets its own copy so it is deployable as a self-contained artifact.
if (existsSync(fromRoot(PREVIEW_DIR))) {
  cpSync(fromRoot(PREVIEW_DIR), fromRoot(OUT_DIR, 'previews'), { recursive: true });
}

if (existsSync(fromRoot(PUBLIC_DIR))) {
  for (const entry of readdirSync(fromRoot(PUBLIC_DIR))) {
    if (entry === 'README.md' || entry === '.gitkeep') continue;
    cpSync(fromRoot(PUBLIC_DIR, entry), fromRoot(OUT_DIR, entry), { recursive: true });
  }
}

writeFileSync(fromRoot(OUT_DIR, '.nojekyll'), '');

console.log(`✔ Built ${pageCount} pages across ${locales.length} locales (${assets.length} asset(s)) into ${OUT_DIR}/.`);
