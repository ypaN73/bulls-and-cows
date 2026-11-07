import { createDigitValidator } from "../logic/createDigitValidator.js";
import { isValidGuess } from "../logic/isValidGuess.js";

export interface GuessInputOptions {
  length: number;
  base: number;
  onSubmit: (guess: string) => void;
}

export function createGuessInput(options: GuessInputOptions): HTMLElement {
  const { length, base, onSubmit } = options;

  const root = document.createElement("form");
  root.className = "guess-input";

  const input = document.createElement("input");
  input.type = "text";
  input.name = "guess";
  input.autocomplete = "off";
  input.maxLength = length;
  input.placeholder = `Enter ${length} digit(s)`;
  input.setAttribute("inputmode", "text");

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Guess";

  const message = document.createElement("p");
  message.className = "guess-input__message";

  const isValidDigit = createDigitValidator(base);

  input.addEventListener("input", () => {
    const filtered = input.value
      .toLowerCase()
      .split("")
      .filter(isValidDigit)
      .join("")
      .slice(0, length);
    if (filtered !== input.value) {
      input.value = filtered;
    }
  });

  root.addEventListener("submit", (event) => {
    event.preventDefault();
    const guess = input.value.toLowerCase();
    if (!isValidGuess(guess, length, base)) {
      message.textContent = `Enter ${length} unique digit(s) for base ${base}`;
      return;
    }
    message.textContent = "";
    input.value = "";
    onSubmit(guess);
  });

  root.append(input, button, message);
  return root;
}
