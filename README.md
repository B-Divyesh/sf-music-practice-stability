# Steady Take

Steady Take measures timing stability across repeated practice takes. It is for
beginning instrumentalists working on short technical passages.

Set a passage, start its optional reference pulse, then play six takes. Use
microphone, MIDI, or tap input. The app compares matched attacks and shows
timing spread in milliseconds. You can mark controlled takes and compare saved
sessions over time.

Audio and practice history stay on the device. Audio is analysed in memory and
is not recorded. The app works offline after the first connected visit.

Try the [sample demo](https://music-practice-stability.sociobot.in/?demo=1).
It does not use your practice history. It includes six sessions for a G major
crossing, with the measured result visible before the capture controls.

## Run locally

Requirements: Node.js 20 or later.

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Test and build

Playwright 1.58.2 is pinned. Chromium must be available at
`$PLAYWRIGHT_BROWSERS_PATH`, or install it with `npx playwright install chromium`.

```sh
npm test
npm run build
```

The exact deployment command is `npm run build`. The static output is `dist/`,
with `dist/index.html` at its root.

Claim tests can run alone. For example:

```sh
npm test -- --grep @claim:offline-reload
```

## Data and limits

Real data uses IndexedDB database `steady-take`. A localStorage fallback is used
only when IndexedDB is unavailable. Export CSV for analysis or JSON for a full
backup. The demo uses the separate `demo:steady-take` sessionStorage key.

Microphone mode looks for separate attacks above the recent sound level. Use
tap input if it adds unwanted marks. Steady Take reports attack timing and
timing spread. It does not show MIDI note names or technique feedback.

## Full version

The free version saves one passage. A $12 one-time purchase saves unlimited
practice passages on this device. Dodo hosts checkout and handles payment
through Sociobot.

## Deploy

Deploy `dist/` as a static site. `staticwebapp.config.json` supplies the SPA
fallback, 404 behavior, MIME mapping, and security headers. The factory owns
infrastructure, DNS, billing registration, and release configuration.

## Project records

- `.factory/design.md` — visual system and generated-art provenance
- `.factory/demo.md` — sample data and storage isolation
- `.factory/claims.json` — product claims and verification commands
- `.factory/copy-audit.md` — landing sentence audit
- `.factory/handoff.md` — verification results and known gaps

MIT licensed. See `LICENSE`.
