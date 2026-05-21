Current Task
- task: remove home page and redirect root to the chapter-verse reader
- phase: completed
- scope: replace the landing page with an immediate redirect to `/chapter/1/verse/1`, remove the chapter-list home route from normal navigation, and update the verification flow so it no longer expects a home screen

Route
- route: Route B
- reason: the scope touches routing and test expectations across more than one file, so it needs a frozen contract and delegated implementation

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: make `/` immediately redirect to `/chapter/1/verse/1`, remove the home-page route from the normal app flow, keep the verse reader and selector behavior unchanged, and update any tests or checks that still assume a landing page exists
- write_sets:
  - worker: `src/App.tsx`, `tests/run-e2e.ts`

Reviewer
- reviewer: Lovelace

Last Update
- time: 2026-05-21 00:00 KST
- note: root redirect, reader-focused e2e, build, and e2e verification all passed
