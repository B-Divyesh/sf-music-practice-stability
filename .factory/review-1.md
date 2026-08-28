# Adversarial first-read review 1 — Steady Take

Date: 2026-08-28 UTC

Work order: `music-practice-stability-review-1`

Candidate: `7cfbc65ecc1e613e0f49a0140ae16d7889896fb1`

Live URL: <https://music-practice-stability.sociobot.in>

## Verdict

**FAIL**

There are 16 findings: 1 blocking, 4 major, and 11 minor. All 16 registered
claim commands pass, but the demo does not put its promised result in the first
post-click viewport. Unlisted claims also remain. A PASS requires zero
findings and no untested claim.

## First read, before scrolling

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900.

- What it does: measures how consistently a musician repeats the timing of a
  short passage.
- For whom: beginning instrumentalists.
- What to click first: **Try it with sample data**.

The mobile first screen makes all three answers available with “Measure
steadier practice takes,” “For beginning instrumentalists who want consistent
timing across a short passage,” and “Try it with sample data.” This check is not
blocking. The desktop first screen has a separate layout finding below because
its three facts do not fit in the viewport.

## Findings

### Blocking

#### F-1-1 — The demo hides the result promised by its entry action

- Location/quote: landing action support text, “See six sessions and a 52% drop
  in timing spread.” After the click, `/demo` says, “This sample shows six
  sessions for one short scale crossing.”
- Evidence: in a fresh 390 × 844 context, the first viewport ends in the
  “Current passage” panel. The actual “26 milliseconds timing spread, 52%
  lower than the first session” result starts at y=2,295 px. At 1440 × 900 it
  starts at y=1,578 px. The visitor must pass the entire capture instrument
  before seeing the result that motivated the click.
- Why this fails: the route has realistic data and working controls, but its
  first screen shows setup rather than the demonstrated outcome. This is a weak
  demo under the required one-click test.
- Concrete fix: put a compact seeded result directly below the demo
  introduction and above the capture controls: “Latest spread: 26 ms — down
  from 54 ms across six sessions,” with the small trend chart. Add a 390 × 844
  test asserting the result and chart are visible without scrolling.

### Major

#### F-1-2 — Microphone-behaviour claims are unlisted and untested

- Location/quote: landing, “Microphone onset detection works best with clean,
  separate attacks. Room noise can add false marks.” README, “Microphone onset
  detection needs clean, separate attacks. Room noise can add false marks.”
- Evidence: `.factory/claims.json` has no entry for these reliability and
  false-detection statements. `@claim:input-options` only confirms that fake
  microphone access enters capture; it does not feed sound or assert detected
  attacks.
- Why this fails: a beginner can rely on these statements when deciding whether
  microphone mode will work in their room, but the claim suite proves neither.
- Concrete fix: register a microphone-detection claim and test controlled
  impulse and background-noise fixtures through the analyser. If that cannot be
  tested deterministically, remove the claims and state only the input
  instructions the interface can prove.

#### F-1-3 — The documented storage fallback is an unlisted claim

- Location/quote: README, “A localStorage fallback is used only when IndexedDB
  is unavailable.”
- Evidence: no claim entry or test disables IndexedDB, saves a passage, reloads,
  and confirms recovery from `steady-take:fallback`.
- Why this fails: this is a persistence guarantee a user or deployer can rely
  on, but it is not covered by the claim registry.
- Concrete fix: add `storage-fallback` to `.factory/claims.json` and a clean
  browser test that makes IndexedDB fail, saves data, and confirms it after
  reload. Otherwise remove the sentence.

#### F-1-4 — The payment-party copy is inconsistent, jargon-heavy, and unlisted

- Location/quote: landing license form, “Sociobot is the merchant of record.”
  Terms, “Sociobot and Dodo are the merchant of record.” README, “No payment
  provider is embedded in this app.”
- Evidence: the live checkout redirects to Dodo, but no claim entry tests the
  merchant/embedding statements. The singular and joint descriptions cannot
  both identify the role clearly.
- Why this fails: a purchaser cannot tell which company handles the payment or
  refund. “Merchant of record” is also payment-industry jargon.
- Concrete fix: confirm the legal role, use the same plain sentence everywhere,
  for example “Dodo hosts the checkout and handles the payment through
  Sociobot,” and register a test for the observable redirect and lack of an
  embedded checkout.

#### F-1-5 — The tempo workflow lacks the obvious reference pulse

- Location/quote: landing, “Name it, choose the tempo, and set its attack
  count.” Practice asks for a BPM but offers only tap, microphone, and MIDI
  capture.
- Evidence: the BPM is used in the deviation calculation, but there is no
  count-in, audible metronome, or visible reference pulse before or during a
  take.
