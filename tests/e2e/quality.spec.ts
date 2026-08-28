import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

for (const path of ['/', '/practice', '/demo', '/privacy', '/terms']) {
  test(`page quality ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/.+/);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('mobile layout has no horizontal overflow and keyboard path works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('desktop first screen includes all three product facts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const fact of ['Audio stays on this device.', 'Works offline after the first visit.', 'Free for one saved passage.']) {
    const box = await page.locator('.fact-list li').filter({ hasText: fact }).boundingBox();
    expect(box, `${fact} is rendered`).not.toBeNull();
    expect(box!.y + box!.height, `${fact} is inside the first viewport`).toBeLessThanOrEqual(900);
  }
});

test('each route has specific metadata and navigation restores focus', async ({ page }) => {
  const routes = [
    ['/', 'Steady Take — measure timing consistency'],
    ['/practice', 'Practice timing — Steady Take'],
    ['/?demo=1', 'Demo — Steady Take'],
    ['/privacy', 'Privacy — Steady Take'],
    ['/terms', 'Terms — Steady Take'],
    ['/missing-page', 'Page not found — Steady Take'],
  ] as const;
  const descriptions = new Set<string>();
  for (const [path, title] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(20);
    expect(ogTitle).toBe(title);
    expect(ogDescription).toBe(description);
    expect(twitterTitle).toBe(title);
    descriptions.add(description!);
  }
  expect(descriptions.size).toBe(routes.length);
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('whitespace-only passage names are rejected with an announced recovery message', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('   ');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('alert')).toHaveText('Enter a passage name, then save the passage.');
  await expect(page.getByRole('heading', { name: 'Set your first passage' })).toBeVisible();
  await expect(page.getByLabel('Passage name')).toBeFocused();
});

test('mobile interactive controls meet the 44px touch target baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    const undersized = await page.locator('a, button, summary, input:not([type="hidden"]), select').evaluateAll((elements) => elements
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { name: (element as HTMLElement).innerText || (element as HTMLInputElement).ariaLabel || (element as HTMLInputElement).name, width: rect.width, height: rect.height };
      })
      .filter((item) => (item.width > 0 || item.height > 0) && (item.width < 44 || item.height < 44)));
    expect(undersized, `${path} has undersized controls`).toEqual([]);
  }
});

test('home stays within a 390px viewport at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('structurally malformed imports preserve the last good data and keep practice usable after reload', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Safe backup scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('heading', { name: 'Safe backup scale', level: 2 })).toBeVisible();
  await page.locator('#import-file').setInputFiles({ name: 'bad-backup.json', mimeType: 'application/json', buffer: Buffer.from('{"passages":[null],"sessions":[]}') });
  await expect(page.getByRole('alert')).toHaveText('This backup could not be read. Choose a Steady Take JSON backup.');
  await expect(page.getByRole('heading', { name: 'Safe backup scale', level: 2 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Safe backup scale', level: 2 })).toBeVisible();
});

test('a legacy malformed stored record is cleared so the practice page can recover', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/practice');
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const open = indexedDB.open('steady-take', 1);
      open.onsuccess = () => {
        const request = open.result.transaction('records', 'readwrite').objectStore('records').put({ passages: [null], sessions: [] }, 'app-data');
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      };
      open.onerror = () => reject(open.error);
    });
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Set your first passage' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('cached valid full access stays active when a daily license check is offline', async ({ page, context }) => {
  await page.goto('/practice');
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
  // Give the active worker one controlled navigation before disconnecting.
  await page.reload();
  await page.evaluate(() => {
    localStorage.setItem('sb_license:music-practice-stability', 'offline-paid');
    localStorage.setItem('sb_license_verdict:music-practice-stability', JSON.stringify({ valid: true, checkedAt: Date.now() - 172_800_000 }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('alert')).toHaveText('Could not check the license. Saved full-version access stays active until you reconnect.');
  await page.getByLabel('Passage name').fill('Offline license scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('button', { name: 'Add passage', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:music-practice-stability'))).not.toBeNull();
});

test('static 404 has the standard skeleton, 44px controls, and no 200% text overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/404.html');
  await expect(page.locator('header, main, footer')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Page not found', level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Steady Take page/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Steady Take');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const undersized = await page.locator('a').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { text: (element as HTMLElement).innerText, width: rect.width, height: rect.height };
  }).filter((item) => (item.width > 0 || item.height > 0) && (item.width < 44 || item.height < 44)));
  expect(undersized).toEqual([]);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('static host config preserves real 404s and immutable hashed assets', ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Config only needs one assertion.');
  const config = JSON.parse(readFileSync('dist/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    responseOverrides: { '404': { rewrite: string } };
    routes: Array<{ route: string; rewrite?: string; headers?: Record<string, string> }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
  expect(config.routes.filter((route) => route.rewrite).map((route) => route.route)).toEqual(['/practice', '/demo', '/privacy', '/terms']);
  expect(config.routes.find((route) => route.route === '/assets/*')?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
});

test('@claim:full-version-price hosted checkout states the exact one-time purchase', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Review sample timing improvement', level: 1 })).toBeVisible();
  const response = await fetch('https://api.sociobot.in/api/v1/products/music-practice-stability/checkout', { redirect: 'manual' });
  expect(response.status).toBe(303);
  const checkoutUrl = response.headers.get('location');
  expect(checkoutUrl).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const checkout = await fetch(checkoutUrl!);
  expect(checkout.status).toBe(200);
  const checkoutHtml = await checkout.text();
  expect(checkoutHtml).toContain('Steady Take Full Version');
  expect(checkoutHtml).toContain('$12.00');
  expect(checkoutHtml).toContain('One-time unlock for Steady Take. Saves unlimited practice passages on this device.');
});

test('demo reset restores its isolated sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(6);
  await expect(page.getByText('Sample data reset.')).toBeVisible();
});
