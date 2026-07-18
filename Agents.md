# AGENTS.md – Idle Craft

This project is a React + TypeScript game built with Vite.
Package manager: pnpm.
Agents must always use pnpm commands, never npm or yarn.

---

## 🧠 General Principles

- DO NOT rewrite existing utilities if one already exists.
- ALWAYS search for existing helpers before implementing new logic.
- Prefer pure functions for game logic.
- Avoid side effects outside dedicated state/update modules. The only exceptions are StartTimer and setTimeout.
- Keep UI logic separated from game logic.
- Preserve strict TypeScript typing.
- Minimize changes to unrelated files.

If unsure, search the repository before implementing.

---

## 📦 Package Manager

This project uses **pnpm**.

Install dependencies:

    pnpm install

Run scripts with:

    pnpm run <script>

Do NOT use npm or yarn.

---

## 🧪 Tests

Run tests with:

    pnpm run test

Watch mode:

    pnpm run test:watch

Coverage:

    pnpm run coverage

When modifying game logic:

- Add or update Vitest tests.
- Ensure all tests pass.
- Do NOT remove tests to make them pass.

---

## 🧹 Lint & Formatting

Run:

    pnpm run lint

Before completing any task:

- Ensure oxlint passes.
- Ensure oxfmt formatting is applied.
- Do not introduce unused imports.

---

## 🏗 Build

Validate production build with:

    pnpm run build

Do not modify build configuration unless explicitly requested.

---

## 🚀 Deploy

Deploy command:

    pnpm run deploy

Agents must NOT trigger deploy automatically unless explicitly instructed.

---

## ♻️ Reuse Rules (CRITICAL)

Before writing new logic:

- Search for existing helpers such as:
  - selectItemQta(...)
  - MaxHealth(...)
  - selectors
  - adapters

- Do NOT directly access deeply nested state if a helper exists.
- Do NOT duplicate calculation logic.
- Keep scaling and formulas centralized.

---

## ⚔️ Game Logic Constraints

- Keep logic deterministic.
- Avoid floating-point inconsistencies.
- Keep simulation logic separate from UI.
- Avoid side-effects in React components.
- If something similar exists, implement the new feature the same way.

---

## 🛑 What NOT To Do

- Do not rewrite entire modules unless explicitly requested.
- Do not introduce new libraries without approval.
- Do not remove tests.
- Do not refactor unrelated code.
- Do not access private fields bypassing adapters.
- Do not modify dependencies in package.json unless explicitly instructed.
- Do not run pnpm add unless requested.

---

## ✅ Workflow

1. Identify relevant modules.
2. Search for existing utilities.
3. Implement minimal required change.
4. Run tests (pnpm run test).
5. Run lint (pnpm run lint).
6. Provide concise diff summary.

End of AGENTS.md
