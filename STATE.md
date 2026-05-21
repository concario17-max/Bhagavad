Current Task
- task: remove the duplicate inline title for verse 1.1 comic view
- phase: implementation
- scope: hide the redundant `1.1` inline commentary title line in the right panel while keeping the rest of the commentary and comic rendering unchanged

Route
- route: Route A
- reason: this is a single-file UI cleanup confined to the commentary renderer

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: hide the redundant inline title line for verse `1.1` in the right panel and keep the shared header toggle, right-panel mode switching, and left translations-only layout unchanged
- write_sets:
  - main: `src/components/VerseCommentary.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-05-21 16:47 KST
- note: duplicate inline title cleanup for verse 1.1 started
