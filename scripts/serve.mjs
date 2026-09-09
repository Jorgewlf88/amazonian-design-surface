#!/usr/bin/env node
/**
 * Zero-dependency preview server for web/dist/, using only node:http.
 * Mirrors the GitHub Pages subpath so links resolve exactly as in production.
 *
 * Run from the repository root:  node scripts/serve.mjs
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const ROOT = join(REPO_ROOT, 'web/dist');
const BASE = (process.env.BASE_PATH ?? '/amazonian-design-surface').replace(/\/$/, '');
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || '/';

  let file = join(ROOT, path);
  let status = 200;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    // GitHub Pages serves 404.html with a real 404 — mirror that locally.
    file = join(ROOT, '404.html');
    status = 404;
  }

  try {
    const body = await readFile(file);
    response.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`→ http://localhost:${PORT}${BASE}/`);
});
