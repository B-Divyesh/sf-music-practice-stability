import { expect, test } from '@playwright/test';

test('@claim:sample-improvement sample has six sessions and a 52% drop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review sample timing improvement');
  const result = page.locator('.demo-result');
  await expect(result.getByRole('heading', { name: 'Latest spread: 26 ms' })).toBeVisible();
  await expect(result.getByText('Down from 54 ms across six sessions. That is 52% lower.')).toBeVisible();
  await expect(result.locator('svg')).toBeVisible();
  expect((await result.boundingBox())!.y + (await result.boundingBox())!.height).toBeLessThanOrEqual(844);
  await page.getByText('Read the chart as text').click();
  await expect(page.locator('.trend-figure details li')).toHaveCount(6);
});

test('@claim:offline-reload demo prepares offline use, then reloads with its data offline', async ({ page, context }) => {
  await page.addInitScript(() => {
    const register = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    Object.defineProperty(navigator.serviceWorker, 'register', {
      configurable: true,
      value: (...args: Parameters<ServiceWorkerContainer['register']>) => new Promise((resolve, reject) => {
        setTimeout(() => { void register(...args).then(resolve, reject); }, 300);
      }),
    });
  });
  await page.goto('/demo');
  await expect(page.locator('#connection-status')).toHaveText('Preparing offline use');
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
  await expect(page.locator('#connection-status')).toHaveText('Ready offline');
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#connection-status')).toHaveText('Offline now');
  await expect(page.getByRole('heading', { name: 'G major crossing', level: 2 })).toBeVisible();
  await expect(page.getByText('26 milliseconds timing spread, 52% lower than the first session.')).toBeVisible();
});

test('@claim:update-check installed app checks only its own site for an update', async ({ page }) => {
  await page.goto('/privacy');
  const registration = await page.evaluate(async () => {
    const worker = await navigator.serviceWorker.ready;
    await worker.update();
    return { scope: worker.scope, scriptUrl: worker.active?.scriptURL ?? worker.waiting?.scriptURL ?? worker.installing?.scriptURL ?? '' };
  });
  expect(new URL(registration.scope).origin).toBe('http://127.0.0.1:4173');
  expect(new URL(registration.scriptUrl).origin).toBe('http://127.0.0.1:4173');
  expect(new URL(registration.scriptUrl).pathname).toBe('/sw.js');
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

test('@claim:permission-on-demand microphone and MIDI APIs are requested only after Start take', async ({ page }) => {
  await page.addInitScript(() => {
    const calls = { microphone: 0, midi: 0 };
    const stream = { getTracks: () => [{ stop: () => undefined }] };
    const input: { onmidimessage: ((event: { data: Uint8Array }) => void) | null } = { onmidimessage: null };
    Object.defineProperty(window, '__steadyPermissionCalls', { configurable: true, value: calls });
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => { calls.microphone += 1; return stream; } },
    });
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      configurable: true,
      value: async () => { calls.midi += 1; return { inputs: new Map([['permission-fixture', input]]) }; },
    });
    class FixtureAnalyser {
      fftSize = 512;
      getByteTimeDomainData(samples: Uint8Array) { samples.fill(128); }
    }
    class FixtureAudioContext {
      createMediaStreamSource() { return { connect: () => undefined }; }
      createAnalyser() { return new FixtureAnalyser(); }
      close() { return Promise.resolve(); }
    }
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: FixtureAudioContext });
  });
  await page.goto('/demo');
  const calls = () => page.evaluate(() => (window as unknown as { __steadyPermissionCalls: { microphone: number; midi: number } }).__steadyPermissionCalls);
  expect(await calls()).toEqual({ microphone: 0, midi: 0 });
  await page.getByRole('button', { name: 'Microphone' }).click();
  expect(await calls()).toEqual({ microphone: 0, midi: 0 });
  await page.getByRole('button', { name: 'Start take' }).click();
  await expect(page.getByText('Play the passage now')).toBeVisible();
  expect(await calls()).toEqual({ microphone: 1, midi: 0 });
  await page.getByRole('button', { name: 'Cancel take' }).click();
  await page.getByRole('button', { name: 'Midi' }).click();
  expect(await calls()).toEqual({ microphone: 1, midi: 0 });
  await page.getByRole('button', { name: 'Start take' }).click();
  await expect(page.getByText('Play any MIDI note')).toBeVisible();
  expect(await calls()).toEqual({ microphone: 1, midi: 1 });
});

