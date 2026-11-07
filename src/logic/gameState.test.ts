import { describe, it, expect } from "vitest";
import { addAttempt, createGameState } from "./gameState.js";

describe("gameState", () => {
  it("creates initial state with empty attempts and playing status", () => {
    const state = createGameState("1234", 1000);
    expect(state).toEqual({
      secret: "1234",
      attempts: [],
      status: "playing",
      startedAt: 1000,
    });
  });

  it("adds an attempt immutably", () => {
    const state = createGameState("1234", 1000);
    const next = addAttempt(state, { guess: "5678", bulls: 0, cows: 0 });
    expect(next).not.toBe(state);
    expect(next.attempts).toHaveLength(1);
    expect(state.attempts).toHaveLength(0);
  });

  it("keeps previous attempts unchanged", () => {
    const state = createGameState("1234", 1000);
    const first = addAttempt(state, { guess: "5678", bulls: 0, cows: 0 });
    const second = addAttempt(first, { guess: "1234", bulls: 4, cows: 0 });
    expect(second.attempts).toHaveLength(2);
    expect(first.attempts).toHaveLength(1);
  });

  it("sets status to won when bulls equal secret length", () => {
    const state = createGameState("1234", 1000);
    const next = addAttempt(state, { guess: "1234", bulls: 4, cows: 0 });
    expect(next.status).toBe("won");
  });

  it("keeps status playing when not won", () => {
    const state = createGameState("1234", 1000);
    const next = addAttempt(state, { guess: "1243", bulls: 2, cows: 2 });
    expect(next.status).toBe("playing");
  });
});
