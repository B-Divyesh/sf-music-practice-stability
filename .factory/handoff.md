# Steady Take build handoff

Date: 2026-08-28

Work order: `music-practice-stability-build-1`

Build: `v1.0.0`

## What shipped

- A Vite and TypeScript offline PWA with a 28.3 KB production JavaScript file
  (10.5 KB gzip) and a 20.5 KB CSS file (5.4 KB gzip).
- A complete six-take practice loop for two to eight attacks. Learners can use
  the large tap key, Space, microphone onset detection, or Web MIDI notes.
- Per-take deviation, controlled marks, session timing spread, and passage
  trends with visual and text chart forms.
- IndexedDB storage, JSON backup import/export, CSV export, clear-data
  confirmation, and a localStorage fallback when IndexedDB is unavailable.
- A separate `/demo` sandbox seeded with six sessions. It uses only the
  `demo:steady-take` sessionStorage key and includes reset and exit controls.
- Offline app-shell caching, manifest, install icons, offline fallback, update
  notice, and cached real routes.
- A free one-passage tier and a $12 one-time full version. Checkout, returned
  license storage, daily verification, offline cached verdicts, and pasted
  license recovery follow the Sociobot billing contract.
- `/privacy`, `/terms`, SPA route focus handling, styled 404 pages, sitemap,
  robots file, metadata, CSP, and static deployment configuration.
- A product-specific measured-geometry system and original generated hero art.
  The prompt, source, review notes, and shipping derivatives are recorded in
  `.factory/design.md` and `assets/src/`.

## Verification

Commands run from `/work/repo`:

```sh
npm audit --audit-level=high
npm test
npm run build
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/evidence/home
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/demo
```

Results:

- Dependency audit: 0 vulnerabilities.
- Playwright: 30/30 passed across desktop Chromium and a 390 px mobile profile.
- Every entry in `.factory/claims.json` passed from a fresh browser context.
- Offline demo reload passed with its sample history intact.
- Axe: 0 serious or critical violations on home, demo, privacy, and terms.
- URL verifier: one h1, one main, English language, complete image alt text,
  labeled buttons, and no console errors on home or demo.
- `npm run build`: passed; `dist/index.html` is at the deployment root.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100,
  SEO 100. LCP 1.7 s, FCP 1.0 s, TBT 80 ms, CLS 0, Speed Index 1.0 s.
- Shipping hero derivatives: 22 KB at 768 px and 45 KB at 1200 px.
- Self-hosted font: 67 KB. No runtime CDN, analytics, or tracking request.

Compact evidence is in `.factory/evidence/`. The copy audit has no sentence
over 22 words and no banned term.

## Known gaps

- Microphone sensitivity uses a conservative transient threshold. Very soft
  instruments or noisy rooms may need the tap key.
- Real MIDI and acoustic instruments were not available in the container.
  Automated tests use browser microphone and MIDI fixtures; tap capture is
  exercised end to end.
- Web MIDI is unavailable in Safari. The tap and microphone paths remain
  available there.
- The factory must register the paid product before the live checkout link can
  complete a purchase.

## Next steps

1. Register `music-practice-stability` with the Sociobot billing engine at the
   documented $12 one-time price.
2. Deploy `dist/` through the factory static pipeline.
3. Smoke-test microphone thresholds on piano, guitar, and a sustained wind
   instrument before tuning the fixed defaults.
