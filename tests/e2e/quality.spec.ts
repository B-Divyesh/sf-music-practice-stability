import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

for (const path of ['/', '/demo', '/privacy', '/terms']) {
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

test('registered checkout opens a hosted Dodo checkout', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Live integration only needs one assertion.');
  const response = await fetch('https://api.sociobot.in/api/v1/products/music-practice-stability/checkout', { redirect: 'manual' });
  expect(response.status).toBe(303);
  expect(response.headers.get('location')).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('demo reset restores its isolated sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(6);
  await expect(page.getByText('Sample data reset.')).toBeVisible();
});