test('@claim:microphone-detection steady background is ignored and separated impulses are detected', async ({ page }) => {
  await page.addInitScript(() => {
    const stream = { getTracks: () => [{ stop: () => undefined }] };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => stream } });
    class FixtureAnalyser {
      fftSize = 512;
      private frame = 0;
      getByteTimeDomainData(samples: Uint8Array) {
        const loud = [14, 28, 42, 56].includes(this.frame++);
        samples.forEach((_, index) => { samples[index] = 128 + (index % 2 ? 1 : -1) * (loud ? 32 : 2); });
      }
    }
    class FixtureAudioContext {
      createMediaStreamSource() { return { connect: () => undefined }; }
      createAnalyser() { return new FixtureAnalyser(); }
      close() { return Promise.resolve(); }
    }
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: FixtureAudioContext });
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Microphone' }).click();
  await page.getByRole('button', { name: 'Start take' }).click();
  await expect(page.getByText('Take 1 captured. Mark it controlled if it felt settled.')).toBeVisible({ timeout: 3_000 });
  await expect(page.locator('.take-mark:not(.empty)')).toHaveCount(1);
});

test('@claim:scope-limits MIDI fixture saves timing output without note names or technique feedback', async ({ page }) => {
  await page.addInitScript(() => {
    const input: { onmidimessage: ((event: { data: Uint8Array }) => void) | null } = { onmidimessage: null };
    Object.defineProperty(window, '__steadyMidiScopeInput', { value: input });
    Object.defineProperty(navigator, 'requestMIDIAccess', { value: async () => ({ inputs: new Map([['scope-fixture', input]]) }) });
  });
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('MIDI scope fixture');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await page.getByRole('button', { name: 'Midi', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Midi', exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (let take = 0; take < 6; take += 1) {
    await page.getByRole('button', { name: 'Start take' }).click();
    for (const pitch of [101, 103, 107, 109]) {
      await page.evaluate((note) => {
        const input = (window as unknown as { __steadyMidiScopeInput: { onmidimessage: ((event: { data: Uint8Array }) => void) | null } }).__steadyMidiScopeInput;
        input.onmidimessage?.({ data: new Uint8Array([0x90, note, 100]) });
      }, pitch);
      await page.waitForTimeout(8);
    }
  }
  await page.getByRole('button', { name: 'Save this session' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const exported = Buffer.concat(chunks).toString();
  expect(exported.split('\n')[0]).toBe('"session_id","passage","date","bpm","input","take","controlled","deviation_ms","onsets_ms"');
  expect(exported).toContain('"midi"');
  expect(exported).not.toMatch(/note|pitch|technique/i);
  await expect(page.getByText('MIDI note names')).toHaveCount(0);
  await expect(page.getByText('technique feedback')).toHaveCount(0);
});

test('@claim:reference-pulse pulse follows 120 BPM, mutes, and stops', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Pulse check');
  await page.getByLabel('Tempo').fill('120');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await page.getByRole('button', { name: 'Start reference pulse' }).click();
  await expect(page.locator('#reference-status')).toContainText('120 BPM');
  const startedAt = Date.now();
  await page.waitForFunction(() => Number(document.querySelector('#reference-status')?.getAttribute('data-pulse-count')) >= 3, undefined, { polling: 50 });
  expect(Date.now() - startedAt).toBeGreaterThanOrEqual(850);
  expect(Date.now() - startedAt).toBeLessThan(1_350);
  await page.getByRole('button', { name: 'Mute pulse sound' }).click();
  await expect(page.locator('#reference-status')).toContainText('sound off');
  await page.getByRole('button', { name: 'Stop reference pulse' }).click();
  const stoppedCount = await page.locator('#reference-status').getAttribute('data-pulse-count');
  await page.waitForTimeout(650);
  expect(await page.locator('#reference-status').getAttribute('data-pulse-count')).toBe(stoppedCount);
});

test('@claim:payment-host checkout is linked through Sociobot and hosted by Dodo', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('iframe').count()).toBe(0);
  const buy = page.getByRole('link', { name: 'Buy the full version' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/music-practice-stability/checkout');
  await page.getByRole('button', { name: 'Activate full version' }).click();
  await expect(page.getByText('Dodo hosts checkout and handles payment through Sociobot.')).toBeVisible();
  const response = await fetch(await buy.getAttribute('href') as string, { redirect: 'manual' });
  expect(response.status).toBe(303);
  expect(response.headers.get('location')).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
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

test('@claim:site-storage-clear clearing browser site storage removes practice history', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Disposable history');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('heading', { name: 'Disposable history', level: 2 })).toBeVisible();
  await page.goto('/privacy');
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('steady-take');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('The practice database remained open while clearing site storage.'));
    });
  });
  await page.goto('/practice');
  await expect(page.getByRole('heading', { name: 'Set your first passage' })).toBeVisible();
  await expect(page.getByText('Disposable history')).toHaveCount(0);
});

