export interface Record {
  attempts: number;
  timeMs: number;
  date: string;
}

export const DEFAULT_TOP_N = 10;

export function sortRecords(records: readonly Record[]): Record[] {
  return [...records].sort(
    (a, b) => a.attempts - b.attempts || a.timeMs - b.timeMs,
  );
}

export function addRecord(
  records: readonly Record[],
  record: Record,
  topN: number = DEFAULT_TOP_N,
): Record[] {
  return sortRecords([...records, record]).slice(0, topN);
}

export function storageKey(length: number, base: number): string {
  return `bulls-and-cows:records:${length}:${base}`;
}

export function loadRecords(length: number, base: number): Record[] {
  try {
    const raw = localStorage.getItem(storageKey(length, base));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecord);
  } catch {
    return [];
  }
}

export function saveRecords(
  length: number,
  base: number,
  records: readonly Record[],
): void {
  localStorage.setItem(storageKey(length, base), JSON.stringify(records));
}

function isRecord(value: unknown): value is Record {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record).attempts === "number" &&
    typeof (value as Record).timeMs === "number" &&
    typeof (value as Record).date === "string"
  );
}
