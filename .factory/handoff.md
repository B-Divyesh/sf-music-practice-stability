# Steady Take review 3 handoff

Date: 2026-08-28 UTC

Work order: music-practice-stability-review-3

Candidate reviewed: 9bfb696e9c1058f1308f013072341c82cf33b07a

## Outcome

**FAIL — four findings remain: one blocking and three major.** The complete
report is .factory/review-3.md. No product code was changed.

The blocking finding is that demo changes survive **Start for real** and return
on the next demo visit. The major findings are a premature “Ready offline”
status and two reachable but unregistered claim groups covering device-access
timing and cached paid access while offline.

## Verification performed

- Cold live first read at 390 × 844 and 1440 × 900.
- One-click demo, seeded first viewport, reset, real/demo isolation, exit and
  re-entry, same-origin request log, and live offline reload.
- Direct loads, real 404, metadata, h1/main counts, links, hosted checkout,
  SPA Back/focus, live Axe, 44 px targets, and factory URL verification.
- Every one of the 23 exact claim commands from .factory/claims.json ran
  separately in a no-local clean clone; all 46 desktop/mobile executions passed.
- Full clean-clone npm test: 79 passed, one intentional duplicate-config check
  skipped.
- Clean-clone npm run build: passed; dist/ produced; application JavaScript
  12.51 kB gzip.
- All 20 findings from reviews 1 and 2 were independently confirmed fixed under
  their original IDs.

## Reproduce

~~~sh
npm ci
npm test
npm run build
~~~

Live issue checks:

1. Open /demo, add a sample session, select **Start for real**, then return to
   /demo; seven rows return because demo:steady-take was not discarded.
2. Open /practice in a fresh context with service workers blocked; “Ready
   offline” appears with no controller or registration.
3. Compare the privacy/practice permission wording and cached-license offline
   message with .factory/claims.json; neither promise has a claim entry.

## Next steps

Resolve F-3-1 through F-3-4 exactly as specified in the review, add the missing
claim coverage, and repeat the complete review. There are no other known gaps.
