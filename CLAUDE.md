# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IdleCraft is an idle/incremental game (inspired by Melvor / The Elder Scrolls) built with React 19 + TypeScript + Vite, deployed to GitHub Pages at `/IdleCraft/`. It features skills (woodcutting, mining, crafting, alchemy, smithing, battle), offline progression, and local saves. See also `Agents.md`, which contains additional agent rules for this repo.

## Package Manager & Commands

Always use **pnpm** — never npm or yarn. Do not run `pnpm add` or modify dependencies in `package.json` unless explicitly requested.

```bash
pnpm install            # install dependencies
pnpm run dev            # start Vite dev server (opens browser)
pnpm run build          # type-check (tsc) + production build
pnpm run lint           # oxlint src --fix + oxfmt src (NOT ESLint/Prettier)
pnpm run test           # run Vitest
pnpm vitest run src/path/to/file.test.ts   # run a single test file
pnpm run test:watch     # watch mode
pnpm run coverage       # coverage (v8)
pnpm run deploy         # gh-pages deploy — NEVER run unless explicitly instructed
```

Linting/formatting uses **oxlint** (type-aware, `.oxlintrc.json`) and **oxfmt** (`.oxfmtrc.json`: 4-space indent, single quotes, no semicolons, 120 print width). Run lint and tests before completing any task.

Tests are colocated with source as `*.test.ts` or `*.spec.ts`. When modifying game logic, add or update Vitest tests; never remove tests to make them pass.

## Architecture

### State management

There is a single global Zustand store holding the entire `GameState`:

- `src/game/GameState.ts` — the full game state interface.
- `src/game/state.ts` — `useGameStore`, a bare Zustand store (no actions inside the store).
- `src/game/setState.ts` — **all mutations go through `setState(fn)`**, which wraps the mutation in `mutative`'s `create()` for immutable updates. Game-logic functions take `(state: GameState, ...)` and mutate the draft directly; they are called from inside `setState`.

UI components read state via `useGameStore(selector)`. Selectors live in `selectors/` folders (or `*Selectors.ts` files) per feature and use custom memoization helpers (`src/utils/myMemoize.ts`, `myMemoizeOne.ts`, `micro-memoize`, `proxy-memoize`). Keep UI logic separated from game logic; avoid side effects in React components.

### Entity collections

Normalized collections use a custom entity adapter (`src/entityAdapter/`): state shape is `{ ids: string[], entries: Record<string, T> }` (`InitialState<T>`). Each feature defines its own adapter (e.g. `TimerAdapter`, `characterAdapter`, `storageAdapter`) extending `AbstractEntityAdapter`, which provides `create/update/replace/remove/select/selectEx/find/forEach/load`. **Never access `ids`/`entries` directly when an adapter or selector exists.**

### Timer & activity system (the game loop)

Everything in the game runs on timers — there is no tick loop:

- `src/timers/startTimer.ts` creates a `Timer` (`{ id, from, to, type: ActivityTypes, actId }`) in `state.timers`.
- `src/timers/updateTimers.ts` schedules real `setTimeout`s for pending timers (the `hacktimer` dependency keeps them accurate in background tabs).
- When a timer fires, `src/timers/onTimer.ts` advances `state.now`, removes the timer, and dispatches to the executor registered for its activity type.
- Activity behavior is registered in **registry maps** in `src/game/globals.ts` (`activityExecutors`, `activityRemovers`, `activityStarters`, `activityTitles`, `activityIcons`, `activityViewers`), populated by `src/game/functions/initialize.ts` (called from `main.tsx` and from workers). **To add a new activity type**: add it to `ActivityTypes`, implement `exec/remove/start/title/icon/view` functions in the feature folder, and register them in `initialize.ts`. Recipes, abilities, quests, and event listeners are registered the same way in `initRecipes`/`initAbilities`/`initQuests`/`initListeners`.

Game time is tracked in `state.now` (not wall-clock directly); `state.loading` and `state.isTimer` gate real-timer scheduling so the same logic runs in replay/simulation.

### Offline progression & saves

- **Offline catch-up**: on load, `src/game/functions/loadWorker.ts` (a Web Worker) replays elapsed time by repeatedly popping the earliest timer and calling `onTimer` (`loadGame.ts`), posting progress back to the UI. `advanceTimers` fast-forwards beyond `MAX_LOAD`.
- **Saves**: persisted to IndexedDB (database `IdleCraft`). Export/import is compressed and handled off-thread by `src/game/save/saveWorker.ts` via `saveService.ts`; save keys are minified by `stateKeyMinifier.ts`. Changes to `GameState` shape may affect save compatibility — check `stateKeyMinifier` and adapter `load()` when renaming state keys.

### Feature module layout

Each game feature is a top-level folder under `src/` (e.g. `wood/`, `mining/`, `crafting/`, `battle/`, `characters/`, `storage/`, `quests/`, `effects/`) with a common internal convention:

- `functions/` — pure game-logic mutations `(state, ...) => void`
- `selectors/` — memoized read functions
- `ui/` — React components for that feature
- `*Interfaces.ts` / `*Types.ts`, `*Const.ts`, adapters, and static data files

Other key directories:

- `src/components/ui/` — shadcn/ui primitives (new-york style, Radix + Tailwind 4; `components.json`). Shared game UI (shell, progress bars) is in `src/ui/`.
- `src/msg/` — i18n/translations (`eng.tsx`); UI strings go through `useTranslations`.
- `src/utils/` — generic helpers (`deepMerge`, `MapEx`, `myCompare`, memoizers, `getUniqueId`).
- `src/icons/` — icon registry (`Icons` enum) used by activity registries.

Path alias: `@/` → `src/` (both Vite and tsconfig). TypeScript is strict with `noUncheckedIndexedAccess` — indexed lookups return `T | undefined`; use adapter `selectEx` when the entity must exist. The React Compiler is enabled via Babel plugin, so avoid manual `useMemo`/`useCallback` micro-optimization patterns that fight it.

## Key Conventions (from Agents.md)

- Search for existing helpers before writing new logic (e.g. `selectItemQta`, `MaxHealth`, feature selectors/adapters); do not duplicate calculation logic — keep scaling and formulas centralized.
- Prefer pure, deterministic functions for game logic; the only allowed side effects outside state/update modules are `startTimer` and `setTimeout`.
- If something similar already exists, implement new features the same way.
- Make the minimal required change; do not refactor unrelated code, rewrite modules, or introduce new libraries without approval.
- Do not trigger `pnpm run deploy` automatically.
