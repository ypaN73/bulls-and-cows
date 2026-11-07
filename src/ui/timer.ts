export interface Timer {
  element: HTMLElement;
  stop: () => number;
}

export function createTimer(startedAt: number): Timer {
  const element = document.createElement("p");
  element.className = "timer";

  const render = (): number => {
    const elapsed = Date.now() - startedAt;
    element.textContent = `Time: ${(elapsed / 1000).toFixed(1)}s`;
    return elapsed;
  };

  render();
  const intervalId = window.setInterval(render, 100);

  const stop = (): number => {
    window.clearInterval(intervalId);
    return render();
  };

  return { element, stop };
}
