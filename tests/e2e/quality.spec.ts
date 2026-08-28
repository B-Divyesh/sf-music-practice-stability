import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

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

test('demo reset restores its isolated sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(6);
  await expect(page.getByText('Sample data reset.')).toBeVisible();
});
