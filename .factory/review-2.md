# Adversarial first-read review 2 — Steady Take

Date: 2026-08-28 UTC

Work order: `music-practice-stability-review-2`

Candidate: `c1a5646f30971deb7383df5bb24dc4136caab17f`

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**FAIL**

There are four findings: three major and one minor. There are no blocking demo,
routing, history-regression, or registered-claim-test failures. A PASS requires
zero findings. The four remaining findings are unlisted claims: the copy asks a
visitor to rely on product, privacy, or refund behaviour without a matching
entry in `.factory/claims.json` and observable sandbox test.

## First read before scrolling

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900. No storage,
cookies, or service-worker state was reused.

- What it does: it measures how consistently a musician repeats the timing of a
  short passage.
- For whom: beginning instrumentalists.
- What to click first: **Try it with sample data**.

The first screen answers all three at both sizes with “Measure timing
consistency across takes,” “For beginning instrumentalists who want consistent
timing across a short passage,” and “Try it with sample data.” The three facts
are visible within the 1440 × 900 first viewport. This is not a blocking
first-read failure.

## Findings

### Major

#### F-2-1 — Scope and assessment-limit claims have no registered test

- Location/quote: landing, “Steady Take does not identify notes, assess
  technique, or replace a teacher.” README, “Steady Take measures timing only;
  it does not identify notes or assess technique.” Terms, “It is a practice
  aid, not a professional assessment.”
- Evidence: none of the 20 entries in `.factory/claims.json` covers the stated
  output boundary. `tap-capture` verifies a measured spread; it does not verify
  that MIDI pitch is discarded or that the interface only produces timing
  output.
- Why this fails: these are useful honesty statements, but a visitor relies on
  them to understand what the tool will and will not analyse. They remain
  unlisted claims under the claim contract.
- Concrete fix: replace all three with one precise, testable statement: “Steady
  Take reports attack timing and timing spread; it does not show MIDI note names
  or technique feedback.” Add a `scope-limits` claim that completes a fixture
  MIDI take and asserts the saved view and CSV contain timing fields only, with
  no pitch or technique output. Remove “replace a teacher” unless a separately
  testable meaning is defined.

#### F-2-2 — The privacy page makes an unlisted update-network claim

- Location/quote: Privacy → Network requests, “The installed app checks this
  site for updates.”
- Evidence: `.factory/claims.json` has `local-only`, which asserts the demo
  makes only same-origin requests, but it neither names nor proves this update
  behaviour. `offline-reload` proves cached reload, not an update check.
- Why this fails: this is a privacy disclosure about when the app contacts the
  network. A local-first visitor can reasonably rely on it when deciding what
  leaves the device.
- Concrete fix: add an `update-check` entry and test a fresh installed PWA
  context, recording the service-worker/update request and asserting it is
  same-origin. If that behaviour is not intended as a supported disclosure,
  delete the sentence.

#### F-2-3 — The stated refund handler is an unlisted, unproved purchase claim

- Location/quote: Terms → One-time purchase, “Dodo handles refunds through
  Sociobot.”
- Evidence: `payment-host` proves checkout starts at Sociobot and redirects to
  Dodo. `revoked-license` proves a fixture revocation removes full access.
  Neither test proves who handles a refund or how a customer obtains one.
- Why this fails: refund handling is a material purchase decision. The existing
  checkout-host proof cannot establish this additional policy statement.
- Concrete fix: add a tested, public refund path that identifies the contact and
  handler, or remove this sentence until the payment contract gives a verifiable
  wording. Keep the already tested sentence “Dodo hosts checkout and handles
  payment through Sociobot.”

### Minor

#### F-2-4 — Clearing browser storage is claimed to delete history without a claim test

- Location/quote: Privacy → Delete or export, “Clearing site storage also
  removes it.”
- Evidence: `data-backup` proves the in-app **Clear all data** action. It does
  not clear IndexedDB and localStorage at the browser level, reload, and assert
  the history is absent. No `claims.json` entry covers the sentence.
- Why this fails: the sentence is actionable deletion guidance. It should be
  proved before a visitor relies on browser storage clearing as a privacy step.
- Concrete fix: add a `site-storage-clear` claim that creates real data, clears
  the origin's IndexedDB and localStorage in a clean browser context, reloads
  `/practice`, and asserts “Set your first passage.” Alternatively remove the
  sentence and retain the tested in-app clearing instruction.

## Copy audit

Counts use whitespace-separated words as displayed; link labels count as their
visible words. No landing or README sentence exceeds 22 words. No banned
marketing adjective appears. “Passage,” “attack,” “take,” “session,” “timing
spread,” and “reference pulse” are used consistently. Landing headings name
their sections, and visible buttons name their result. There are no separate
plain-words findings.

