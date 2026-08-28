# Adversarial first-read review 3 — Steady Take

Date: 2026-08-28 UTC

Work order: music-practice-stability-review-3

Candidate: 9bfb696e9c1058f1308f013072341c82cf33b07a

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**FAIL**

There are four findings: one blocking and three major. All 23 registered claim
commands pass in both browser projects, but the demo does not discard changes
when the visitor leaves it, one offline status is false before the service
worker is ready, and two reachable promises are absent from claims.json. A PASS
requires zero findings and no untested claim.

## First read before scrolling

Fresh Chromium contexts with no reused storage, cookies, or service worker were
opened at 390 × 844 and 1440 × 900.

- What it does: measures timing consistency across repeated practice takes.
- For whom: beginning instrumentalists practising a short passage.
- What to click first: **Try it with sample data**.

The first screen answers all three at both widths with “Measure timing
consistency across takes,” “For beginning instrumentalists who want consistent
timing across a short passage,” and “Try it with sample data.” The adjacent
sentence states that the sample shows six sessions and a 52% drop. The three
privacy/offline/price facts end at y=645 px on mobile and y=822 px on desktop.
This gate passes.

## Findings

### Blocking

#### F-3-1 — Leaving demo mode does not discard demo changes

- Exact location/quote: persistent demo banner, **“Start for real”**; demo
  storage key sessionStorage["demo:steady-take"].
- Evidence: a fresh /demo began with six rows. **Add a sample session** made
  seven. After **Start for real**, the demo key still existed. Returning to
  /demo in the same tab restored seven rows instead of the six-row seed.
  **Reset demo** itself correctly returned seven rows to six, and a separately
  saved real passage remained intact and absent from demo mode.
- Why this fails: the sandbox contract requires leaving demo mode to discard
  demo changes unless the visitor explicitly keeps them. A first-time visitor
  who chooses “Start for real” reasonably expects the sample experiment to end,
  not to reappear on the next demo visit. This leaves the mandatory demo path
  only partly resettable.
- Concrete fix: when navigation changes from demo to a real route, remove
  demo:steady-take before rendering real data. Add a claim test that changes the
  sample, selects **Start for real**, revisits /demo, and asserts the original
  six sessions. Update .factory/demo.md to say that leaving or resetting
  discards sample changes.

### Major

#### F-3-2 — “Ready offline” is shown when offline use is not ready

- Exact location/quote: /practice and /demo, connection pill,
  **“Ready offline”**.
- Evidence: in a fresh browser context with service workers blocked, /practice
  displayed “Ready offline” while navigator.serviceWorker.controller was false
  and getRegistrations() returned zero. The code selects this label only from
  navigator.onLine; it does not check registration, installation, cache
  completion, or control. The registered offline-reload test waits for
  readiness before disconnecting, so it does not cover this stronger status.
- Why this fails: a visitor can disconnect immediately because the interface
  says the app is ready, then lose the page on reload. The core offline status
  is both inaccurate and absent from the claim registry.
- Concrete fix: show “Preparing offline use” until an active service worker
  controls the page, “Ready offline” only after that point, and an honest
  online-only state if registration fails or is unavailable. Extend
  offline-reload to cover the status transition and list the status location in
  its where field.

#### F-3-3 — Microphone and MIDI permission promises are unlisted and overbroad

- Exact locations/quotes: /privacy, **“Your browser asks before sharing
  microphone or MIDI access. You can remove access in your browser settings.”**
  Practice microphone help, **“You will approve microphone access before
  recording.”**
- Evidence: input-options proves that fixture microphone and MIDI inputs can
  capture a take. It does not assert that neither API is called before an
  explicit start action, and it does not cover permission removal. The practice
  sentence is also unconditional even when permission was previously granted
  and no new prompt appears.
- Why this fails: these are privacy promises about when device access occurs.
  A visitor cannot distinguish tested product behaviour from browser-dependent
  prompt behaviour.
- Concrete fix: use one precise sentence: “Steady Take requests microphone or
  MIDI access only when you start that input.” Add a permission-on-demand claim
  that spies on both browser APIs, asserts zero calls before **Start take**, and
  one call after it. Remove the unconditional approval sentence and
  browser-settings promise unless separately supported.

#### F-3-4 — Offline paid-access continuity is tested but not registered

- Exact location/quote: expired-license offline error state,
  **“Could not check the license. Saved full-version access stays active until
  you reconnect.”**
- Evidence: an untagged quality test currently proves this state, but no entry
  in .factory/claims.json names the promise. license-on-demand covers when a
  verification request begins; revoked-license covers an explicit revoked
  response. Neither covers retaining a cached valid entitlement after a network
  failure.
- Why this fails: a buyer can rely on continued paid access while offline. A
  passing unregistered test is not included when verifiers enumerate the claim
  manifest and does not satisfy the one-claim/one-tag contract.
