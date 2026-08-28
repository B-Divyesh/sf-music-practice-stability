import './styles.css';
import { loadData, resetDemo, saveData } from './data';
import { improvement, sessionSpread, takeDeviation } from './stability';
import type { AppData, CaptureState, InputMode, Passage, Session, Take } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const SLUG = 'music-practice-stability';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERIFY_KEY = `sb_license_verdict:${SLUG}`;
const API_BASE = 'https://api.sociobot.in/api/v1';
const CHECKOUT = `${API_BASE}/products/${SLUG}/checkout`;
const BUILD_ID = 'v1.0.1';

let data: AppData = { passages: [], sessions: [] };
let demo = false;
let capture: CaptureState | null = null;
let notice = '';
let errorMessage = '';
let isPaid = false;
let selectedPassageId: string | null = null;
let setupMode: 'new' | 'edit' | null = null;
let audioCleanup: (() => void) | null = null;
let midiCleanup: (() => void) | null = null;

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character]!);

const id = (): string => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const formatDate = (value: string): string => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));

function setMetadata(path: string): void {
  const titles: Record<string, string> = {
    '/': 'Steady Take — measure repeatable musical timing',
    '/practice': 'Practice timing — Steady Take',
    '/demo': 'Demo — Steady Take',
    '/privacy': 'Privacy — Steady Take',
    '/terms': 'Terms — Steady Take',
    '/404': 'Page not found — Steady Take',
  };
  document.title = titles[path] ?? titles['/404'];
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://music-practice-stability.sociobot.in${path === '/' ? '/' : path}`;
}

