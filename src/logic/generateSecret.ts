const DIGITS = "0123456789abcdef";

export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  if (length <= 0 || base <= 0 || length > base) {
    throw new Error("Invalid length or base");
  }

  const pool = DIGITS.slice(0, base).split("");

  return Array.from({ length }, () => {
    const index = Math.floor(random() * pool.length);
    return pool.splice(index, 1)[0];
  }).join("");
}
