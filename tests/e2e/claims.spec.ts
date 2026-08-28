import { expect, test } from '@playwright/test';

test('@claim:sample-improvement sample has six sessions and a 52% drop', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Explore a steadier passage');
  await expect(page.getByText('26 milliseconds timing spread, 52% lower than the first session.')).toBeVisible();
  await page.getByText('Read the chart as text').click();
  await expect(page.locator('.trend-figure details li')).toHaveCount(6);
});

test('@claim:offline-reload demo reloads with its data offline', async ({ page, context }) => {
  await page.goto('/demo');
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'G major crossing', level: 2 })).toBeVisible();
  await expect(page.getByText('26 milliseconds timing spread, 52% lower than the first session.')).toBeVisible();
});

test('@claim:local-only sample flow makes only same-origin requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await expect(page.getByText('Sample session added with 22 ms timing spread.')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:tap-capture records six takes and saves measured spread', async ({ page }) => {
  await page.goto('/demo');
  for (let take = 0; take < 6; take += 1) {
    await page.getByRole('button', { name: /Start take/ }).click();
    for (let attack = 0; attack < 4; attack += 1) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(24 + attack * 3);
    }
  }
  await expect(page.getByText('Six takes captured')).toBeVisible();
  await page.getByRole('button', { name: 'Save this session' }).click();
  await expect(page.getByText(/Session saved with \d+ ms timing spread\./)).toBeVisible();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
});

test('@claim:input-options microphone and MIDI inputs enter capture', async ({ page, context }) => {
  await context.grantPermissions(['microphone'], { origin: 'http://127.0.0.1:4173' });
  await page.addInitScript(() => {
    const input: { onmidimessage: ((event: { data: Uint8Array }) => void) | null } = { onmidimessage: null };
    Object.defineProperty(window, '__steadyMidiInput', { value: input });
    Object.defineProperty(navigator, 'requestMIDIAccess', { value: async () => ({ inputs: new Map([['fixture', input]]) }) });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Microphone' }).click();
  await page.getByRole('button', { name: 'Start take' }).click();
  await expect(page.getByText('Play the passage now')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel take' }).click();
  await page.getByRole('button', { name: 'Midi' }).click();
  await page.getByRole('button', { name: 'Start take' }).click();
  for (let attack = 0; attack < 4; attack += 1) {
    await page.evaluate(() => {
      const input = (window as unknown as { __steadyMidiInput: { onmidimessage: ((event: { data: Uint8Array }) => void) | null } }).__steadyMidiInput;
      input.onmidimessage?.({ data: new Uint8Array([0x90, 60, 100]) });
    });
    await page.waitForTimeout(30);
  }
  await expect(page.getByText('Take 1 captured. Mark it controlled if it felt settled.')).toBeVisible();
});

test('@claim:csv-export CSV contains the practice fields', async ({ page }) => {
  await page.goto('/practice');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString()).toContain('"session_id","passage","date","bpm","input","take","controlled","deviation_ms","onsets_ms"');
});

test('@claim:data-backup JSON backup round-trips and local data clears', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Backup scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = Buffer.concat(chunks);
  expect(JSON.parse(backup.toString()).passages[0].name).toBe('Backup scale');
  await page.locator('#import-file').setInputFiles({ name: 'steady-take-backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.getByText('Backup imported.')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear all data' }).click();
  await expect(page.getByRole('heading', { name: 'Set your first passage' })).toBeVisible();
});

test('@claim:free-passage-limit free mode keeps one passage', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('C scale turn');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('button', { name: 'Add passage with full version' })).toBeVisible();
  await page.getByRole('button', { name: 'Add passage with full version' }).click();
  await expect(page.getByText('The free version saves one passage. Buy the full version to add another.')).toBeVisible();
});

test('@claim:paid-passages valid license permits a second saved passage', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/music-practice-stability/verify?license=valid-test', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Have a license?' }).click();
  await page.getByLabel('License token').fill('valid-test');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Full version active on this device.')).toBeVisible();
  await page.getByRole('link', { name: 'Practice' }).click();
  await page.getByLabel('Passage name').fill('D minor turn');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await page.getByRole('button', { name: 'Add passage', exact: true }).click();
  await page.getByLabel('Passage name').fill('A major shift');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.locator('.passage-picker>div button')).toHaveCount(2);
});

test('@claim:controlled-takes controlled marks persist with the saved session', async ({ page }) => {
  await page.goto('/demo');
  for (let take = 0; take < 6; take += 1) {
    await page.getByRole('button', { name: /Start take/ }).click();
    for (let attack = 0; attack < 4; attack += 1) await page.keyboard.press('Space');
    if (take === 0) await page.getByRole('checkbox', { name: 'Controlled' }).check();
  }
  await page.getByRole('button', { name: 'Save this session' }).click();
  await expect(page.locator('table tbody tr').first().locator('td[data-label="Controlled"]')).toHaveText('1');
});

test('@claim:demo-isolation sample changes do not read or write real practice data', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Real practice scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'G major crossing', level: 2 })).toBeVisible();
  await expect(page.getByText('Real practice scale')).toHaveCount(0);
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await page.goto('/practice');
  await expect(page.getByRole('heading', { name: 'Real practice scale', level: 2 })).toBeVisible();
  await expect(page.getByText('Sample session added with 22 ms timing spread.')).toHaveCount(0);
});

test('@claim:audio-not-recorded microphone capture creates no recording or audio request', async ({ page, context }) => {
  const external: string[] = [];
  await context.grantPermissions(['microphone'], { origin: 'http://127.0.0.1:4173' });
  await page.addInitScript(() => {
    Object.defineProperty(window, '__steadyRecorderCalls', { value: 0, writable: true });
    Object.defineProperty(window, 'MediaRecorder', { configurable: true, value: class { constructor() { (window as unknown as { __steadyRecorderCalls: number }).__steadyRecorderCalls += 1; } } });
  });
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Microphone' }).click();
  await page.getByRole('button', { name: 'Start take' }).click();
  await expect(page.getByText('Play the passage now')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel take' }).click();
  expect(await page.evaluate(() => (window as unknown as { __steadyRecorderCalls: number }).__steadyRecorderCalls)).toBe(0);
  expect(external).toEqual([]);
});
