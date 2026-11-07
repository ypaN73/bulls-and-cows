import { createDigitValidator } from "./createDigitValidator.js";

export function isValidGuess(
  guess: string,
  length: number,
  base: number,
): boolean {
  if (guess.length !== length) return false;

  const isValidDigit = createDigitValidator(base);
  const chars = guess.toLowerCase().split("");

  const allValid = chars.every(isValidDigit);
  const allUnique = new Set(chars).size === chars.length;

  return allValid && allUnique;
}