function header(): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-bar" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span><button class="text-button" data-action="reset-demo">Reset demo</button><a href="/practice" data-nav>Start for real</a></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Steady Take home"><span aria-hidden="true" class="wordmark-mark"><i></i><i></i><i></i></span>Steady Take</a>
      <nav aria-label="Main navigation">
        <a href="/practice" data-nav>Practice</a>
        <a href="/demo" data-nav>Demo</a>
        <a href="/privacy" data-nav>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p><strong>Steady Take</strong><br><span>Measure timing stability across repeated takes.</span></p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://hello-factory.sociobot.in/" rel="external">Built by Param Factory <span class="sr-only">(external)</span></a></nav>
    <p class="build">${BUILD_ID} · Generated artwork</p>
  </footer>`;
}

function messages(): string {
  return `<div class="message-stack" aria-live="polite">
    ${notice ? `<p class="notice">${escapeHtml(notice)}</p>` : ''}
    ${errorMessage ? `<p class="error" role="alert">${escapeHtml(errorMessage)}</p>` : ''}
  </div>`;
}

function landing(): string {
  return `${header()}<main id="main" tabindex="-1">${messages()}
    <section class="hero ruled-section">
      <div class="hero-copy">
        <p class="eyebrow"><span>01</span> Repeat with control</p>
        <h1 tabindex="-1">Measure steadier practice takes</h1>
        <p class="lede">For beginning instrumentalists who want consistent timing across a short passage.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-nav>Try it with sample data</a>
          <p>See six sessions and a 52% drop in timing spread.</p>
        </div>
        <ul class="fact-list" aria-label="Product facts">
          <li><span aria-hidden="true">●</span> Audio stays on this device.</li>
          <li><span aria-hidden="true">●</span> Works offline after the first visit.</li>
          <li><span aria-hidden="true">●</span> Free for one saved passage.</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture><source srcset="/assets/steady-timing-hero-768.webp 768w, /assets/steady-timing-hero.webp 1200w" type="image/webp"><img src="/assets/steady-timing-hero.webp" width="1200" height="800" alt="Geometric timing rows become more evenly spaced beside a mechanical metronome." fetchpriority="high" decoding="async"></picture>
        <figcaption>Uneven attacks settle into a repeatable shape.</figcaption>
      </figure>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div class="section-number">02</div>
      <div><p class="eyebrow">A live practice view</p><h2 id="preview-title">See spread, not a grade</h2><p>Steady Take compares the gaps between your attacks. Smaller spread means your repetitions align more closely.</p></div>
      ${trendFigure(data.sessions.length ? data.sessions : demoPreviewSessions())}
    </section>
    <section class="steps ruled-section" aria-labelledby="steps-title">
      <p class="eyebrow"><span>03</span> How it works</p><h2 id="steps-title">Repeat one short passage</h2>
      <ol>
        <li><strong>Set the passage.</strong><span>Name it, choose the tempo, and set its attack count.</span></li>
        <li><strong>Play six takes.</strong><span>Use your microphone, a MIDI note, or the large tap key.</span></li>
        <li><strong>Compare the spread.</strong><span>Mark controlled takes and watch the same passage over time.</span></li>
      </ol>
    </section>
    <section class="limits-section" aria-labelledby="limits-title">
      <div><p class="eyebrow"><span>04</span> Clear limits</p><h2 id="limits-title">A timing mirror, not a judge</h2></div>
      <div class="measure"><p>Microphone onset detection works best with clean, separate attacks. Room noise can add false marks.</p><p>Steady Take does not identify notes, assess technique, or replace a teacher. You can correct any take before saving.</p><p>No recording is kept. Only onset times and your passage history are stored on this device.</p></div>
    </section>
    <section class="paid-section" aria-labelledby="paid-title">
      <div class="price-stamp"><span>One time</span><strong>$12</strong></div>
      <div><p class="eyebrow"><span>05</span> Full version</p><h2 id="paid-title">Keep every passage</h2><p>Practice one passage free. The full version adds unlimited saved passages.</p>
      <div class="paid-actions"><a class="button secondary" href="${CHECKOUT}">Buy the full version</a><button class="text-button" data-action="show-license">Have a license?</button></div>
      <form id="license-form" class="license-form hidden"><label for="license-token">License token</label><div><input id="license-token" name="license" autocomplete="off" required><button class="button small" type="submit">Verify license</button></div><p>Sociobot is the merchant of record. Purchase terms apply.</p></form></div>
    </section>
  </main>${footer()}`;
}

function demoPreviewSessions(): Session[] {
  return [54, 47, 42, 36, 31, 26].map((spreadMs, index) => ({ id: `${index}`, passageId: 'preview', passageName: 'G major crossing', createdAt: new Date(2026, 7, 10 + index * 3).toISOString(), bpm: 72, beats: 4, inputMode: 'tap', takes: [], spreadMs }));
}

function trendFigure(sessions: Session[]): string {
  const shown = sessions.slice(-8);
  if (!shown.length) return `<div class="empty-plot"><div aria-hidden="true" class="empty-lines"><i></i><i></i><i></i></div><p>Your timing trend will appear after two saved sessions.</p></div>`;
  const values = shown.map((session) => session.spreadMs);
  const max = Math.max(...values, 60);
  const points = values.map((value, index) => `${shown.length === 1 ? 50 : 8 + index * (84 / (shown.length - 1))},${88 - value / max * 68}`).join(' ');
  const change = improvement(shown);
  const summary = change === null ? `${values.at(-1)} milliseconds timing spread.` : `${values.at(-1)} milliseconds timing spread, ${Math.abs(change)}% ${change >= 0 ? 'lower' : 'higher'} than the first session.`;
  return `<figure class="trend-figure">
    <div class="trend-heading"><figcaption><strong>${escapeHtml(shown.at(-1)!.passageName)}</strong><span>${summary}</span></figcaption><strong class="trend-value">${values.at(-1)}<small> ms</small></strong></div>
    <svg viewBox="0 0 100 100" role="img" aria-label="${summary}"><path class="gridline" d="M8 20H92 M8 54H92 M8 88H92"/><polyline points="${points}"/><g>${values.map((value, index) => `<circle cx="${shown.length === 1 ? 50 : 8 + index * (84 / (shown.length - 1))}" cy="${88 - value / max * 68}" r="2.4"/>`).join('')}</g></svg>
    <div class="chart-labels"><span>Earlier</span><span>Latest</span></div>
    <details><summary>Read the chart as text</summary><ol>${shown.map((session) => `<li>${formatDate(session.createdAt)}: ${session.spreadMs} ms spread</li>`).join('')}</ol></details>
  </figure>`;
}

function practicePage(): string {
  const selected = setupMode ? null : capture?.passage ?? data.passages.find((passage) => passage.id === selectedPassageId) ?? data.passages[0] ?? null;
  const related = selected ? data.sessions.filter((session) => session.passageId === selected.id) : [];
  const headline = demo ? 'Explore a steadier passage' : 'Measure your next six takes';
  return `${header()}<main id="main" class="practice-page" tabindex="-1">
    <section class="practice-heading"><div><p class="eyebrow"><span>01</span> Practice instrument</p><h1 tabindex="-1">${headline}</h1><p>${demo ? 'This sample shows six sessions for one short scale crossing.' : 'Set one short passage, then repeat it with the same pulse.'}</p></div><div class="offline-pill" id="connection-status"><span></span>${navigator.onLine ? 'Ready offline' : 'Offline now'}</div></section>
    ${messages()}
    ${!selected ? passageSetup() : `${passagePicker(selected)}${practiceInstrument(selected)}${historySection(selected, related)}`}
    ${!demo ? dataControls() : ''}
  </main>${footer()}`;
}

function passageSetup(): string {
  const editing = setupMode === 'edit' ? data.passages.find((passage) => passage.id === selectedPassageId) ?? data.passages[0] : null;
  return `<section class="setup-sheet" aria-labelledby="setup-title"><div class="sheet-index">A</div><div><h2 id="setup-title">${editing ? 'Edit this passage' : data.passages.length ? 'Set another passage' : 'Set your first passage'}</h2><p>Choose two to eight clear attacks that you can repeat.</p>${passageForm(editing ?? undefined)}${data.passages.length ? '<button class="text-button" data-action="cancel-setup">Return to practice</button>' : ''}</div></section>`;
}

function passageForm(passage?: Passage): string {
  return `<form id="passage-form" class="passage-form">
    <input type="hidden" name="passageId" value="${passage?.id ?? ''}">
    <label>Passage name<input name="name" maxlength="48" required aria-describedby="passage-name-help" placeholder="G major crossing" value="${passage ? escapeHtml(passage.name) : ''}"><span id="passage-name-help">Use at least one letter or number.</span></label>
    <label>Tempo<input name="bpm" type="number" min="30" max="220" value="${passage?.bpm ?? 72}" required><span>BPM</span></label>
    <label>Attacks per take<select name="beats">${[2,3,4,5,6,7,8].map((beats) => `<option ${beats === (passage?.beats ?? 4) ? 'selected' : ''}>${beats}</option>`).join('')}</select></label>
    <button class="button primary" type="submit">${passage ? 'Save passage settings' : 'Set this passage'}</button>
  </form>`;
}

function passagePicker(selected: Passage): string {
  return `<section class="passage-picker" aria-label="Saved passages"><div>${data.passages.map((passage) => `<button data-action="choose-passage" data-id="${passage.id}" aria-pressed="${passage.id === selected.id}">${escapeHtml(passage.name)}</button>`).join('')}</div><button class="text-button" data-action="new-passage">${isPaid || demo ? 'Add passage' : 'Add passage with full version'}</button></section>`;
}

function practiceInstrument(passage: Passage): string {
  const takes = capture?.passage.id === passage.id ? capture.takes : [];
  const mode = capture?.mode ?? 'tap';
  const recording = capture?.recording ?? false;
  const currentCount = capture?.currentOnsets.length ?? 0;
  return `<section class="instrument" aria-labelledby="instrument-title">
    <div class="instrument-top"><div><p class="instrument-label">Current passage</p><h2 id="instrument-title">${escapeHtml(passage.name)}</h2><p>${passage.bpm} BPM · ${passage.beats} attacks per take</p></div><button class="text-button on-dark" data-action="edit-passage">Edit passage</button></div>
    <div class="input-modes" role="group" aria-label="Timing input">
      ${(['tap', 'microphone', 'midi'] as InputMode[]).map((item) => `<button data-action="set-mode" data-mode="${item}" aria-pressed="${mode === item}">${item === 'tap' ? 'Tap key' : item[0].toUpperCase() + item.slice(1)}</button>`).join('')}
    </div>
    <div class="capture-grid">
      <div class="take-counter"><span>Take</span><strong>${Math.min(takes.length + 1, 6)}<small>/6</small></strong><p>${takes.length < 6 ? `${6 - takes.length} more ${takes.length === 5 ? 'take' : 'takes'} for a stable comparison.` : 'Ready to save this session.'}</p></div>
      <div class="onset-field ${recording ? 'is-recording' : ''}" aria-live="polite">
        <div class="pulse-row" aria-hidden="true">${Array.from({ length: passage.beats }, (_, index) => `<i class="${index < currentCount ? 'hit' : ''}"></i>`).join('')}</div>
        ${recording ? `<strong>${mode === 'tap' ? 'Tap the key or press Space' : mode === 'microphone' ? 'Play the passage now' : 'Play any MIDI note'}</strong><span>${currentCount} of ${passage.beats} attacks</span>` : `<strong>${takes.length >= 6 ? 'Six takes captured' : 'Ready for the next take'}</strong><span>${inputHelp(mode)}</span>`}
      </div>
      <div class="capture-actions">
        ${takes.length < 6 ? `<button class="beat-key" data-action="${recording && mode === 'tap' ? 'tap-onset' : 'start-take'}" ${recording && mode !== 'tap' ? 'disabled' : ''}><span>${recording && mode === 'tap' ? 'Tap' : 'Start take'}</span><kbd>${mode === 'tap' ? 'Space' : passage.beats + ' attacks'}</kbd></button>` : `<button class="button mint" data-action="save-session">Save this session</button>`}
        ${recording ? `<button class="text-button on-dark" data-action="cancel-take">Cancel take</button>` : ''}
      </div>
    </div>
    <div class="take-strip" aria-label="Captured takes">${Array.from({ length: 6 }, (_, index) => takeMark(takes[index], index)).join('')}</div>
    <p class="instrument-note">Timing spread compares each attack with the same attack in your other takes.</p>
  </section>`;
}

function inputHelp(mode: InputMode): string {
  if (mode === 'microphone') return 'You will approve microphone access before recording.';
  if (mode === 'midi') return 'Connect a MIDI instrument before starting.';
  return 'The first tap starts the clock. Each later tap adds an attack.';
}

function takeMark(take: Take | undefined, index: number): string {
  if (!take) return `<div class="take-mark empty"><span>${index + 1}</span><i></i><small>Waiting</small></div>`;
  return `<div class="take-mark"><span>${index + 1}</span><i style="--offset:${Math.min(take.deviationMs, 100)}%"></i><small>${take.deviationMs} ms</small><label><input type="checkbox" data-action="toggle-controlled" data-index="${index}" ${take.controlled ? 'checked' : ''}> Controlled</label><button class="remove-take" data-action="remove-take" data-index="${index}" aria-label="Remove take ${index + 1}">×</button></div>`;
}

function historySection(passage: Passage, sessions: Session[]): string {
  return `<section class="history-section" aria-labelledby="history-title"><div class="history-copy"><p class="eyebrow"><span>02</span> Passage history</p><h2 id="history-title">Timing spread over time</h2><p>Lower numbers mean the same attacks landed closer together.</p></div>
    ${trendFigure(sessions)}
    <div class="history-list">${sessions.length ? `<table><caption>Saved sessions for ${escapeHtml(passage.name)}</caption><thead><tr><th>Date</th><th>Input</th><th>Takes</th><th>Spread</th><th>Controlled</th></tr></thead><tbody>${sessions.slice().reverse().map((session) => `<tr><td data-label="Date">${formatDate(session.createdAt)}</td><td data-label="Input">${session.inputMode}</td><td data-label="Takes">${session.takes.length}</td><td data-label="Spread"><strong>${session.spreadMs} ms</strong></td><td data-label="Controlled">${session.takes.filter((take) => take.controlled).length}</td></tr>`).join('')}</tbody></table>` : `<div class="empty-history"><p><strong>No saved sessions yet.</strong></p><p>Your six-take timing spread will appear here after you save it.</p></div>`}</div>
    ${demo ? '<button class="button secondary" data-action="add-demo-session">Add a sample session</button>' : ''}
  </section>`;
}

function dataControls(): string {
  return `<section class="data-section" aria-labelledby="data-title"><div><p class="eyebrow"><span>03</span> Your data</p><h2 id="data-title">Move or clear your history</h2><p>Exports include onset times, controlled marks, and passage settings.</p></div><div class="data-actions"><button class="button secondary" data-action="export-csv">Export CSV</button><button class="button secondary" data-action="export-json">Export backup</button><label class="button file-button">Import backup<input type="file" id="import-file" accept="application/json"></label><button class="text-button danger-button" data-action="clear-data">Clear all data</button></div></section>`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return `${header()}<main id="main" class="legal-page" tabindex="-1"><p class="eyebrow">Steady Take · ${privacy ? 'Privacy' : 'Terms'}</p><h1 tabindex="-1">${privacy ? 'Your practice stays yours' : 'Use Steady Take fairly'}</h1><p class="lede">Effective August 28, 2026</p>
    ${privacy ? `<section><h2>What stays on this device</h2><p>Passage names, onset times, controlled marks, and settings are stored in your browser. Audio is analysed in memory and is not recorded.</p><h2>Network requests</h2><p>The installed app checks this site for updates. License verification contacts Sociobot only after you enter or buy a license.</p><h2>Microphone and MIDI</h2><p>Your browser asks before sharing microphone or MIDI access. You can remove access in your browser settings.</p><h2>Delete or export</h2><p>Use the practice page to export or clear your history. Clearing site storage also removes it.</p>` : `<section><h2>What this tool provides</h2><p>Steady Take estimates timing consistency from detected attacks. It is a practice aid, not a professional assessment.</p><h2>One-time purchase</h2><p>The $12 purchase covers the full version of this product. Sociobot and Dodo are the merchant of record.</p><p>Refunds are handled by the merchant. A refunded or revoked license stops full-version access.</p><h2>Your responsibility</h2><p>Keep a backup if the history matters to you. Browsers can remove local data during cleanup.</p><h2>Fair use</h2><p>Do not probe, disrupt, or misuse the license service. These terms may change with a new product version.</p>`}<h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with privacy, license, or product questions.</p></section>
  </main>${footer()}`;
}

function notFound(): string {
  return `${header()}<main id="main" class="not-found" tabindex="-1"><div class="lost-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p class="eyebrow">Four beats, wrong turn</p><h1 tabindex="-1">This page missed the count</h1><p>The address does not lead to a Steady Take page.</p><a class="button primary" href="/" data-nav>Return home</a></main>${footer()}`;
}

