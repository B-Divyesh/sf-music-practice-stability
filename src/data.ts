import type { AppData, InputMode, Passage, Session, Take } from './types';

const DB_NAME = 'steady-take';
const STORE_NAME = 'records';
const DATA_KEY = 'app-data';
const DEMO_KEY = 'demo:steady-take';

export const emptyData = (): AppData => ({ passages: [], sessions: [] });

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown, max = 160): value is string => typeof value === 'string' && value.length > 0 && value.length <= max;
const isDate = (value: unknown): value is string => isText(value, 40) && Number.isFinite(Date.parse(value));
const isIntegerIn = (value: unknown, minimum: number, maximum: number): value is number => typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum;
const isFiniteNumber = (value: unknown, minimum = 0, maximum = 3_600_000): value is number => typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;

function isPassage(value: unknown): value is Passage {
  if (!isRecord(value)) return false;
  return isText(value.id, 120)
    && isText(value.name, 48)
    && value.name.trim().length > 0
    && isIntegerIn(value.bpm, 30, 220)
    && isIntegerIn(value.beats, 2, 8)
    && isDate(value.createdAt);
}

function isTake(value: unknown, beats: number): value is Take {
  if (!isRecord(value) || !isText(value.id, 120) || !Array.isArray(value.onsets) || value.onsets.length !== beats) return false;
  if (!isFiniteNumber(value.deviationMs) || typeof value.controlled !== 'boolean') return false;
  const onsets = value.onsets as unknown[];
  return onsets.every((onset, index) => isIntegerIn(onset, 0, 3_600_000) && (index === 0 || onset >= (onsets[index - 1] as number)));
}

function isSession(value: unknown, passages: Map<string, Passage>): value is Session {
  if (!isRecord(value) || !isText(value.id, 120) || !isText(value.passageId, 120) || !isText(value.passageName, 48) || !isDate(value.createdAt)) return false;
  if (!isIntegerIn(value.bpm, 30, 220) || !isIntegerIn(value.beats, 2, 8) || !isFiniteNumber(value.spreadMs) || !Array.isArray(value.takes) || value.takes.length !== 6) return false;
  const passage = passages.get(value.passageId);
  const inputModes: InputMode[] = ['tap', 'microphone', 'midi'];
  if (!passage) return false;
  const beats = value.beats as number;
  return passage.name === value.passageName
    && passage.bpm === value.bpm
    && passage.beats === beats
    && inputModes.includes(value.inputMode as InputMode)
    && (value.takes as unknown[]).every((take) => isTake(take, beats));
}

/** Parse untrusted backups before they are allowed to replace local history. */
export function parseAppData(value: unknown): AppData | null {
  if (!isRecord(value) || !Array.isArray(value.passages) || !Array.isArray(value.sessions)) return null;
  if (!value.passages.every(isPassage)) return null;
  const passages = value.passages as Passage[];
  if (new Set(passages.map((passage) => passage.id)).size !== passages.length) return null;
  const byId = new Map(passages.map((passage) => [passage.id, passage]));
  if (!(value.sessions as unknown[]).every((session) => isSession(session, byId))) return null;
  const sessions = value.sessions as Session[];
  if (new Set(sessions.map((session) => session.id)).size !== sessions.length) return null;
  return { passages, sessions };
}

export const sampleData = (): AppData => {
  const passage: Passage = {
    id: 'sample-g-major',
    name: 'G major crossing',
    bpm: 72,
    beats: 4,
    createdAt: '2026-08-10T09:00:00.000Z',
  };
  const spreads = [54, 47, 42, 36, 31, 26];
  return {
    passages: [passage],
    sessions: spreads.map((spread, sessionIndex) => ({
      id: `sample-session-${sessionIndex + 1}`,
      passageId: passage.id,
      passageName: passage.name,
      createdAt: new Date(Date.UTC(2026, 7, 10 + sessionIndex * 3, 9)).toISOString(),
      bpm: passage.bpm,
      beats: passage.beats,
      inputMode: 'tap',
      spreadMs: spread,
      takes: Array.from({ length: 6 }, (_, takeIndex) => {
        const wobble = (takeIndex - 2.5) * spread * 0.28;
        const onsets = [0, 833 + wobble, 1666 - wobble * 0.35, 2499 + wobble * 0.6].map(Math.round);
        return {
          id: `sample-take-${sessionIndex}-${takeIndex}`,
          onsets,
          deviationMs: Math.max(8, Math.round(spread * 0.72 + Math.abs(takeIndex - 2.5) * 3)),
          controlled: takeIndex >= 3,
        };
      }),
    })),
  };
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadData(demo: boolean): Promise<AppData> {
  if (demo) {
    const stored = sessionStorage.getItem(DEMO_KEY);
    if (stored) {
      try {
        const parsed = parseAppData(JSON.parse(stored));
        if (parsed) return parsed;
      } catch { /* A broken demo is reset below. */ }
      sessionStorage.removeItem(DEMO_KEY);
    }
    const seeded = sampleData();
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(DATA_KEY);
      request.onsuccess = () => {
        const parsed = parseAppData(request.result);
        if (!request.result || parsed) resolve(parsed ?? emptyData());
        else {
          // Old invalid records must not keep the practice page unrecoverable.
          db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(DATA_KEY);
          resolve(emptyData());
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    const fallback = localStorage.getItem('steady-take:fallback');
    if (!fallback) return emptyData();
    try {
      const parsed = parseAppData(JSON.parse(fallback));
      if (parsed) return parsed;
    } catch { /* Clear the invalid fallback below. */ }
    localStorage.removeItem('steady-take:fallback');
    return emptyData();
  }
}

export async function saveData(data: AppData, demo: boolean): Promise<void> {
  if (demo) {
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(data));
    return;
  }
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(data, DATA_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.setItem('steady-take:fallback', JSON.stringify(data));
  }
}

export function resetDemo(): void {
  sessionStorage.removeItem(DEMO_KEY);
}
