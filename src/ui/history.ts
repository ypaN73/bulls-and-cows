import type { Attempt } from "../logic/gameState.js";

export function createHistory(attempts: Attempt[]): HTMLElement {
  const root = document.createElement("section");
  root.className = "history";

  const title = document.createElement("h2");
  title.textContent = "History";
  root.append(title);

  if (attempts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history__empty";
    empty.textContent = "No attempts yet";
    root.append(empty);
    return root;
  }

  const list = document.createElement("ol");
  list.className = "history__list";

  attempts.forEach((attempt) => {
    const item = document.createElement("li");
    item.className = "history__item";

    const guess = document.createElement("span");
    guess.className = "history__guess";
    guess.textContent = attempt.guess;

    const result = document.createElement("span");
    result.className = "history__result";
    result.textContent = `bulls: ${attempt.bulls}, cows: ${attempt.cows}`;

    item.append(guess, result);
    list.append(item);
  });

  root.append(list);
  return root;
}
