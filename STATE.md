Current Task
- task: remove duplicate commentary title line for verse 1.15
- phase: completed
- scope: remove the redundant inline commentary title display so the right panel only shows the verse reference line for the affected verse

Route
- route: Route A
- reason: the change is confined to a single UI file and one direct verification pass

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: remove the redundant inline commentary title display from the right panel for verse 1.15, keep the rest of the commentary rendering unchanged, and verify the header no longer shows the duplicate line
- write_sets:
  - main: `src/components/VerseCommentary.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-05-21 00:00 KST
- note: duplicate commentary title cleanup completed; build passed
