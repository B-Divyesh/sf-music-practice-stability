import type { Take } from './types';

export function average(values: number[]): number {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => (value - mean) ** 2)));
}

export function takeDeviation(onsets: number[], bpm: number): number {
  if (onsets.length < 2) return 0;
  const expectedInterval = 60_000 / bpm;
  const intervals = onsets.slice(1).map((value, index) => value - onsets[index]);
  return Math.round(Math.sqrt(average(intervals.map((value) => (value - expectedInterval) ** 2))));
}

export function sessionSpread(takes: Take[]): number {
  if (takes.length < 2) return 0;
  const longest = Math.max(...takes.map((take) => take.onsets.length));
  const spreads: number[] = [];
  for (let index = 1; index < longest; index += 1) {
    const values = takes.map((take) => take.onsets[index]).filter((value): value is number => Number.isFinite(value));
    if (values.length > 1) spreads.push(standardDeviation(values));
  }
  return Math.round(average(spreads));
}

export function improvement(sessions: { spreadMs: number }[]): number | null {
  if (sessions.length < 2 || sessions[0].spreadMs === 0) return null;
  return Math.round(((sessions[0].spreadMs - sessions.at(-1)!.spreadMs) / sessions[0].spreadMs) * 100);
}
