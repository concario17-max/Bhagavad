Current Task
- task: split the verse reader into independent body and commentary scroll areas
- phase: completed
- scope: make the verse body and commentary columns scroll independently on desktop while keeping mobile behavior intact

Route
- route: Route B
- reason: the requested change spans the verse reader page layout and needs coordinated scroll container changes

Writer Slot
- main: planner-only
- worker_layout: `src/pages/VerseView.tsx`

Contract Freeze
- freeze: make the body and commentary columns independently scrollable on desktop while preserving the existing mobile stacking behavior
- write_sets:
  - worker_layout: `src/pages/VerseView.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-04-12 00:00 KST
- note: independent desktop scroll areas implemented and build passed
