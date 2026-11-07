import type { Record } from "../logic/leaderboard.js";

export function createLeaderboard(records: readonly Record[]): HTMLElement {
  const root = document.createElement("section");
  root.className = "leaderboard";

  const title = document.createElement("h2");
  title.textContent = "Leaderboard";
  root.append(title);

  if (records.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No records yet";
    root.append(empty);
    return root;
  }

  const list = document.createElement("ol");
  records.forEach((record, index) => {
    const item = document.createElement("li");
    item.textContent = `${index + 1}. ${record.attempts} attempt(s), ${(record.timeMs / 1000).toFixed(1)}s — ${record.date}`;
    list.append(item);
  });
  root.append(list);
  return root;
}
