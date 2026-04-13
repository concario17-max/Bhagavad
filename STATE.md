Current Task
- task: make the mobile chapter and verse selector floating and auto-hide on scroll
- phase: completed
- scope: move the mobile chapter and verse selector out of the normal flow so it floats over content and hides while scrolling down, while leaving desktop behavior unchanged

Route
- route: Route B
- reason: the requested change needs coordinated header and selector component changes plus scroll-state handling

Writer Slot
- main: planner-only
- worker_layout: `src/components/Header.tsx`, `src/components/ChapterVerseSelector.tsx`

Contract Freeze
- freeze: keep the desktop selector flow unchanged, but render the mobile selector as a floating overlay that hides on downward scroll and reappears on upward scroll
- write_sets:
  - worker_layout: `src/components/Header.tsx`, `src/components/ChapterVerseSelector.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-04-12 00:00 KST
- note: mobile floating selector implemented and build passed