- Concrete fix: add an offline-license-cache claim with this exact wording and
  retag the existing test @claim:offline-license-cache. Its sandbox should
  activate a fixture license, age the cached valid verdict, go offline, reload,
  and confirm full access remains active.

## Complete landing and README copy audit

Counts use whitespace-separated displayed words; hyphenated terms count as one.
No landing or README sentence exceeds 22 words. No banned marketing adjective,
metaphorical heading, inconsistent product term, or non-result action was found
on these two surfaces. “Timing spread” is defined beside the sample chart.
README terms such as IndexedDB, localStorage, SPA, and MIME occur only in
developer run/deploy documentation and are needed there. Findings F-3-2 through
F-3-4 concern additional live interface/legal copy outside this sentence audit.

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
| Steady Take reports attack timing and timing spread. | 8 |
| It does not show MIDI note names or technique feedback. | 10 |
| You can correct any take before saving. | 7 |
| No recording is kept. | 4 |
| Only attack times and your passage history are stored on this device. | 12 |
| Practice one passage free. | 4 |
| The full version saves unlimited practice passages on this device. | 10 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Read the Steady Take purchase terms. | 6 |
| Measure timing stability across repeated takes. | 6 |

Headings, labels, and actions checked: “Timing practice for beginners” (4),
“Measure timing consistency across takes” (5), “Try it with sample data” (5),
“Sample timing result” (3), “Compare timing spread” (3), “Read the chart as
text” (5), “How it works” (3), “Repeat one short passage” (4), “Clear limits”
(2), “What Steady Take measures” (4), “Full version” (2), “Keep every passage”
(3), “Buy the full version” (4), “Activate full version” (3), and “Verify
license” (2). Each names its section, destination, state, or result.

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
| Steady Take reports attack timing and timing spread. | 8 |
| It does not show MIDI note names or technique feedback. | 10 |
| The free version saves one passage. | 6 |
| A $12 one-time purchase saves unlimited practice passages on this device. | 11 |
| Dodo hosts checkout and handles payment through Sociobot. | 8 |
| Deploy dist/ as a static site. | 6 |
| staticwebapp.config.json supplies the SPA fallback, 404 behavior, MIME mapping, and security headers. | 12 |
| The factory owns infrastructure, DNS, billing registration, and release configuration. | 10 |
| MIT licensed. | 2 |
| See LICENSE. | 2 |

README headings checked: “Steady Take,” “Run locally,” “Test and build,” “Data
and limits,” “Full version,” “Deploy,” and “Project records.” The project-record
bullets are file-label fragments rather than sentences. All headings identify
their content.

## Demo and sandbox verification

- One click from the landing page opened the supported /?demo=1 entry point.
- At 390 × 844, the persistent banner, G major crossing, latest 26 ms result,
  54-to-26 ms chart, six-session statement, and 52% change were visible without
  scrolling; the result ended at y=719 px.
- The sample contains six dated sessions with six takes each, controlled marks,
  72 BPM, and four attacks. It is realistic rather than placeholder data.
- **Add a sample session** changed six rows to seven. **Reset demo** restored
  six rows.
- Demo interaction used sessionStorage["demo:steady-take"]; it created no
  localStorage key. A separately saved IndexedDB passage did not appear in demo
  and reappeared unchanged after **Start for real**.
- The complete demo request log was same-origin. No analytics, CDN, payment,
  model, or other third-party request occurred.
- With the live worker controlling /demo, an offline reload retained the sample
  passage and six rows and changed the status to “Offline now.”
- The exit-reset failure is F-3-1. The inaccurate pre-readiness status is
  F-3-2.

## Claims verification

A no-local clone was created at /tmp/steady-take-review3-DpfChu/repo, followed
by npm ci. Every exact test command in .factory/claims.json was run separately.
Each command executed once in Chromium desktop and once in the 390 px mobile
project.

| Claim ID | Result |
| --- | --- |
| sample-improvement | PASS — 2/2 |
| offline-reload | PASS — 2/2 |
| update-check | PASS — 2/2 |
| local-only | PASS — 2/2 |
| tap-capture | PASS — 2/2 |
| input-options | PASS — 2/2 |
| microphone-detection | PASS — 2/2 |
| scope-limits | PASS — 2/2 |
| reference-pulse | PASS — 2/2 |
| csv-export | PASS — 2/2 |
| data-backup | PASS — 2/2 |
| site-storage-clear | PASS — 2/2 |
| free-passage-limit | PASS — 2/2 |
| paid-passages | PASS — 2/2 |
| full-version-price | PASS — 2/2 |
| payment-host | PASS — 2/2 |
| controlled-takes | PASS — 2/2 |
| demo-isolation | PASS — 2/2 |
| storage-fallback | PASS — 2/2 |
| audio-not-recorded | PASS — 2/2 |
| take-correction | PASS — 2/2 |
| license-on-demand | PASS — 2/2 |
| revoked-license | PASS — 2/2 |

