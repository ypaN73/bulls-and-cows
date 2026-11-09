import { describe, it, expect } from "vitest";
import { isValidGuess } from "./isValidGuess.js";

describe("isValidGuess", () => {
  it("accepts a valid guess", () => {
    expect(isValidGuess("1234", 4, 10)).toBe(true);
  });

  it("rejects a guess of wrong length", () => {
    expect(isValidGuess("123", 4, 10)).toBe(false);
    expect(isValidGuess("12345", 4, 10)).toBe(false);
  });

  it("rejects digits outside the base", () => {
    expect(isValidGuess("1284", 4, 10)).toBe(true);
    expect(isValidGuess("12a4", 4, 10)).toBe(false);
  });

  it("rejects repeated digits", () => {
    expect(isValidGuess("1123", 4, 10)).toBe(false);
  });

  it("accepts hex digits case-insensitively", () => {
    expect(isValidGuess("A1B2", 4, 16)).toBe(true);
    expect(isValidGuess("a1b2", 4, 16)).toBe(true);
    expect(isValidGuess("A1a2", 4, 16)).toBe(false); // a повторяется
  });

  it("accepts a guess with leading zero", () => {
    expect(isValidGuess("0123", 4, 10)).toBe(true);
  });

  it("rejects a guess with non-digit characters", () => {
    expect(isValidGuess("12-4", 4, 10)).toBe(false);
    expect(isValidGuess("    ", 4, 10)).toBe(false);
  });

  it("rejects empty guess", () => {
    expect(isValidGuess("", 4, 10)).toBe(false);
  });

  it("works for binary", () => {
    expect(isValidGuess("01", 2, 2)).toBe(true);
    expect(isValidGuess("02", 2, 2)).toBe(false);
  });
});