async function render(moveFocus = false): Promise<void> {
  const path = normalizePath(location.pathname);
  demo = path === '/demo';
  data = await loadData(demo);
  if (demo && !capture && data.passages[0]) capture = { passage: data.passages[0], mode: 'tap', takes: [], recording: false, currentOnsets: [], takeStartedAt: 0 };
  setMetadata(path);
  if (path === '/') app.innerHTML = landing();
  else if (path === '/practice' || path === '/demo') app.innerHTML = practicePage();
  else if (path === '/privacy' || path === '/terms') app.innerHTML = legalPage(path.slice(1) as 'privacy' | 'terms');
  else app.innerHTML = notFound();
  if (moveFocus) {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => app.querySelector<HTMLElement>('h1')?.focus());
  }
}

function normalizePath(path: string): string {
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
  return ['/', '/practice', '/demo', '/privacy', '/terms', '/404'].includes(clean) ? clean : '/404';
}

function navigate(path: string): void {
  stopInputs();
  capture = null;
  notice = '';
  errorMessage = '';
  history.pushState({}, '', path);
  void render(true);
}

function ensureCapture(passage: Passage): CaptureState {
  if (!capture || capture.passage.id !== passage.id) capture = { passage, mode: 'tap', takes: [], recording: false, currentOnsets: [], takeStartedAt: 0 };
  return capture;
}

