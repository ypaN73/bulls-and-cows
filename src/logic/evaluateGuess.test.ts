import { describe, it, expect } from "vitest";
import { evaluateGuess } from "./evaluateGuess.js";

describe("evaluateGuess", () => {
  it("returns all bulls when guess equals secret", () => {
    expect(evaluateGuess("1234", "1234")).toEqual({ bulls: 4, cows: 0 });
  });

  it("returns all cows when digits are swapped", () => {
    expect(evaluateGuess("1234", "4321")).toEqual({ bulls: 0, cows: 4 });
  });

  it("counts bulls and cows separately", () => {
    expect(evaluateGuess("1234", "1243")).toEqual({ bulls: 2, cows: 2 });
  });

  it("returns zero bulls and zero cows for no matches", () => {
    expect(evaluateGuess("1234", "5678")).toEqual({ bulls: 0, cows: 0 });
  });

  it("does not count a digit twice when it repeats in guess", () => {
    expect(evaluateGuess("1234", "1111")).toEqual({ bulls: 1, cows: 0 });
  });

  it("handles hex digits case-insensitively", () => {
    expect(evaluateGuess("a1b2", "A1B2")).toEqual({ bulls: 4, cows: 0 });
  });

  it("works with leading zero", () => {
    expect(evaluateGuess("0123", "0123")).toEqual({ bulls: 4, cows: 0 });
  });
});
