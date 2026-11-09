import { describe, it, expect } from "vitest";
import { addRecord, sortRecords, type Record } from "./leaderboard.js";

describe("leaderboard", () => {
  const record = (attempts: number, timeMs: number): Record => ({
    attempts,
    timeMs,
    date: "2026-01-01",
  });

  it("sorts by attempts ascending", () => {
    const sorted = sortRecords([
      record(5, 100),
      record(2, 300),
      record(3, 200),
    ]);
    expect(sorted.map((r) => r.attempts)).toEqual([2, 3, 5]);
  });

  it("breaks ties by time ascending", () => {
    const sorted = sortRecords([
      record(2, 300),
      record(2, 100),
      record(2, 200),
    ]);
    expect(sorted.map((r) => r.timeMs)).toEqual([100, 200, 300]);
  });

  it("does not mutate the input array", () => {
    const input = [record(5, 100), record(2, 300)];
    sortRecords(input);
    expect(input.map((r) => r.attempts)).toEqual([5, 2]);
  });

  it("adds a record and keeps the list sorted", () => {
    const existing = [record(3, 200), record(5, 100)];
    const next = addRecord(existing, record(2, 300));
    expect(next.map((r) => r.attempts)).toEqual([2, 3, 5]);
    expect(existing).toHaveLength(2);
  });

  it("keeps only top N records", () => {
    const existing = [record(1, 100), record(2, 100), record(3, 100)];
    const next = addRecord(existing, record(4, 100), 3);
    expect(next).toHaveLength(3);
    expect(next.map((r) => r.attempts)).toEqual([1, 2, 3]);
  });
});