async function startTake(): Promise<void> {
  const passage = capture?.passage ?? data.passages[0];
  if (!passage) return;
  const current = ensureCapture(passage);
  errorMessage = '';
  if (current.mode === 'microphone') {
    const ready = await startMicrophone();
    if (!ready) { await render(); return; }
  }
  if (current.mode === 'midi') {
    const ready = await startMidi();
    if (!ready) { await render(); return; }
  }
  current.recording = true;
  current.currentOnsets = [];
  current.takeStartedAt = 0;
  notice = '';
  await render();
}

function recordOnset(): void {
  if (!capture?.recording) return;
  const now = performance.now();
  if (!capture.takeStartedAt) capture.takeStartedAt = now;
  capture.currentOnsets.push(Math.round(now - capture.takeStartedAt));
  if (capture.currentOnsets.length >= capture.passage.beats) {
    const onsets = [...capture.currentOnsets];
    capture.takes.push({ id: id(), onsets, deviationMs: takeDeviation(onsets, capture.passage.bpm), controlled: false });
    capture.recording = false;
    capture.currentOnsets = [];
    stopInputs();
    notice = `Take ${capture.takes.length} captured. Mark it controlled if it felt settled.`;
  }
  void render();
}

async function startMicrophone(): Promise<boolean> {
  if (!navigator.mediaDevices?.getUserMedia) {
    errorMessage = 'This browser cannot use microphone input. Choose the tap key instead.';
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let lastHit = 0;
    let baseline = 4;
    let frame = 0;
    const listen = () => {
      analyser.getByteTimeDomainData(samples);
      const rms = Math.sqrt(samples.reduce((sum, sample) => sum + (sample - 128) ** 2, 0) / samples.length);
      baseline = baseline * 0.97 + rms * 0.03;
      const now = performance.now();
      if (frame > 12 && rms > Math.max(10, baseline * 2.4) && now - lastHit > 180) { lastHit = now; recordOnset(); }
      frame += 1;
      if (capture?.recording) requestAnimationFrame(listen);
    };
    requestAnimationFrame(listen);
    audioCleanup = () => { stream.getTracks().forEach((track) => track.stop()); void context.close(); audioCleanup = null; };
    return true;
  } catch {
    errorMessage = 'Microphone access was not available. Allow access or choose the tap key.';
    return false;
  }
}