### Landing page sentences

| Sentence | Words |
| --- | ---: |
| For beginning instrumentalists who want consistent timing across a short passage. | 11 |
| See six sessions and a 52% drop in timing spread. | 10 |
| Audio stays on this device. | 5 |
| Works offline after the first visit. | 6 |
| Free for one saved passage. | 5 |
| Geometric timing rows become more evenly spaced beside a mechanical metronome. *(image alt)* | 11 |
| Later timing rows show the attacks landing closer together. | 9 |
| Steady Take compares the gaps between your attacks. | 8 |
| Smaller spread means your repetitions align more closely. | 8 |
| 26 milliseconds timing spread, 52% lower than the first session. | 10 |
| Set the passage. | 3 |
| Name it, choose the tempo, and set its attack count. | 10 |
| Play six takes. | 3 |
| Use your microphone, a MIDI note, or the large tap key. | 11 |
| Compare the spread. | 3 |
| Mark controlled takes and watch the same passage over time. | 10 |
| Microphone mode looks for separate attacks above the recent sound level. | 11 |
| Use tap input if it adds unwanted marks. | 8 |
| Steady Take does not identify notes, assess technique, or replace a teacher. | 12 |
| You can correct any take before saving. | 7 |
| No recording is kept. | 4 |
| Only attack times and your passage history are stored on this device. | 12 |
| Practice one passage free. | 4 |
| The full version saves unlimited practice passages on this device. | 10 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Read the Steady Take purchase terms. | 6 |
| Measure timing stability across repeated takes. | 6 |

Checked labels/headings: “Timing practice for beginners,” “Measure timing
consistency across takes,” “Try it with sample data,” “Sample timing result,”
“Compare timing spread,” “How it works,” “Repeat one short passage,” “What
Steady Take measures,” “Full version,” “Keep every passage,” “Buy the full
version,” and “Activate full version.” They are useful, contextual labels or
result-naming actions.

### README sentences

| Sentence | Words |
| --- | ---: |
| Steady Take measures timing stability across repeated practice takes. | 9 |
| It is for beginning instrumentalists working on short technical passages. | 10 |
| Set a passage, start its optional reference pulse, then play six takes. | 12 |
| Use microphone, MIDI, or tap input. | 6 |
| The app compares matched attacks and shows timing spread in milliseconds. | 11 |
| You can mark controlled takes and compare saved sessions over time. | 11 |
| Audio and practice history stay on the device. | 8 |
| Audio is analysed in memory and is not recorded. | 9 |
| The app works offline after the first connected visit. | 9 |
| Try the sample demo. | 4 |
| It does not use your practice history. | 7 |
| It includes six sessions for a G major crossing, with the measured result visible before the capture controls. | 18 |
| Requirements: Node.js 20 or later. | 5 |
| Open http://127.0.0.1:5173. | 2 |
| Playwright 1.58.2 is pinned. | 4 |
| Chromium must be available at PLAYWRIGHT_BROWSERS_PATH, or install it with npx playwright install chromium. | 14 |
| The exact deployment command is npm run build. | 8 |
| The static output is dist/, with dist/index.html at its root. | 10 |
| Claim tests can run alone. | 5 |
| For example: | 2 |
| Real data uses IndexedDB database steady-take. | 6 |
| A localStorage fallback is used only when IndexedDB is unavailable. | 10 |
| Export CSV for analysis or JSON for a full backup. | 10 |
| The demo uses the separate demo:steady-take sessionStorage key. | 8 |
| Microphone mode looks for separate attacks above the recent sound level. | 10 |
| Use tap input if it adds unwanted marks. | 8 |
| Steady Take measures timing only; it does not identify notes or assess technique. | 13 |
| The free version saves one passage. | 6 |
| A $12 one-time purchase saves unlimited practice passages on this device. | 11 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Deploy dist/ as a static site. | 6 |
| staticwebapp.config.json supplies the SPA fallback, 404 behavior, MIME mapping, and security headers. | 12 |
| The factory owns infrastructure, DNS, billing registration, and release configuration. | 10 |
| MIT licensed. | 2 |
| See LICENSE. | 2 |

## Demo and sandbox verification

- One click from the landing page opened the supported `/?demo=1` URL.
- In a fresh 390 × 844 context, the first post-click screen showed the persistent
  “Demo — sample data, nothing is saved” banner, reset and exit actions, a
  realistic G major crossing, “Latest spread: 26 ms,” the 54-to-26 ms chart,
  and the 52% result. The result box ended at y=719 px.
- The sample began with six saved sessions. “Add a sample session” made seven;
  **Reset demo** returned it to six.
