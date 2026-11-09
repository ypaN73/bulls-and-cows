# Bulls and Cows

Логическая игра «Быки и коровы»: угадайте секретное число из уникальных цифр,
получая подсказки о количестве быков и коров.

TypeScript · Vitest · ESLint · Prettier · Husky

## Демо

https://ypan73.github.io/bulls-and-cows/

## Запуск

```bash
npm install
npm run build      # tsc → dist/
npx serve .        # http://localhost:3000
```

## Разработка

```bash
npm run watch      # пересборка при изменениях
npm test           # тесты
npm run lint       # ESLint
npm run format     # Prettier
```

## Архитектура

- `src/logic/` — чистые функции без DOM (генерация, валидация, сравнение,
  подсчёт, состояние, лидерборд).
- `src/ui/` — рендеринг через `createElement`/`textContent`, без `innerHTML`.
- `src/main.ts` — связывает экраны, состояние, таймер, лидерборд.

Подробнее — в [`DESIGN.md`](./DESIGN.md).