async function startMidi(): Promise<boolean> {
  type MidiInput = { onmidimessage: ((event: { data: Uint8Array }) => void) | null };
  type MidiAccess = { inputs: Map<string, MidiInput> };
  const request = (navigator as Navigator & { requestMIDIAccess?: () => Promise<MidiAccess> }).requestMIDIAccess;
  if (!request) { errorMessage = 'This browser cannot use Web MIDI. Choose the tap key instead.'; return false; }
  try {
    const access = await request.call(navigator);
    const inputs = [...access.inputs.values()];
    if (!inputs.length) { errorMessage = 'No MIDI input was found. Connect one or choose the tap key.'; return false; }
    inputs.forEach((input) => { input.onmidimessage = (event) => { if ((event.data[0] & 0xf0) === 0x90 && event.data[2] > 0) recordOnset(); }; });
    midiCleanup = () => { inputs.forEach((input) => { input.onmidimessage = null; }); midiCleanup = null; };
    return true;
  } catch {
    errorMessage = 'MIDI access was not available. Allow access or choose the tap key.';
    return false;
  }
}

function stopInputs(): void {
  audioCleanup?.();
  midiCleanup?.();
}

async function saveSession(): Promise<void> {
  if (!capture || capture.takes.length < 6) return;
  const session: Session = { id: id(), passageId: capture.passage.id, passageName: capture.passage.name, createdAt: new Date().toISOString(), bpm: capture.passage.bpm, beats: capture.passage.beats, inputMode: capture.mode, takes: capture.takes.slice(0, 6), spreadMs: sessionSpread(capture.takes.slice(0, 6)) };
  data.sessions.push(session);
  await saveData(data, demo);
  capture.takes = [];
  notice = `Session saved with ${session.spreadMs} ms timing spread.`;
  await render();
}

