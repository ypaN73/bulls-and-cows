# DESIGN

## 1. Структуры данных и алгоритмы

**Состояние игры** — иммутабельный объект `GameState` (`src/logic/gameState.ts`):
`{ secret: string, attempts: Attempt[], status: 'playing' | 'won', startedAt: number }`.
Секрет — строка (сохраняет лидирующие нули, например `0123`). История —
массив `Attempt[]`; новые записи добавляются через `[...attempts, entry]`
в `addAttempt`, старые не мутируются. `addAttempt` также выставляет
`status: 'won'`, когда `attempts.bulls === secret.length`.

**`evaluateGuess(secret, guess)`** — две фазы:

1. `filter` по индексам → bulls (позиции, где символы совпали после
   `toLowerCase`).
2. Оставшиеся символы (без быков) прогоняются через `reduce`: каждый символ
   попытки ищется в пуле оставшихся символов секрета; при совпадении символ
   удаляется из пула (`slice`), поэтому одна цифра секрета не считается дважды.
   Реализовано через `filter`/`reduce`, без ручных циклов.

**`countPossibleSecrets(length, base)`** — рекурсивно:
`count(l, b) = b * count(l-1, b-1)`, база `count(0, b) = 1`,
`count(l > b) = 0`. Это P(base, length) = base!/(base−length)!.
Мемоизация — `Map` в замыкании фабрики `createMemoizedCountPossibleSecrets`,
экспортируется готовый экземпляр `countPossibleSecrets`.

**Лидерборд** (`src/logic/leaderboard.ts`) — `Record[]` в `localStorage`
под ключом `bulls-and-cows:records:<length>:<base>` (отдельная таблица на
комбинацию настроек). `sortRecords`/`addRecord` иммутабельны: `[...records]`,
`sort`, `slice(0, topN)`. `loadRecords` защищён от битого JSON и невалидных
записей (`isRecord`).

## 2. Сложность

- **`generateSecret(length, base, random)`** — O(length · base), при
  фиксированном base — O(length). `Array.from` по `length`, внутри `splice`
  по пулу размера ≤ base (O(base)). Так как `length ≤ base`, в худшем случае
  O(length · base).
- **`evaluateGuess(secret, guess)`** — O(n²), где n = длина. Bulls — O(n).
  Cows: `reduce` по n символам, внутри `indexOf` по пулу ≤ n и `slice` — O(n).
  Итого O(n²). При n ≤ 6 практически константа.
- **`isValidGuess(guess, length, base)`** — O(n), n = длина. Проверка длины
  O(1), `every` по n символам с `Set.has` O(1), `Set` из n элементов — O(n).
- **`countPossibleSecrets(length, base)`** — O(length) при первом вызове
  (глубина рекурсии length), O(1) при попадании в кэш. Память O(length) под
  кэш (по числу пар length/base).

## 3. Принципы чистого кода

- **Чистые функции без побочных эффектов** — все функции в `src/logic/*.ts`
  (`generateSecret`, `evaluateGuess`, `isValidGuess`, `createDigitValidator`,
  `countPossibleSecrets`, `createGameState`, `addAttempt`, `sortRecords`,
  `addRecord`): результат зависит только от аргументов.
- **Инъекция зависимости** — `generateSecret(length, base, random = Math.random)`
  (`src/logic/generateSecret.ts`): источник случайности передаётся параметром,
  что делает функцию тестируемой с детерминированным `random`.
- **Каррирование** — `createDigitValidator(base)` (`src/logic/createDigitValidator.ts`)
  возвращает предикат `(char) => boolean`; используется в `isValidGuess`
  (`src/logic/isValidGuess.ts`) и при фильтрации ввода в
  `src/ui/guessInput.ts`.
- **Иммутабельность** — `addAttempt` (`src/logic/gameState.ts`) возвращает
  новый объект через spread; `sortRecords`/`addRecord`
  (`src/logic/leaderboard.ts`) — новые массивы через `[...].sort().slice()`;
  `pool` в `evaluateGuess` обновляется через `slice`, а не `splice` на
  входном массиве.
- **DRY** — алфавит `DIGITS` и логика валидации цифры вынесены в
  `createDigitValidator`, переиспользуются в `isValidGuess` и UI.
- **Имена и маленькие функции** — каждая функция в `src/logic/` решает одну
  задачу (генерация / сравнение / валидация / подсчёт / состояние /
  лидерборд), имена отражают намерение.
- **Без магии** — константы (`DIGITS`, `DEFAULT_TOP_N`, `BASES`, `LENGTHS`)
  и типы (`GuessResult`, `Attempt`, `GameState`, `Record`, `GameSettings`)
  объявлены явно, интерфейсы экспортируются.
- **Без `innerHTML`** — весь динамический контент в `src/ui/*.ts` создаётся
  через `createElement`/`textContent`/`append`, что исключает XSS и
  соответствует требованию задания.
