import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const origin = 'https://music-practice-stability.sociobot.in';
const results = { checkedAt: new Date().toISOString(), origin, routes: [], checks: {} };
const browser = await chromium.launch({ headless: true });

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function openCold(path, viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const separator = path.includes('?') ? '&' : '?';
  const response = await page.goto(`${origin}${path}${separator}cold=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(750);
  return { context, page, response, errors };
}

{
  const { context, page, errors } = await openCold('/');
  assert(await page.locator('h1').innerText() === 'Measure timing consistency across takes', 'home headline');
  assert((await page.locator('.hero .eyebrow').innerText()).includes('TIMING PRACTICE FOR BEGINNERS'), 'home eyebrow');
  assert(await page.locator('#limits-title').innerText() === 'What Steady Take measures', 'limits heading');
  assert((await page.locator('.hero-art figcaption').innerText()).includes('landing closer together'), 'hero caption');
  assert(await page.getByRole('link', { name: 'Try it with sample data' }).getAttribute('href') === '/?demo=1', 'query demo link');
  for (const fact of await page.locator('.fact-list li').all()) {
    const box = await fact.boundingBox();
    assert(box && box.y + box.height <= 900, `desktop fact below viewport: ${await fact.innerText()}`);
  }
  await page.getByRole('button', { name: 'Activate full version' }).click();
  assert(await page.getByText('Dodo hosts checkout and handles payment through Sociobot.').isVisible(), 'payment sentence');
  assert(await page.getByRole('link', { name: 'Read the Steady Take purchase terms.' }).getAttribute('href') === '/terms', 'terms link');
  assert(errors.length === 0, `home console errors: ${errors}`);
  results.checks.home = { headline: true, copy: true, factsAboveFold: true, demoLink: true, purchaseTerms: true, errors };
  await context.close();
}

{
  const { context, page, errors } = await openCold('/?demo=1', { width: 390, height: 844 });
  assert(await page.getByText('Demo — sample data, nothing is saved').isVisible(), 'demo banner');
  const result = page.locator('.demo-result');
  const box = await result.boundingBox();
  assert(box && box.y + box.height <= 844, 'demo result below mobile viewport');
  assert(await result.getByRole('heading', { name: 'Latest spread: 26 ms' }).isVisible(), 'demo latest spread');
  assert(await result.getByText('Down from 54 ms across six sessions. That is 52% lower.').isVisible(), 'demo improvement');
  assert(await result.locator('svg').isVisible(), 'demo chart');
  await page.screenshot({ path: '.factory/evidence/polish-1-live/demo-first-screen.png', fullPage: false });
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  assert(await page.locator('table tbody tr').count() === 7, 'demo mutation');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert(await page.locator('table tbody tr').count() === 6, 'demo reset');
  await page.getByRole('button', { name: 'Start reference pulse' }).click();
  await page.waitForFunction(() => Number(document.querySelector('#reference-status')?.getAttribute('data-pulse-count')) >= 2);
  await page.getByRole('button', { name: 'Mute pulse sound' }).click();
  assert((await page.locator('#reference-status').innerText()).includes('sound off'), 'pulse mute');
  await page.getByRole('button', { name: 'Stop reference pulse' }).click();
  assert(errors.length === 0, `demo console errors: ${errors}`);
  results.checks.demo = { banner: true, resultAboveFold: true, result: '54 ms to 26 ms, 52% lower, six sessions', reset: true, pulse: true, errors };
  await context.close();
}

{
  const expected = [
    ['/practice', 'Practice timing — Steady Take'],
    ['/?demo=1', 'Demo — Steady Take'],
    ['/privacy', 'Privacy — Steady Take'],
    ['/terms', 'Terms — Steady Take'],
  ];
  const descriptions = new Set();
  for (const [path, title] of expected) {
    const { context, page, response, errors } = await openCold(path);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    assert(response.status() === 200, `${path} status`);
    assert(await page.title() === title, `${path} title`);
    assert(await page.locator('meta[property="og:title"]').getAttribute('content') === title, `${path} OG title`);
    assert(await page.locator('meta[property="og:description"]').getAttribute('content') === description, `${path} OG description`);
    assert(serious.length === 0, `${path} axe violations`);
    assert(errors.length === 0, `${path} console errors`);
    descriptions.add(description);
    results.routes.push({ path, status: response.status(), title, description, seriousAxe: serious.length, errors });
    await context.close();
  }
  assert(descriptions.size === expected.length, 'route descriptions are not unique');
}

{
  const { context, page, response, errors } = await openCold('/definitely-missing-polish-1', { width: 390, height: 844 });
  assert(response.status() === 404, 'unknown route status');
  assert(await page.title() === 'Page not found — Steady Take', '404 title');
  assert(await page.locator('h1').innerText() === 'Page not found', '404 heading');
  assert(await page.locator('meta[name="description"]').count() === 1, '404 description');
  assert(await page.locator('meta[property="og:title"]').count() === 1, '404 OG');
  assert(await page.locator('link[rel="icon"]').count() === 1, '404 favicon');
  const unexpectedErrors = errors.filter((message) => !message.includes('server responded with a status of 404'));
  assert(unexpectedErrors.length === 0, `404 console errors: ${unexpectedErrors}`);
  await page.screenshot({ path: '.factory/evidence/polish-1-live/404-mobile.png', fullPage: true });
  results.checks.notFound = { status: response.status(), title: true, metadata: true, literalCopy: true, expectedNavigation404: errors, unexpectedErrors };
  await context.close();
}

{
  const { context, page } = await openCold('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await page.waitForFunction(() => document.querySelector('h1') === document.activeElement);
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('h1') === document.activeElement);
  results.checks.routeFocus = true;
  await context.close();
}

{
  const { context, page } = await openCold('/?demo=1');
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert(await page.getByRole('heading', { name: 'Latest spread: 26 ms' }).isVisible(), 'offline demo result');
  results.checks.offlineReload = true;
  await context.close();
}

const checkout = await fetch('https://api.sociobot.in/api/v1/products/music-practice-stability/checkout', { redirect: 'manual' });
assert(checkout.status === 303, 'checkout status');
assert(checkout.headers.get('location')?.startsWith('https://checkout.dodopayments.com/session/'), 'Dodo checkout redirect');
results.checks.checkout = { status: checkout.status, host: new URL(checkout.headers.get('location')).host };

writeFileSync('.factory/evidence/polish-1-live/live-qa.json', JSON.stringify(results, null, 2));
await browser.close();
console.log(JSON.stringify(results, null, 2));
