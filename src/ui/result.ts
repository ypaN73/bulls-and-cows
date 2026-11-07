export interface ResultOptions {
  attempts: number;
  timeMs: number;
  onNewGame: () => void;
}

export function createResult(options: ResultOptions): HTMLElement {
  const { attempts, timeMs, onNewGame } = options;

  const root = document.createElement("section");
  root.className = "result";

  const title = document.createElement("h2");
  title.textContent = "You won!";

  const stats = document.createElement("p");
  stats.className = "result__stats";
  stats.textContent = `Attempts: ${attempts}, Time: ${(timeMs / 1000).toFixed(1)}s`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "New game";
  button.addEventListener("click", onNewGame);

  root.append(title, stats, button);
  return root;
}
