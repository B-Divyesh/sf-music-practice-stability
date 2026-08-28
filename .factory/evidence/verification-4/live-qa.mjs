import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const origin = 'https://music-practice-stability.sociobot.in';
const results = { routes: [], reliability: [], flow: {}, keyboard: {}, reducedMotion: {}, privacy: {}, pwa: {} };
const browser = await chromium.launch({ headless: true });

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  for (const path of ['/', '/practice', '/demo', '/privacy', '/terms', '/definitely-missing-qa']) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle', timeout: 60_000 });
    const axe = await new AxeBuilder({ page }).analyze();
    const facts = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1Count: document.querySelectorAll('h1').length,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      mainCount: document.querySelectorAll('main').length,
      missingAlt: [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }));
    if (viewport.name === 'mobile') {
      await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
      facts.overflowAt200Percent = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    }
    results.routes.push({ viewport: viewport.name, path, status: response?.status(), ...facts, seriousCritical: axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), errors });
    if (path === '/') await page.screenshot({ path: `.factory/evidence/verification-4/live-${viewport.name}-home.png`, fullPage: true });
    if (path === '/demo') await page.screenshot({ path: `.factory/evidence/verification-4/live-${viewport.name}-demo.png`, fullPage: true });
    await context.close();
  }
}

for (let attempt = 1; attempt <= 10; attempt += 1) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  const started = Date.now();
  try {
    const response = await page.goto(`${origin}/demo?qa=${attempt}-${Date.now()}`, { waitUntil: 'networkidle', timeout: 60_000 });
    results.reliability.push({ attempt, status: response?.status(), elapsedMs: Date.now() - started, h1: await page.locator('h1').allTextContents(), errors });
  } catch (error) {
    results.reliability.push({ attempt, elapsedMs: Date.now() - started, error: String(error), errors });
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(`${origin}/practice`, { waitUntil: 'networkidle' });
  await page.getByLabel('Passage name').fill('   ');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  const blankError = await page.getByRole('alert').textContent();
  const blankFocused = await page.getByLabel('Passage name').evaluate((node) => node === document.activeElement);
  await page.getByLabel('Passage name').fill('Boundary timing passage 12345678901234567890123');
  await page.getByLabel('Tempo').fill('29');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  const underMinInvalid = await page.getByLabel('Tempo').evaluate((node) => ({ invalid: node.matches(':invalid'), focused: node === document.activeElement, message: node.validationMessage }));
  await page.getByLabel('Tempo').fill('220');
  await page.getByLabel('Attacks per take').selectOption('8');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  const createdHeading = await page.locator('#instrument-title').textContent();
  const details = await page.locator('.instrument-top').innerText();
  for (let take = 0; take < 6; take += 1) {
    await page.getByRole('button', { name: 'Start take' }).click();
    for (let attack = 0; attack < 8; attack += 1) await page.keyboard.press('Space');
  }
  await page.getByRole('button', { name: 'Save this session' }).click();
  await page.getByText(/Session saved with \d+ ms timing spread\./).waitFor();
  const savedMessage = await page.getByText(/Session saved with \d+ ms timing spread\./).textContent();
  const savedRows = await page.locator('table tbody tr').count();
  await page.getByRole('button', { name: 'Midi' }).click();
  await page.waitForFunction(() => document.querySelector('[data-mode="midi"]')?.getAttribute('aria-pressed') === 'true');
  await page.getByRole('button', { name: 'Start take' }).click();
  const midiError = await page.getByRole('alert').textContent();
  await page.getByRole('button', { name: 'Microphone' }).click();
  await page.waitForFunction(() => document.querySelector('[data-mode="microphone"]')?.getAttribute('aria-pressed') === 'true');
  await page.getByRole('button', { name: 'Start take' }).click();
  await page.getByText(/Microphone access was not available|This browser cannot use microphone input/).waitFor();
  const micError = await page.getByRole('alert').textContent();
  results.flow = { blankError, blankFocused, underMinInvalid, createdHeading, details, savedMessage, savedRows, midiError, micError };
  await page.screenshot({ path: '.factory/evidence/verification-4/live-normal-boundary-flow.png', fullPage: true });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => { const node = document.activeElement; const style = getComputedStyle(node); return { text: node?.textContent?.trim(), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor }; });
  await page.keyboard.press('Enter');
  const mainFocused = await page.locator('#main').evaluate((node) => node === document.activeElement);
  results.keyboard = { skip, mainFocused };
  await context.close();
}

{
  const context = await browser.newContext({ reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  results.reducedMotion = await page.evaluate(() => ({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, samples: [...document.querySelectorAll('*')].map((node) => ({ animation: getComputedStyle(node).animationDuration, transition: getComputedStyle(node).transitionDuration, scroll: getComputedStyle(node).scrollBehavior })).filter((item) => item.animation !== '0s' || item.transition !== '0s' || item.scroll !== 'auto').slice(0, 20) }));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on('request', (request) => requests.push(request.url()));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const rows = await page.locator('table tbody tr').count();
  results.privacy = { requests: [...new Set(requests)], external: [...new Set(requests.filter((url) => new URL(url).origin !== origin))], errors, rows };
  await page.waitForFunction(async () => { await navigator.serviceWorker.ready; return Boolean(navigator.serviceWorker.controller); }, null, { timeout: 30_000 });
  await page.reload({ waitUntil: 'networkidle' });
  const before = await page.evaluate(async () => ({ controller: navigator.serviceWorker.controller?.scriptURL, registrations: (await navigator.serviceWorker.getRegistrations()).map((registration) => ({ scope: registration.scope, active: registration.active?.scriptURL, waiting: registration.waiting?.scriptURL })), caches: await caches.keys() }));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const offline = { h1: await page.locator('h1').textContent(), passage: await page.locator('#instrument-title').textContent(), rows: await page.locator('table tbody tr').count(), status: await page.locator('#connection-status').textContent() };
  results.pwa = { before, offline };
  await context.close();
}

await browser.close();
writeFileSync('.factory/evidence/verification-4/live-qa.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
