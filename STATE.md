Current Task
- task: remove the redundant right-panel section label
- phase: completed
- scope: remove the extra `Commentary` / `심화` label strip above the right panel content while keeping the header toggle and panel mode switching intact

Route
- route: Route A
- reason: this is a single-file UI cleanup confined to the verse page shell

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: remove the redundant section label strip above the right panel content and keep the shared header toggle, right-panel mode switching, and left translations-only layout unchanged
- write_sets:
  - main: `src/pages/VerseView.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-05-21 16:45 KST
- note: redundant right-panel label cleanup completed; build passed