function download(name: string, content: string, type: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function csv(): string {
  const rows = [['session_id', 'passage', 'date', 'bpm', 'input', 'take', 'controlled', 'deviation_ms', 'onsets_ms']];
  for (const session of data.sessions) for (const [index, take] of session.takes.entries()) rows.push([session.id, session.passageName, session.createdAt, String(session.bpm), session.inputMode, String(index + 1), String(take.controlled), String(take.deviationMs), take.onsets.join('|')]);
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
}

async function verifyLicense(token: string): Promise<void> {
  if (demo) return;
  notice = 'Checking the license…'; errorMessage = ''; await render();
  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean };
    if (!result.valid) throw new Error('invalid');
    localStorage.setItem(LICENSE_KEY, token);
    localStorage.setItem(VERIFY_KEY, JSON.stringify({ valid: true, checkedAt: Date.now() }));
    isPaid = true; notice = 'Full version active on this device.';
  } catch {
    localStorage.removeItem(VERIFY_KEY); isPaid = false;
    errorMessage = 'The license could not be verified. Check the token and your connection.'; notice = '';
  }
  await render();
}

async function initialiseLicense(): Promise<void> {
  const url = new URL(location.href);
  const returned = url.searchParams.get('license');
  if (returned) {
    localStorage.setItem(LICENSE_KEY, returned);
    url.searchParams.delete('license');
    history.replaceState({}, '', `${url.pathname}${url.search}`);
  }
  const token = localStorage.getItem(LICENSE_KEY);
  const cached = JSON.parse(localStorage.getItem(VERIFY_KEY) ?? 'null') as { valid: boolean; checkedAt: number } | null;
  isPaid = Boolean(token && cached?.valid);
  if (token && (!cached || Date.now() - cached.checkedAt > 86_400_000) && location.pathname !== '/demo') void verifyLicense(token);
}

