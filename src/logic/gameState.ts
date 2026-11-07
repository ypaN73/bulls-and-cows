export interface Attempt {
  guess: string;
  bulls: number;
  cows: number;
}

export type GameStatus = "playing" | "won";

export interface GameState {
  secret: string;
  attempts: Attempt[];
  status: GameStatus;
  startedAt: number;
}

export function createGameState(secret: string, startedAt: number): GameState {
  return { secret, attempts: [], status: "playing", startedAt };
}

export function addAttempt(state: GameState, attempt: Attempt): GameState {
  return {
    ...state,
    attempts: [...state.attempts, attempt],
    status: attempt.bulls === state.secret.length ? "won" : state.status,
  };
}