- Why this fails: a beginning player asked to repeat at a chosen tempo needs a
  reference for that tempo. Otherwise the app measures against a target it does
  not provide.
- Concrete fix: add an optional local count-in/reference pulse tied to the BPM,
  with mute, reduced-motion handling, and no network dependency. Keep capture
  usable without it and add a claim test for pulse interval and stop controls.
  No AI feature is warranted; import/export already exists, and cloud sync
  would conflict with the local-first brief unless made explicit and optional.

### Minor

#### F-1-6 — Desktop first screen omits the three plain facts

- Location/quote: “Audio stays on this device,” “Works offline after the first
  visit,” and “Free for one saved passage.”
- Evidence: at 1440 × 900 the fact list begins around y=898 px, so its text is
  below the unscrolled viewport. The required first-screen facts are visible at
  390 × 844.
- Why this fails: the oversized four-line headline and art consume the desktop
  viewport, delaying privacy, offline, and price context.
- Concrete fix: reduce the desktop headline/art height or tighten hero spacing
  so all three fact lines fit at 1440 × 900. Add a viewport visibility test.

#### F-1-7 — Route metadata describes the home page, and the 404 has none

- Location: `/practice`, `/demo`, `/privacy`, `/terms`, and an unknown route.
- Evidence: the four SPA routes retain the home meta description, Open Graph
  title, and Open Graph description. The live 404 has no meta description, OG
  metadata, or favicon. Titles, canonicals, and the home social card otherwise
  work.
- Why this fails: shared previews for Privacy, Terms, Demo, and Practice
  mislabel the destination; a shared unknown URL has incomplete identity.
- Concrete fix: update description and OG/Twitter title/description with each
  route alongside `document.title`, and add description, favicon, and OG data
  to `404.html`. Add route-level metadata assertions.

#### F-1-8 — The headline uses an unclear object

- Location/quote: h1, “Measure steadier practice takes.”
- Why this fails: “steadier” describes the takes, while the product actually
  measures consistency across them. The phrase needs a second read.
- Concrete rewrite: “Measure timing consistency across takes.”

#### F-1-9 — The hero eyebrow is a slogan rather than a section name

- Location/quote: “Repeat with control.”
- Why this fails: it does not identify the section or add information beyond
  the headline.
- Concrete rewrite: “Timing practice for beginners,” or remove it.

#### F-1-10 — The limits heading is a metaphor

- Location/quote: “A timing mirror, not a judge.”
- Why this fails: the heading does not name the section when read out of
  context.
- Concrete rewrite: “What Steady Take measures.”

#### F-1-11 — The hero caption describes data as a shape

- Location/quote: “Uneven attacks settle into a repeatable shape.”
- Why this fails: “shape” is metaphorical and does not explain what the rows
  prove.
- Concrete rewrite: “Later timing rows show the attacks landing closer
  together.”

#### F-1-12 — “Onset” introduces jargon and breaks the established term

- Location/quote: landing, “Microphone onset detection” and “Only onset times.”
  README repeats “onset detection,” while the same copy teaches “attacks.”
- Why this fails: the terminology table says the learner-facing term is
  “attack,” but the limits and data copy switches terms.
- Concrete rewrite: use “attack detection” and “attack times” in learner copy.
  Keep `onsets_ms` only as the documented CSV field name.

#### F-1-13 — “Have a license?” is not a result-naming action

- Location/quote: landing button, “Have a license?”
- Why this fails: the label asks a question instead of saying what clicking
  does.
- Concrete rewrite: “Activate full version.”

#### F-1-14 — “Purchase terms apply” gives no usable next step

- Location/quote: hidden landing license form, “Purchase terms apply.”
- Why this fails: every purchase has terms; this sentence neither identifies
  them nor lets the visitor read them.
- Concrete rewrite: “Read the Steady Take purchase terms,” linked to `/terms`.

#### F-1-15 — The README demo instruction is not a usable live link

- Location/quote: “Try the isolated sample at `/demo`.”
- Why this fails: on a repository page, the code-formatted relative path is not
  clickable and does not identify the deployed host. “Isolated” also explains
  implementation rather than the user result.
