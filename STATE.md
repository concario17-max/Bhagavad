Current Task
- task: align the verse header width with the centered 52rem canvas
- phase: implementation
- scope: keep the existing header controls and behavior, but constrain the header content wrapper to the same 52rem centered width as the verse canvas

Route
- route: Route A
- reason: this is a single-file width alignment change in the header wrapper, with no behavior or data-flow impact

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing header controls and behavior intact while aligning the header wrapper width to the verse canvas
- write_sets:
  - main: `src/components/Header.tsx`

Reviewer
- reviewer: pending

Last Update
- time: 2026-05-27 13:48 KST
- note: user asked to align the header width with the centered 52rem canvas
