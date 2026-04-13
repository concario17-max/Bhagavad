Current Task
- task: refine the mobile floating chapter and verse selector
- phase: completed
- scope: make the floating mobile selector smaller and hide it more decisively on downward scroll while leaving desktop behavior unchanged

Route
- route: Route A
- reason: the requested change is a small one-file adjustment inside the mobile selector component

Writer Slot
- main: active
- writer: `src/components/ChapterVerseSelector.tsx`

Contract Freeze
- freeze: keep the desktop selector flow unchanged while tightening the mobile floating selector size and hide transition
- write_sets:
  - writer: `src/components/ChapterVerseSelector.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-04-12 00:00 KST
- note: mobile floating selector tightened and build passed
