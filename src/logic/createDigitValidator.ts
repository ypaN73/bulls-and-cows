const DIGITS = "0123456789abcdef";

export function createDigitValidator(base: number): (char: string) => boolean {
  const allowed = new Set(DIGITS.slice(0, base).split(""));

  return (char: string): boolean => allowed.has(char.toLowerCase());
}
