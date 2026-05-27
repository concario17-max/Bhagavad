Current Task
- task: remove unused chapter list and related modal screens
- phase: implementation
- scope: delete the dead ChapterList page and its compendium/lexicon modal helpers that are no longer wired into the app

Route
- route: Route A
- reason: this is a small dead-code cleanup that only removes unused UI files, so one direct write lane is enough

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: remove the unused chapter list page and its modal helpers without changing routed verse behavior or comic assets
- write_sets:
  - main: delete `src/pages/ChapterList.tsx`
  - main: delete `src/components/CompendiumModal.tsx`
  - main: delete `src/components/LexiconModal.tsx`
  - main: delete `src/components/LexiconAlphabet.tsx`
  - main: delete `src/components/LexiconItem.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-05-27 12:05 KST
- note: user asked to remove the unused chapter list entry point and its related modal helpers
