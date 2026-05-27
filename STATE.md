Current Task
- task: align the desktop verse layout to a centered 1406px grid
- phase: implementation
- scope: keep the sticky header and existing interactions intact, but set the desktop composition to a centered 440px / 966px grid with mobile remaining one column

Route
- route: Route B
- reason: the change touches the header and verse layout wrappers together, so it needs coordinated implementation and verification

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing header controls, data flow, toggle state, and date navigation intact while changing only the desktop layout widths and grid columns
- write_sets:
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/pages/VerseView.tsx`

Reviewer
- reviewer: Dirac

Last Update
- time: 2026-05-27 14:43 KST
- note: desktop wrapper now uses a centered 1406px composition with a fixed 440px / 966px grid; build and e2e passed