Every registered ID occurs exactly once as an @claim tag. No registered claim
failed or was skipped. The manifest is nevertheless incomplete because F-3-2
through F-3-4 identify reachable claims outside it.

The same clean clone completed npm test with 79 passed and one intentional
duplicate static-config check skipped. npm run build passed and produced dist/;
application JavaScript is 35.17 kB raw and 12.51 kB gzip.

## Earlier-finding verification

Every prior review, polish report, and the prior handoff was read. Each earlier
finding was checked on the live site and against current code or its clean
claim test; none has regressed under its original ID.

| Earlier finding | Status and current evidence |
| --- | --- |
| F-1-1 | Fixed — the demo result and chart end at y=719 px on 390 × 844. |
| F-1-2 | Fixed — learner copy uses “attack”; microphone-detection passes. |
| F-1-3 | Fixed — storage-fallback passes after IndexedDB is disabled. |
| F-1-4 | Fixed — payment wording is consistent and payment-host passes. |
| F-1-5 | Fixed — the optional pulse starts, mutes, stops, and passes its timing test. |
| F-1-6 | Fixed — all desktop facts end by y=822 px in the 900 px viewport. |
| F-1-7 | Fixed — every route and the static 404 have distinct complete metadata. |
| F-1-8 | Fixed — the h1 is “Measure timing consistency across takes.” |
| F-1-9 | Fixed — the eyebrow names “Timing practice for beginners.” |
| F-1-10 | Fixed — the section heading is “What Steady Take measures.” |
| F-1-11 | Fixed — the caption literally describes later attacks landing closer together. |
| F-1-12 | Fixed — learner copy uses “attack”; onsets_ms remains only a CSV field. |
| F-1-13 | Fixed — the action is “Activate full version.” |
| F-1-14 | Fixed — the purchase-terms sentence links to /terms. |
| F-1-15 | Fixed — README links the deployed sample and explains isolation. |
| F-1-16 | Fixed — both 404 implementations use “Page not found.” |
| F-2-1 | Fixed — precise scope wording is registered and scope-limits passes. |
| F-2-2 | Fixed — update traffic is registered and update-check passes. |
| F-2-3 | Fixed — the unprovable refund-handler sentence remains removed. |
| F-2-4 | Fixed — browser storage deletion is registered and site-storage-clear passes. |

The prior handoff's build, route, accessibility, price, passage-limit, and
offline-demo assertions remain confirmed. Its “Known gaps: None” conclusion is
superseded by F-3-1 through F-3-4.

## Structure, accessibility, links, and visual identity

- /, /practice, /demo, /privacy, and /terms returned 200 on direct load. An
  unknown path returned HTTP 404 with the designed static page.
- Every route has lang="en", one h1, one main, a route-specific title and
  description, canonical and OG metadata, favicon, consistent header, and a
  footer with Privacy and Terms. The home social card is 1200 × 630.
- SPA forward navigation and browser Back moved focus to the new h1, updated
  the polite route announcement, and restored the top position.
- The sitemap lists all application routes. robots.txt, manifest, favicon,
  social card, internal pages, Param Factory link, and hosted checkout returned
  successful final responses. The only mailto link is explicit.
- Live Axe checks on all five routes and /404.html found zero serious or
  critical violations at 390 px. All visible links, buttons, summaries, inputs,
  and selects met the 44 px target check. The clean suite covers 200% text,
  reduced motion, keyboard use, focus, and malformed-data recovery.
- The factory URL verifier passed live / and /?demo=1: one h1, lang, main,
  complete alt text, labeled buttons, and no console errors.
- The cream graph-paper field, coral timing marks, cut-paper metronome art,
  clipped dark instrument, and Fraunces numerals are recognisably specific to
  timing practice. The site does not use a generic centred SaaS hero or feature
  card grid. Asset provenance is recorded in .factory/design.md.

No structure, routing, accessibility, dead-link, or visual-identity finding is
open.

## Missed leverage

No missing AI feature is found. Timing measurement is deterministic and
local-first; model inference would not improve the core job and would add a
network/privacy dependency. The obvious adjacent capabilities from the brief
already exist: microphone, MIDI, and tap input; a local reference pulse; CSV
export; JSON import/export; and offline use. Sync is not clearly implied by the
brief and would conflict with local-only storage unless separately opt-in.

## What would make this perfect

Discard the demo namespace when **Start for real** leaves demo mode; make the
offline indicator follow actual service-worker readiness; register and test
device-access timing; and register the already tested offline-license promise.
Then rerun all claim commands from a fresh clone and repeat the live demo exit,
blocked-worker, request-log, and route checks. No additional feature expansion
is needed.
