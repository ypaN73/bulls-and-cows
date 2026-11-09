import { countPossibleSecrets } from "../logic/countPossibleSecrets.js";

export interface GameSettings {
  length: number;
  base: number;
}

export interface SettingsScreenOptions {
  onStart: (settings: GameSettings) => void;
  initial?: GameSettings;
}

const BASES: ReadonlyArray<{ value: number; label: string }> = [
  { value: 2, label: "bin" },
  { value: 8, label: "oct" },
  { value: 10, label: "dec" },
  { value: 16, label: "hex" },
];

const LENGTHS: ReadonlyArray<number> = [2, 3, 4, 5, 6];

const AVAILABLE_LENGTHS = (base: number): ReadonlyArray<number> =>
  LENGTHS.filter((length) => length <= base);

export function createSettingsScreen(
  options: SettingsScreenOptions,
): HTMLElement {
  const { onStart, initial } = options;

  const initialBase = initial?.base ?? 10;
  const initialLength = initial?.length ?? 4;

  let base = BASES.some((b) => b.value === initialBase) ? initialBase : 10;
  let length = AVAILABLE_LENGTHS(base).includes(initialLength)
    ? initialLength
    : AVAILABLE_LENGTHS(base)[0];

  const root = document.createElement("section");
  root.className = "settings";

  const title = document.createElement("h1");
  title.textContent = "Bulls and Cows";
  root.append(title);

  const form = document.createElement("form");
  form.className = "settings__form";

  const baseLabel = document.createElement("label");
  baseLabel.textContent = "Base: ";
  const baseSelect = document.createElement("select");
  baseSelect.name = "base";
  BASES.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = label;
    option.selected = value === base;
    baseSelect.append(option);
  });
  baseLabel.append(baseSelect);

  const lengthLabel = document.createElement("label");
  lengthLabel.textContent = "Length: ";
  const lengthSelect = document.createElement("select");
  lengthSelect.name = "length";
  lengthLabel.append(lengthSelect);

  const variants = document.createElement("p");
  variants.className = "settings__variants";

  const renderLengths = (): void => {
    const available = AVAILABLE_LENGTHS(base);
    lengthSelect.replaceChildren();
    available.forEach((value) => {
      const option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(value);
      option.selected = value === length;
      lengthSelect.append(option);
    });
  };

  const renderVariants = (): void => {
    const total = countPossibleSecrets(length, base);
    variants.textContent = `Possible secrets: ${total}`;
  };

  baseSelect.addEventListener("change", () => {
    base = Number(baseSelect.value);
    const available = AVAILABLE_LENGTHS(base);
    if (!available.includes(length)) {
      length = available[0];
    }
    renderLengths();
    renderVariants();
  });

  lengthSelect.addEventListener("change", () => {
    length = Number(lengthSelect.value);
    renderVariants();
  });

  const startButton = document.createElement("button");
  startButton.type = "submit";
  startButton.textContent = "Start";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onStart({ length, base });
  });

  form.append(baseLabel, lengthLabel, variants, startButton);
  root.append(form);

  renderLengths();
  renderVariants();

  return root;
}
