export interface GuessResult {
  bulls: number;
  cows: number;
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const secretChars = secret.toLowerCase().split("");
  const guessChars = guess.toLowerCase().split("");

  const bulls = guessChars.filter(
    (char, index) => char === secretChars[index],
  ).length;

  const secretWithoutBulls = secretChars.filter(
    (char, index) => char !== guessChars[index],
  );
  const guessWithoutBulls = guessChars.filter(
    (char, index) => char !== secretChars[index],
  );

  const cows = guessWithoutBulls.reduce<{ count: number; pool: string[] }>(
    (acc, char) => {
      const index = acc.pool.indexOf(char);
      if (index === -1) return acc;
      return {
        count: acc.count + 1,
        pool: [...acc.pool.slice(0, index), ...acc.pool.slice(index + 1)],
      };
    },
    { count: 0, pool: secretWithoutBulls },
  ).count;

  return { bulls, cows };
}