app.addEventListener('click', async (event) => {
  const skipLink = (event.target as Element).closest<HTMLAnchorElement>('.skip-link');
  if (skipLink) { event.preventDefault(); app.querySelector<HTMLElement>('#main')?.focus(); return; }
  const target = (event.target as Element).closest<HTMLElement>('[data-nav], [data-action]');
  if (!target) return;
  if (target.hasAttribute('data-nav')) { event.preventDefault(); navigate((target as HTMLAnchorElement).getAttribute('href')!); return; }
  const action = target.dataset.action;
  if (action === 'reset-demo') { resetDemo(); capture = null; notice = 'Sample data reset.'; await render(); }
  if (action === 'show-license') document.querySelector('#license-form')?.classList.remove('hidden');
  if (action === 'set-mode' && capture) { stopInputs(); capture.mode = target.dataset.mode as InputMode; capture.recording = false; capture.currentOnsets = []; await render(); }
  if (action === 'start-take') await startTake();
  if (action === 'tap-onset') recordOnset();
  if (action === 'cancel-take' && capture) { stopInputs(); capture.recording = false; capture.currentOnsets = []; notice = 'Take cancelled.'; await render(); }
  if (action === 'toggle-controlled' && capture) { capture.takes[Number(target.dataset.index)].controlled = (target as HTMLInputElement).checked; }
  if (action === 'remove-take' && capture) { capture.takes.splice(Number(target.dataset.index), 1); notice = 'Take removed. Record it again when ready.'; await render(); }
  if (action === 'save-session') await saveSession();
  if (action === 'edit-passage') { selectedPassageId = capture?.passage.id ?? data.passages[0]?.id ?? null; capture = null; setupMode = 'edit'; await render(); }
  if (action === 'new-passage') {
    if (!isPaid && !demo) { errorMessage = 'The free version saves one passage. Buy the full version to add another.'; await render(); }
    else { capture = null; setupMode = 'new'; await render(); }
  }
  if (action === 'cancel-setup') { setupMode = null; await render(); }
  if (action === 'choose-passage') { stopInputs(); capture = null; setupMode = null; selectedPassageId = target.dataset.id ?? null; await render(); }
  if (action === 'add-demo-session') {
    const previous = data.sessions.at(-1)!; const spreadMs = Math.max(12, previous.spreadMs - 4);
    data.sessions.push({ ...structuredClone(previous), id: id(), createdAt: new Date().toISOString(), spreadMs });
    await saveData(data, true); notice = `Sample session added with ${spreadMs} ms timing spread.`; await render();
  }
  if (action === 'export-csv') { download('steady-take-history.csv', csv(), 'text/csv'); notice = 'CSV exported.'; await render(); }
  if (action === 'export-json') { download('steady-take-backup.json', JSON.stringify(data, null, 2), 'application/json'); notice = 'Backup exported.'; await render(); }
  if (action === 'clear-data' && confirm('Clear every passage and saved session from this device?')) { data = { passages: [], sessions: [] }; capture = null; await saveData(data, false); notice = 'All local practice data was cleared.'; await render(); }
});

