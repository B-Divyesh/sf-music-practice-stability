import type { AppData, Passage, Session } from './types';

const DB_NAME = 'steady-take';
const STORE_NAME = 'records';
const DATA_KEY = 'app-data';
const DEMO_KEY = 'demo:steady-take';

export const emptyData = (): AppData => ({ passages: [], sessions: [] });

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
    if (stored) return JSON.parse(stored) as AppData;
    const seeded = sampleData();
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(DATA_KEY);
      request.onsuccess = () => resolve((request.result as AppData | undefined) ?? emptyData());
      request.onerror = () => reject(request.error);
    });
  } catch {
    const fallback = localStorage.getItem('steady-take:fallback');
    return fallback ? (JSON.parse(fallback) as AppData) : emptyData();
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
