import { describe, it, expect } from "vitest";
import { createDigitValidator } from "./createDigitValidator.js";

describe("createDigitValidator", () => {
  it("returns a function", () => {
    expect(typeof createDigitValidator(10)).toBe("function");
  });

  it("accepts valid decimal digits", () => {
    const isValid = createDigitValidator(10);
    expect(isValid("0")).toBe(true);
    expect(isValid("5")).toBe(true);
    expect(isValid("9")).toBe(true);
  });

  it("rejects digits outside the base", () => {
    const isValid = createDigitValidator(10);
    expect(isValid("a")).toBe(false);
  });

  it("accepts only 0 and 1 for binary", () => {
    const isValid = createDigitValidator(2);
    expect(isValid("0")).toBe(true);
    expect(isValid("1")).toBe(true);
    expect(isValid("2")).toBe(false);
  });

  it("accepts hex digits case-insensitively", () => {
    const isValid = createDigitValidator(16);
    expect(isValid("a")).toBe(true);
    expect(isValid("A")).toBe(true);
    expect(isValid("f")).toBe(true);
    expect(isValid("F")).toBe(true);
  });

  it("rejects non-digit characters", () => {
    const isValid = createDigitValidator(16);
    expect(isValid("g")).toBe(false);
    expect(isValid("-")).toBe(false);
    expect(isValid("")).toBe(false);
  });

  it("rejects digits valid in a larger base but not in the current one", () => {
    const isValid = createDigitValidator(8);
    expect(isValid("7")).toBe(true);
    expect(isValid("8")).toBe(false);
    expect(isValid("a")).toBe(false);
  });
});