app.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  if (form.id === 'passage-form') {
    const values = new FormData(form);
    const existingId = String(values.get('passageId'));
    const existing = data.passages.find((passage) => passage.id === existingId);
    if (!existing && data.passages.length >= 1 && !isPaid && !demo) { errorMessage = 'The free version saves one passage. Buy the full version to keep another.'; await render(); return; }
    const name = String(values.get('name')).trim();
    if (!name) {
      errorMessage = 'Enter a passage name, then save the passage.';
      const nameInput = form.elements.namedItem('name') as HTMLInputElement;
      nameInput.setCustomValidity(errorMessage);
      nameInput.reportValidity();
      await render();
      requestAnimationFrame(() => app.querySelector<HTMLInputElement>('[name="name"]')?.focus());
      return;
    }
    const passage: Passage = { id: existing?.id ?? id(), name, bpm: Number(values.get('bpm')), beats: Number(values.get('beats')), createdAt: existing?.createdAt ?? new Date().toISOString() };
    if (existing) data.passages[data.passages.indexOf(existing)] = passage; else data.passages.push(passage);
    selectedPassageId = passage.id; setupMode = null; await saveData(data, demo); capture = { passage, mode: 'tap', takes: [], recording: false, currentOnsets: [], takeStartedAt: 0 }; notice = `${passage.name} is ready.`; await render();
  }
  if (form.id === 'license-form') await verifyLicense(String(new FormData(form).get('license')).trim());
});

app.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== 'import-file' || !input.files?.[0]) return;
  try {
    const imported = JSON.parse(await input.files[0].text()) as AppData;
    if (!Array.isArray(imported.passages) || !Array.isArray(imported.sessions)) throw new Error('shape');
    data = imported; capture = null; await saveData(data, false); notice = 'Backup imported.'; errorMessage = '';
  } catch { errorMessage = 'This backup could not be read. Choose a Steady Take JSON backup.'; }
  await render();
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && capture?.recording && capture.mode === 'tap' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) { event.preventDefault(); recordOnset(); }
});

addEventListener('popstate', () => { stopInputs(); capture = null; void render(true); });
addEventListener('online', () => { notice = 'Connection restored. Your practice data stayed available.'; void render(); });
addEventListener('offline', () => { notice = 'You are offline. Practice and saved history still work.'; void render(); });

if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && navigator.serviceWorker.controller) { notice = 'An update is ready. Reload when you finish this take.'; void render(); } });
    });
  }).catch(() => { /* The app still works without installation support. */ }));
}

await initialiseLicense();
await render();
