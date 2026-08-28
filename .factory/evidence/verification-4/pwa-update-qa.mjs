import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

let updated = false;
const root = join(process.cwd(), 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:4199');
  if (url.pathname === '/flip') { updated = true; response.end('ok'); return; }
  let path = ['/practice', '/demo', '/privacy', '/terms', '/'].includes(url.pathname) ? '/index.html' : url.pathname;
  try {
    let body = readFileSync(join(root, path));
    if (path === '/sw.js' && updated) body = Buffer.from(body.toString().replace(/const VERSION = "[^"]+";/, 'const VERSION = "steady-take-qa-update";'));
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': path === '/sw.js' ? 'no-store' : 'no-cache', 'Service-Worker-Allowed': '/' });
    response.end(body);
  } catch {
    response.writeHead(404); response.end('not found');
  }
});

await new Promise((resolve) => server.listen(4199, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('http://127.0.0.1:4199/', { waitUntil: 'networkidle' });
await page.waitForFunction(async () => { await navigator.serviceWorker.ready; return Boolean(navigator.serviceWorker.controller); });
const initial = await page.evaluate(async () => ({ controller: navigator.serviceWorker.controller?.scriptURL, caches: await caches.keys() }));
await page.evaluate(() => fetch('/flip'));
await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
await page.getByText('An update is ready. Reload when you finish this take.').waitFor({ timeout: 30_000 });
await page.waitForFunction(async () => (await caches.keys()).some((name) => name.includes('qa-update')));
const after = await page.evaluate(async () => ({ notice: document.querySelector('.notice')?.textContent, controller: navigator.serviceWorker.controller?.scriptURL, caches: await caches.keys() }));
console.log(JSON.stringify({ initial, after }, null, 2));
await context.close();
await browser.close();
await new Promise((resolve) => server.close(resolve));