test('@claim:free-passage-limit free mode keeps one passage', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('C scale turn');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('button', { name: 'Add passage with full version' })).toBeVisible();
  await page.getByRole('button', { name: 'Add passage with full version' }).click();
  await expect(page.getByText('The free version saves one passage. Buy the full version to add another.')).toBeVisible();
});

test('@claim:paid-passages valid license has no product passage cap', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/music-practice-stability/verify?license=valid-test', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByRole('link', { name: 'Steady Take home' }).click();
  await page.getByRole('button', { name: 'Activate full version' }).click();
  await page.getByLabel('License token').fill('valid-test');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Full version active on this device.')).toBeVisible();
  await page.getByRole('link', { name: 'Practice' }).click();
  const passageCount = 25;
  for (let index = 1; index <= passageCount; index += 1) {
    const name = `Licensed passage ${index}`;
    await page.getByLabel('Passage name').fill(name);
    await page.getByRole('button', { name: 'Set this passage' }).click();
    await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible();
    if (index < passageCount) await page.getByRole('button', { name: 'Add passage', exact: true }).click();
  }
  await expect(page.locator('.passage-picker>div button')).toHaveCount(passageCount);
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

test('@claim:demo-isolation sample changes stay separate and are discarded when starting for real', async ({ page }) => {
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Real practice scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'G major crossing', level: 2 })).toBeVisible();
  await expect(page.getByText('Real practice scale')).toHaveCount(0);
  await page.getByRole('button', { name: 'Add a sample session' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(7);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Real practice scale', level: 2 })).toBeVisible();
  await expect(page.getByText('Sample session added with 22 ms timing spread.')).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('demo:steady-take'))).toBeNull();
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page.locator('table tbody tr')).toHaveCount(6);
  await expect(page.getByText('Real practice scale')).toHaveCount(0);
});

test('@claim:storage-fallback data survives reload in localStorage when IndexedDB fails', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', {
      configurable: true,
      get: () => { throw new DOMException('IndexedDB disabled by fixture', 'NotSupportedError'); },
    });
  });
  await page.goto('/practice');
  await page.getByLabel('Passage name').fill('Fallback scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  await expect(page.getByRole('heading', { name: 'Fallback scale', level: 2 })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('steady-take:fallback') ?? '{}').passages?.[0]?.name)).toBe('Fallback scale');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Fallback scale', level: 2 })).toBeVisible();
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

test('@claim:take-correction a captured take can be removed and replaced before saving', async ({ page }) => {
  await page.goto('/demo');
  const captureTake = async () => {
    await page.getByRole('button', { name: /Start take/ }).click();
    for (let attack = 0; attack < 4; attack += 1) await page.keyboard.press('Space');
  };
  await captureTake();
  await page.getByRole('button', { name: 'Remove take 1' }).click();
  await expect(page.getByText('Take removed. Record it again when ready.')).toBeVisible();
  for (let take = 0; take < 6; take += 1) await captureTake();
  await page.getByRole('button', { name: 'Save this session' }).click();
  await expect(page.getByText(/Session saved with \d+ ms timing spread\./)).toBeVisible();
});

test('@claim:license-on-demand verify traffic starts only after a user enters a token', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.route('https://api.sociobot.in/api/v1/products/music-practice-stability/verify?license=on-demand', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  await page.goto('/privacy');
  expect(external).toEqual([]);
  await page.getByRole('link', { name: 'Steady Take home' }).click();
  await page.getByRole('button', { name: 'Activate full version' }).click();
  await page.getByLabel('License token').fill('on-demand');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Full version active on this device.')).toBeVisible();
  expect(external).toEqual(['https://api.sociobot.in/api/v1/products/music-practice-stability/verify?license=on-demand']);
});

test('@claim:revoked-license a cached full license is locked after a revoked verdict', async ({ page }) => {
  let revoked = false;
  await page.route('https://api.sociobot.in/api/v1/products/music-practice-stability/verify?license=revocable', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(revoked ? { valid: false, reason: 'revoked' } : { valid: true, reason: 'ok' }) }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Activate full version' }).click();
  await page.getByLabel('License token').fill('revocable');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await page.getByRole('link', { name: 'Practice' }).click();
  await page.getByLabel('Passage name').fill('Revocation scale');
  await page.getByRole('button', { name: 'Set this passage' }).click();
  revoked = true;
  await page.evaluate(() => localStorage.setItem('sb_license_verdict:music-practice-stability', JSON.stringify({ valid: true, checkedAt: Date.now() - 172_800_000 })));
  await page.reload();
  await expect(page.getByRole('alert')).toHaveText('This license is no longer active. Buy the full version to restore full access.');
  await expect(page.getByRole('button', { name: 'Add passage with full version' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:music-practice-stability'))).toBeNull();
});

test('@claim:offline-license-cache cached full-version access stays active until reconnecting', async ({ page, context }) => {
  await page.goto('/practice');
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
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