- The fresh demo used only `sessionStorage["demo:steady-take"]`; localStorage
  was empty. Code review confirms demo reads and writes that key only, while
  real data uses IndexedDB or the separate fallback key.
- After service-worker control, offline reload retained G major crossing and the
  seeded result. The full live demo request log contained only
  `music-practice-stability.sociobot.in` requests.
- A live `/practice` check created a 120 BPM passage, observed three reference
  pulses, muted it, stopped it, and confirmed the counter did not increase.
  That flow made only same-origin requests.

## Claim verification

A fresh no-local clone was created at `/tmp/steady-take-review2-JyE2CK`, then
`npm ci` was run. Every command from `.factory/claims.json` was run separately;
each command passed in Chromium and the 390 px mobile project (40 passing claim
executions total).

| Claim ID | Result |
| --- | --- |
| `sample-improvement` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `tap-capture` | PASS |
| `input-options` | PASS |
| `microphone-detection` | PASS |
| `reference-pulse` | PASS |
| `csv-export` | PASS |
| `data-backup` | PASS |
| `free-passage-limit` | PASS |
| `paid-passages` | PASS |
| `full-version-price` | PASS |
| `payment-host` | PASS |
| `controlled-takes` | PASS |
| `demo-isolation` | PASS |
| `storage-fallback` | PASS |
| `audio-not-recorded` | PASS |
| `take-correction` | PASS |
| `license-on-demand` | PASS |
| `revoked-license` | PASS |

The same clean clone passed `npm test` (74 tests) and `npm run build`; the build
produced `dist/` with `dist/index.html`. No registered claim failed or was
skipped.

## History check

The earlier review, polish report, and handoff were read in full. No other
`review-*` or `polish-*` report exists. Each earlier finding was confirmed on
the live site and against the current code.

| Earlier finding | Status in this review | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Seeded 26 ms result and chart are within the first mobile demo viewport. |
| F-1-2 | Fixed | Attack wording is live; `microphone-detection` passes. |
| F-1-3 | Fixed | `storage-fallback` passes. |
| F-1-4 | Fixed | Payment wording is consistent; `payment-host` passes. |
| F-1-5 | Fixed | Live BPM pulse starts, mutes, and stops; `reference-pulse` passes. |
| F-1-6 | Fixed | All three facts are within the 1440 × 900 viewport. |
| F-1-7 | Fixed | Route-specific metadata and static 404 metadata are live. |
| F-1-8 | Fixed | Home h1 states the timing-consistency job. |
| F-1-9 | Fixed | Eyebrow says “Timing practice for beginners.” |
| F-1-10 | Fixed | Limits heading names what the tool measures. |
| F-1-11 | Fixed | Art caption states what later rows show. |
| F-1-12 | Fixed | Learner-facing copy uses “attack,” not “onset.” |
| F-1-13 | Fixed | The action is “Activate full version.” |
| F-1-14 | Fixed | Purchase terms are named and linked. |
| F-1-15 | Fixed | README has a deployed sample-demo link and isolation wording. |
| F-1-16 | Fixed | Both unknown-route and static 404 h1s say “Page not found.” |

## Structure, routes, and links

- `/`, `/practice`, `/demo`, `/?demo=1`, `/privacy`, `/terms`, and an unknown
  route were loaded live. Each had one h1, a route-specific title, description,
  canonical URL, Open Graph title/description, favicon, consistent header, and
  footer with Privacy and Terms.
- SPA navigation and browser Back focused the new h1 and updated the polite
  route announcement. The unknown route returned HTTP 404 and rendered the
  designed static page.
- The sitemap lists every application route. `robots.txt`, manifest, favicon,
  and social card returned 200. All crawled in-site links and the factory link
  returned 200; the purchase endpoint redirected to the Dodo checkout, which
  returned 200. The `mailto:` link is explicit.
- No console or page errors occurred on normal live routes. The expected
  unknown-route navigation produced an HTTP-404 resource message only.
- The cream paper, ink rules, coral timing points, generated geometric timing
  art, uneven sheet layout, and square metronome controls are product-specific;
  this is not a generic SaaS-card surface. The supplied art provenance matches
  `.factory/design.md`.

## Missed leverage

No missing AI feature is found. The brief is a local timing-capture tool; an AI
step would not improve the core measurement and would weaken the local-first
privacy model. The expected practical complements already exist: microphone,
MIDI, and tap input; an optional local reference pulse; CSV export; JSON backup
and import; and offline use.

## What would make this perfect

Register and prove the four remaining statements above, or remove the
unprovable wording. After that, rerun every claim command from a fresh clone and
repeat the live request-log checks. No further product expansion is needed for
this brief.
