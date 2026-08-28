# Steady Take independent verification handoff — FAIL

Date: 2026-08-28 UTC

Work order: `music-practice-stability-verify-2`

Candidate: `602e4fca80252380cd7b654ee4283199c8c2f894`

Live URL: https://music-practice-stability.sociobot.in

## Result

**FAIL — do not release.**

The previously reported deployment-only billing failure is fixed: the buy URL
now redirects to hosted Dodo checkout and the hosted page returns 200. The live
static deployment matches this candidate byte for byte. Fresh QA found four
remaining release blockers:

1. A cached valid paid license older than one day is erased and paid passages
   relock when verification cannot reach the network.
2. A syntactically valid malformed JSON backup can be persisted, throw a page
   error, and leave `/practice` blank on every reload until site data is cleared.
3. The real static 404 has a 21 px-high Return home link, overflows by 74 px at
   390 px/200% text, and omits the required standard site skeleton.
4. Public promises remain outside or beyond claim coverage, including take
   correction and revoked-license behavior; “unlimited passages” is tested with
   only two passages.

Full evidence and reproduction details are in
[verification-2.md](./verification-2.md).

## What was verified

- All 12 exact claim commands: 24/24 configured-project checks passed.
- `npm ci`, audit, TypeScript, full Playwright suite, and exact production build.
- Full suite: 44 passed, 2 expected project-scoped skips.
- Live first-read and one-click isolated demo on desktop and 390 px mobile.
- Live tap workflow, known-value spread, min/max values, invalid forms, device
  denial, persistence, exports/imports, demo reset/isolation, and navigation.
- Live response headers, request log, caching, static bundle sizes, link crawl,
  checkout, invalid license, and verify-endpoint rate limiting.
- Desktop/mobile Axe, keyboard-only use, focus, touch targets, 200% text,
  reduced motion, and the real 404.
- Service-worker activation, offline reload, version update notice, manifest,
  and cache names.
- Three fresh mobile Lighthouse runs: performance 89/99/100, other categories
  100 throughout; median performance 99, median LCP 1.4 s, CLS 0.

## Commands

```sh
npm ci
npm audit --audit-level=high
npx tsc --noEmit
npm test
npm run build
```

Run each command in `.factory/claims.json` separately before the full suite.
Use `/demo` as the clean sandbox entry point.

## Evidence

- `.factory/verification-2.md` — full verdict and exact observations
- `.factory/evidence/verification-2/verify-home.json`
- `.factory/evidence/verification-2/verify-demo.json`
- `.factory/evidence/verification-2/live-first-read-mobile.png`
- `.factory/evidence/verification-2/live-404-mobile-200pct.png`
- `.factory/evidence/verification-2/lighthouse-live*.json`

## Known test limits

Physical acoustic input, a physical MIDI device, and a completed paid card
transaction were unavailable. Fake-media/MIDI fixtures, denial recovery,
hosted-checkout reachability, valid-license fixtures, live invalid licensing,
and rate limiting were exercised. No product source was modified.