- Concrete rewrite: “Try the [sample
  demo](https://music-practice-stability.sociobot.in/demo). It does not use your
  practice history.”

#### F-1-16 — The 404 uses two music metaphors instead of naming the error

- Location/quote: 404 eyebrow, “Four beats, wrong turn”; h1, “This page missed
  the count.”
- Why this fails: neither phrase says “page not found” when headings are read
  alone.
- Concrete rewrite: h1 “Page not found”; supporting text “This address does not
  match a Steady Take page.” Remove the eyebrow.

## Complete copy audit

Counts treat a whitespace-separated token as one word. Code-formatted paths
and commands count by the words a reader sees. No sentence exceeds 22 words;
landing average is 7.4 words and README average is 8.3. No banned marketing
word appears. Findings F-1-8 through F-1-16 cover the jargon, inconsistent
term, unclear headings, metaphor, non-result action, and non-useful sentence.

### Landing sentences

| Sentence | Words |
| --- | ---: |
| For beginning instrumentalists who want consistent timing across a short passage. | 11 |
| See six sessions and a 52% drop in timing spread. | 10 |
| Audio stays on this device. | 5 |
| Works offline after the first visit. | 6 |
| Free for one saved passage. | 5 |
| Geometric timing rows become more evenly spaced beside a mechanical metronome. *(image alt text)* | 11 |
| Uneven attacks settle into a repeatable shape. | 7 |
| Steady Take compares the gaps between your attacks. | 8 |
| Smaller spread means your repetitions align more closely. | 8 |
| 26 milliseconds timing spread, 52% lower than the first session. | 10 |
| Set the passage. | 3 |
| Name it, choose the tempo, and set its attack count. | 10 |
| Play six takes. | 3 |
| Use your microphone, a MIDI note, or the large tap key. | 11 |
| Compare the spread. | 3 |
| Mark controlled takes and watch the same passage over time. | 10 |
| Microphone onset detection works best with clean, separate attacks. | 9 |
| Room noise can add false marks. | 6 |
| Steady Take does not identify notes, assess technique, or replace a teacher. | 12 |
| You can correct any take before saving. | 7 |
| No recording is kept. | 4 |
| Only onset times and your passage history are stored on this device. | 12 |
| Practice one passage free. | 4 |
| The full version saves unlimited practice passages on this device. | 10 |
| Sociobot is the merchant of record. | 6 |
| Purchase terms apply. | 3 |
| Measure timing stability across repeated takes. | 6 |

Non-sentence headings/actions checked: “Repeat with control” (3), “Measure
steadier practice takes” (4), “Try it with sample data” (5), “A live practice
view” (4), “See spread, not a grade” (6), “Read the chart as text” (5), “How it
works” (3), “Repeat one short passage” (4), “Clear limits” (2), “A timing
mirror, not a judge” (6), “Full version” (2), “Keep every passage” (3), “Buy
the full version” (4), “Have a license?” (3), and “Verify license” (2).

### README sentences

| Sentence | Words |
| --- | ---: |
| Steady Take measures timing stability across repeated practice takes. | 9 |
| It is for beginning instrumentalists working on short technical passages. | 10 |
| Set a passage, then play six takes with microphone, MIDI, or tap input. | 13 |
| The app compares matched attacks and shows timing spread in milliseconds. | 11 |
| You can mark the takes that felt controlled and compare saved sessions over time. | 14 |
| Audio and practice history stay on the device. | 8 |
| Audio is analysed in memory and is not recorded. | 9 |
| The app works offline after the first connected visit. | 9 |
| Try the isolated sample at /demo. | 6 |
| It includes six sessions for a G major crossing and never reads or writes real practice data. | 17 |
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
| Microphone onset detection needs clean, separate attacks. | 7 |
| Room noise can add false marks. | 6 |
| Steady Take measures timing only; it does not identify notes or assess technique. | 13 |
| The free version saves one passage. | 6 |
| A $12 one-time purchase saves unlimited practice passages on this device. | 11 |
| Checkout and license verification use the Sociobot billing API. | 9 |
| No payment provider is embedded in this app. | 8 |
| Deploy dist/ as a static site. | 6 |
| staticwebapp.config.json supplies the SPA fallback, 404 behavior, MIME mapping, and security headers. | 12 |
| The factory owns infrastructure, DNS, billing registration, and release configuration. | 10 |
| MIT licensed. | 2 |
| See LICENSE. | 2 |

README headings and project-record list labels name their sections or targets
and need no rewrite, apart from the demo instruction in F-1-15.

## Demo and sandbox results

- One click from the landing page reaches the real `/demo` route.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes
  **Reset demo** and **Start for real**.
- The seed contains “G major crossing,” 72 BPM, four attacks, six sessions, and
  spreads from 54 ms to 26 ms.
- Adding a sample session changed the history from six rows to seven; Reset
  returned it to six.
- The demo used only the `demo:steady-take` sessionStorage key in a fresh
  context and did not create a localStorage key.
- A separately created real passage was absent from demo mode and present again
  after **Start for real**. Demo notices and edits did not cross modes.
- A fresh live demo was loaded, service-worker controlled, switched offline,
  and reloaded with “G major crossing” and the 26 ms summary intact.
- The complete live demo request log contained only
  `https://music-practice-stability.sociobot.in` requests. No analytics, CDN,
  model, payment, or other third-party request occurred during the demo flow.

F-1-1 remains blocking despite the working isolation because the seeded result
is not in the first post-click viewport.

## Claims verification

The repository was cloned with `--no-local` into a fresh temporary directory,
then installed with `npm ci`. Every command from `.factory/claims.json` was run
separately. Each command executed once in `chromium` and once in the 390 px
`mobile` project.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `sample-improvement` | PASS (2/2) | Six rows; latest 26 ms; 52% lower. |
| `offline-reload` | PASS (2/2) | Seeded demo survived offline reload. |
| `local-only` | PASS (2/2) | Demo interaction request list was same-origin only. |
| `tap-capture` | PASS (2/2) | Six four-attack takes saved with measured spread. |
| `input-options` | PASS (2/2) | Microphone entered capture; fixture MIDI completed a take. |
| `csv-export` | PASS (2/2) | Download contained the asserted history header. |
| `data-backup` | PASS (2/2) | JSON exported, imported, and local data cleared. |
| `free-passage-limit` | PASS (2/2) | A second free passage produced the upgrade explanation. |
| `paid-passages` | PASS (2/2) | Fixture license saved 25 passages. |
| `full-version-price` | PASS (2/2) | Hosted checkout showed $12.00 and one-time unlock. |
| `controlled-takes` | PASS (2/2) | Controlled count persisted in the saved session. |
| `demo-isolation` | PASS (2/2) | Real and demo records stayed separate. |
| `audio-not-recorded` | PASS (2/2) | No MediaRecorder, audio file, or external request. |
| `take-correction` | PASS (2/2) | A take was removed, replaced, and saved. |
| `license-on-demand` | PASS (2/2) | Sociobot request occurred only after token submission. |
| `revoked-license` | PASS (2/2) | Revoked fixture removed full access. |

Registered claims have no failing or skipped execution. F-1-2 through F-1-4
identify claim-like copy absent from the registry, so the product still has
untested claims.

## History check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists. The
earlier `.factory/handoff.md` was read in full.

- Its previously resolved price blocker remains fixed: the live hosted checkout
  returns the Steady Take full-version product at $12.00 as a one-time unlock.
- Its unlimited-passage assertion remains fixed: the clean fixture test saved
  25 passages.
- Its demo isolation, offline reload, request privacy, route focus, 44 px
  targets, 200% text, reduced motion, and accessibility assertions were
  independently reconfirmed.
- Its statement that no product defects remained is not confirmed because
  F-1-1 through F-1-16 above were observable on the current live release and in
  the candidate code.

There is no earlier finding ID to carry forward.

## Structure, accessibility, and visual checks

- PASS: `/`, `/practice`, `/demo`, `/privacy`, and `/terms` return 200 on direct
  load; an unknown URL returns the designed 404 with HTTP 404.
- PASS: each checked route has `lang="en"`, one `main`, one h1, an ordered
  heading outline, and a route-specific title under 60 characters.
- PASS: canonicals update per SPA route; the home has description, canonical,
  OG/Twitter card, 1200 × 630 art, SVG favicon, and apple-touch icon.
- PASS: forward navigation and browser Back both restored the expected route,
  scrolled to the top, and focused the new h1.
- PASS: every discovered internal, asset, checkout, and factory link returned a
  successful final response; `mailto:` was excluded as required.
- PASS: header/footer and Privacy/Terms links are consistent on all routes.
- PASS: response headers include CSP with `frame-ancestors`, HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- PASS: live Axe checks found zero serious or critical violations on all five
  routes plus the 404 at desktop and mobile sizes. The factory URL verifier also
  reported one h1, `lang`, `main`, complete image alt text, labeled buttons, and
  no console errors on the home route.
- PASS: the graph-paper field, cut-paper timing art, Fraunces numerals, coral
  attacks, clipped instrument surface, and non-looping motion form a distinct,
  product-specific visual identity rather than a generic SaaS template.
- PASS: `npm test` completed with 61 passed and one intentional duplicate static
  check skipped. `npm run build` passed and produced `dist/`; application JS is
  11.27 kB gzip.
- FAIL: route metadata and 404 copy/metadata are covered by F-1-7 and F-1-16.

## What would make this perfect

Move the sample result into the first demo viewport; register or remove every
remaining claim; give the BPM a local reference pulse; make payment-party copy
consistent; replace all metaphor, jargon, and question-style action copy; keep
the three desktop facts above the fold; and set complete route-specific
metadata, including the 404. Then rerun this entire review from a fresh context
and require zero findings.
