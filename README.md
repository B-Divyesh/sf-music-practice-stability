# Steady Take

Steady Take measures timing stability across repeated practice takes. It is for
beginning instrumentalists working on short technical passages.

Set a passage, then play six takes with microphone, MIDI, or tap input. The app
compares matched attacks and shows timing spread in milliseconds. You can mark
the takes that felt controlled and compare saved sessions over time.

Audio and practice history stay on the device. Audio is analysed in memory and
is not recorded. The app works offline after the first connected visit.

Try the isolated sample at `/demo`. It includes six sessions for a G major
crossing and never reads or writes real practice data.

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

Microphone onset detection needs clean, separate attacks. Room noise can add
false marks. Steady Take measures timing only; it does not identify notes or
assess technique.

## Full version

The free version saves one passage. A $12 one-time purchase adds unlimited
saved passages. Checkout and license verification use the
Sociobot billing API. No payment provider is embedded in this app.

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
