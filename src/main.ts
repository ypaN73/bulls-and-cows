import { generateSecret } from "./logic/generateSecret.js";
import { evaluateGuess } from "./logic/evaluateGuess.js";
import {
  addAttempt,
  createGameState,
  type GameState,
} from "./logic/gameState.js";
import { addRecord, loadRecords, saveRecords } from "./logic/leaderboard.js";
import { createSettingsScreen, type GameSettings } from "./ui/settings.js";
import { createGuessInput } from "./ui/guessInput.js";
import { createHistory } from "./ui/history.js";
import { createTimer, type Timer } from "./ui/timer.js";
import { createResult } from "./ui/result.js";
import { createLeaderboard } from "./ui/leaderboard.js";

const app = document.createElement("div");
app.id = "app";
document.body.append(app);

interface ActiveRound {
  settings: GameSettings;
  state: GameState;
  timer: Timer;
  recorded: boolean;
}

let round: ActiveRound | null = null;

function clear(): void {
  if (round) {
    round.timer.stop();
    round = null;
  }
  app.replaceChildren();
}

function showSettings(): void {
  clear();
  const screen = createSettingsScreen({
    initial: round?.settings,
    onStart: (settings) => startRound(settings),
  });
  app.append(screen);
}

function startRound(settings: GameSettings): void {
  clear();
  const secret = generateSecret(settings.length, settings.base);
  const state = createGameState(secret, Date.now());
  const timer = createTimer(state.startedAt);
  round = { settings, state, timer, recorded: false };
  renderRound();
}

function renderRound(): void {
  if (!round) return;
  const { settings, state, timer } = round;

  app.replaceChildren();

  const header = document.createElement("header");
  header.className = "game__header";

  const mode = document.createElement("span");
  mode.className = "game__mode";
  mode.textContent = `${settings.base}-base · length ${settings.length}`;

  header.append(mode, timer.element);
  app.append(header);

  if (state.status === "won") {
    if (!round.recorded) {
      round.recorded = true;
      const timeMs = timer.stop();
      const record = {
        attempts: state.attempts.length,
        timeMs,
        date: new Date().toISOString().slice(0, 10),
      };
      const records = addRecord(
        loadRecords(settings.length, settings.base),
        record,
      );
      saveRecords(settings.length, settings.base, records);

      const result = createResult({
        attempts: state.attempts.length,
        timeMs,
        onNewGame: showSettings,
      });
      const history = createHistory(state.attempts);
      const leaderboard = createLeaderboard(records);
      app.append(history, result, leaderboard);
    }
    return;
  }

  const input = createGuessInput({
    length: settings.length,
    base: settings.base,
    onSubmit: handleGuess,
  });

  const history = createHistory(state.attempts);
  app.append(input, history);
}

function handleGuess(guess: string): void {
  if (!round || round.state.status === "won") return;
  const alreadyTried = round.state.attempts.some((a) => a.guess === guess);
  if (alreadyTried) return;

  const { bulls, cows } = evaluateGuess(round.state.secret, guess);
  round.state = addAttempt(round.state, { guess, bulls, cows });
  renderRound();
}

showSettings();
