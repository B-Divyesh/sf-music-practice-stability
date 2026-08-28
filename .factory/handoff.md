# Steady Take polish 1 handoff

Date: 2026-08-28 UTC

Work order: `music-practice-stability-polish-1`

Production: <https://music-practice-stability.sociobot.in>

Demo: <https://music-practice-stability.sociobot.in/?demo=1>

## Outcome

PASS. Every finding F-1-1 through F-1-16 in `.factory/review-1.md` is fixed,
tested, deployed, and cold-checked. Git history contains no earlier review or
polish report. The finding-by-finding map is `.factory/polish-1.md`.

## What changed

- The home headline and supporting copy now state the timing-consistency job in
  plain words. All three privacy, offline, and price facts fit at 1440 × 900.
- “Try it with sample data” opens `/?demo=1` in one click. Its persistent banner
  offers reset and exit actions, while sessionStorage remains separate from real
  IndexedDB data. The measured 26 ms / 52% result and small chart fit within the
  first 390 × 844 viewport.
- Practice now has an optional local BPM reference pulse with audible and visual
  beats, mute, and stop controls. It makes no network request.
- Microphone copy now uses “attack.” A deterministic analyser fixture verifies
  that steady background input is ignored and four separated impulses are
  captured.
- IndexedDB failure recovery, payment hosting, and the reference pulse are now
  registered claims with observable tests. All 20 claim IDs have exactly one
  matching test.
- Every route now sets its own title, description, canonical, Open Graph, and
  Twitter metadata. SPA navigation and browser history focus the new h1 and
  announce the route. The static 404 has literal copy, metadata, favicon, and a
  real HTTP 404 response.
- Purchase copy consistently says Dodo hosts checkout and handles payment
  through Sociobot. License activation links directly to the purchase terms.
- The measured-generative-geometry identity, original art, local-first PWA,
  static deployment class, export/import controls, and paid-unlock flow remain.

## Exact verification evidence

Clean clone `/tmp/steady-take-clean-5E3YN6` at
`b000074fcc2be704d522116c7bf310cd070c62b6`:

- Each of the 20 commands in `.factory/claims.json` ran separately and passed in
  desktop Chromium and the 390 px mobile project: 40/40 claim executions.
- `npm test`: 73 passed; one intentional mobile duplicate of the static config
  assertion skipped.
- `npm run build`: passed; `dist/index.html` produced. Initial app JS is 12.54
  kB gzip and CSS is 5.97 kB gzip.

Local evidence:

- Factory URL checks: `.factory/evidence/polish-1-local/home/verify.json` and
  `.factory/evidence/polish-1-local/demo/verify.json`; zero console errors, one
  h1, `lang=en`, main landmark, complete image alt text, and labeled buttons.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.7 s, CLS 0, TBT 0 ms.

Production evidence after deployment `7c2371fd-b3a6-4079-bff0-adfacfa10e31`:

- Factory URL checks on cold home and demo contexts: zero console/page errors;
  reports and screenshots are under `.factory/evidence/polish-1-live/home/`
  and `.factory/evidence/polish-1-live/demo/`.
- `.factory/evidence/polish-1-live/live-qa.json`: home facts above the fold;
  query demo banner/result/chart/reset; reference pulse; unique route metadata;
  forward/back focus; zero serious/critical Axe findings; offline demo reload;
  Dodo checkout redirect; and styled unknown route with HTTP 404.
- `.factory/evidence/polish-1-live/demo-first-screen.png`: cold 390 × 844 demo
  first viewport.
- `.factory/evidence/polish-1-live/404-mobile.png`: production 404 at 390 px.
- Production mobile Lighthouse: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.5 s, CLS 0, TBT 0 ms. JSON is
  `.factory/evidence/polish-1-live/lighthouse-mobile.json`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Every claim command is listed in `.factory/claims.json`. Deploy `dist/` with:

```sh
/opt/fleet/lib/deploy-static.sh music-practice-stability dist
```

## Known gaps and next steps

None for the reviewed scope. No AI feature was added because timing capture,
local reference audio, import/export, and offline use solve the brief without a
model or external data transfer.
