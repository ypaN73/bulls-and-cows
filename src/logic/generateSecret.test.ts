import { describe, it, expect } from "vitest";
import { generateSecret } from "./generateSecret";

describe("generateSecret", () => {
  it("returns a string of the requested length", () => {
    const secret = generateSecret(4, 10, () => 0.5);
    expect(secret).toHaveLength(4);
  });

  it("contains only unique digits", () => {
    const secret = generateSecret(4, 10, () => 0.5);
    expect(new Set(secret).size).toBe(secret.length);
  });

  it("uses only digits valid for the base", () => {
    const secret = generateSecret(3, 2, () => 0.9);
    expect(secret).toMatch(/^[01]{3}$/);
  });

  it("is deterministic when given a fixed random source", () => {
    const random = () => 0.42;
    expect(generateSecret(4, 10, random)).toBe(generateSecret(4, 10, random));
  });

  it("produces different results for different random sources", () => {
    const low = () => 0.1;
    const high = () => 0.9;
    expect(generateSecret(6, 10, low)).not.toBe(generateSecret(6, 10, high));
  });

  it("allows leading zero (e.g. 0123)", () => {
    const secret = generateSecret(4, 10, () => 0);
    expect(secret[0]).toBe("0");
  });

  it("throws when length exceeds base", () => {
    expect(() => generateSecret(5, 2, () => 0.5)).toThrow();
  });

  it("handles hex base with lowercase digits", () => {
    const secret = generateSecret(6, 16, () => 0.5);
    expect(secret).toMatch(/^[0-9a-f]{6}$/);
  });
});
