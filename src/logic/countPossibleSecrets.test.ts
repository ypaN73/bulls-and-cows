import { describe, it, expect } from "vitest";
import { countPossibleSecrets } from "./countPossibleSecrets.js";

describe("countPossibleSecrets", () => {
  it("returns base for length 1", () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
    expect(countPossibleSecrets(1, 2)).toBe(2);
    expect(countPossibleSecrets(1, 16)).toBe(16);
  });

  it("counts permutations without repetition", () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it("returns 1 when length equals base", () => {
    expect(countPossibleSecrets(10, 10)).toBe(3628800);
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it("returns 1 for length 0", () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it("returns 0 when length exceeds base", () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(17, 16)).toBe(0);
  });

  it("returns 0 for negative length", () => {
    expect(countPossibleSecrets(-1, 10)).toBe(0);
  });

  it("handles hex base", () => {
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });

  it("is memoized — same arguments return the same cached value", () => {
    const first = countPossibleSecrets(6, 10);
    const second = countPossibleSecrets(6, 10);
    expect(first).toBe(second);
    expect(first).toBe(151200);
  });
});
