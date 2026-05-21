Current Task
- task: remove dark mode from the app
- phase: completed
- scope: remove the theme toggle from the UI, force the app to stay in the light theme, and clean up any theme state that only exists to support dark mode

Route
- route: Route B
- reason: the scope touches theme state, header UI, and app bootstrap across multiple files, so it needs a frozen contract and delegated implementation

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: remove the visible dark-mode control, keep the app locked to the light theme, preserve the existing reading layout, and update any tests or bootstrap code that still depends on theme toggling
- write_sets:
  - worker: `src/main.tsx`, `src/context/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`, `src/components/Header.tsx`

Reviewer
- reviewer: Lovelace

Last Update
- time: 2026-05-21 00:00 KST
- note: dark-mode removal task completed; light mode is fixed at DOM and browser meta levels, toggle removed, and build passed
