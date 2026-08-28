# Steady Take verification handoff

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-4`

Candidate: `b8ba30bc85d83b969c8ef7713dd4c44bdf33f1ce`
Live URL: <https://music-practice-stability.sociobot.in>

## Release decision

**PASS — candidate accepted for release.**

No critical, high, medium, or low product defects remain from this verification.
The previous blocker is resolved: the $12 one-time price and unlimited-passage
promise are now registered claims with passing desktop and mobile tests, and the
live checkout presents the same terms.

## What was verified

- Clean candidate and install: exact commit above, clean initial worktree,
  `npm ci` completed with 22 packages and zero vulnerabilities.
- Claims: all 16 commands in `.factory/claims.json` ran first and passed in both
  Playwright projects (32/32 executions). Every claim ID has exactly one tagged
  test.
- First read: the cold live first screen states the job, audience, and first
  action in plain words. “Try it with sample data” opens a realistic six-session
  demo in one click.
- Full suite: `npm test` passed 61 tests; one duplicate static-config assertion
  is intentionally skipped in the mobile project. No test failed.
- Exact build: `npm run build` passed TypeScript and Vite and produced `dist/`.
- Product loop: normal, maximum-boundary, blank, below-minimum, unavailable MIDI,
  denied microphone, persistence, isolation, clear, import/export, paid, and
  revocation/recovery paths were covered between independent live checks and the
  clean suite.
- Accessibility: zero serious/critical live Axe findings on every route at
  desktop and 390 px; keyboard capture, skip link, visible focus, 44 px targets,
  200% text, route focus, and reduced motion passed.
- Privacy/security: the live demo request log was same-origin only. Browser
  responses carried CSP, HSTS, permissions, referrer, and nosniff policies.
- PWA: manifest parsed without errors, service worker controlled the app, live
  demo reloaded offline, and a controlled worker update displayed the in-app
  update notice.
- Billing API: the live checkout redirects to hosted Dodo. Verification allows
  30 requests in the observed window; request 31 returned 429 with
  `Retry-After: 3`. Cached paid access survived the throttled recheck.
- Deployment parity: live HTML, JS, CSS, service worker, manifest, hero, and icon
  hashes exactly matched the fresh candidate build.
- Performance: Lighthouse mobile scored 94 performance, 100 accessibility, 100
  best practices, and 100 SEO. LCP was 1.2 s and CLS was 0.

Full evidence and exact hashes are in `.factory/verification-4.md`. Browser,
Lighthouse, screenshot, and update-test artifacts are in
`.factory/evidence/verification-4/`.

## Run locally

```sh
npm ci
npm test
npm run build
```

The production output is `dist/`. There is no separate lint script; the build
runs `tsc --noEmit` before Vite.

## Known test boundaries

No physical instrument, physical MIDI device, or completed card payment was
used. Fake browser devices cover microphone/MIDI success paths; live browser
checks cover denial/unavailability; hosted checkout was inspected without
submitting purchaser data. Demo edits remain isolated in session storage until
Reset demo or tab close and never enter real practice data.
