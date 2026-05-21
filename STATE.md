Current Task
- task: fix comic image button resolution
- phase: implementation
- scope: make the commentary panel comic toggle resolve uploaded learning-comic images reliably and expose dev-only match diagnostics

Route
- route: Route A
- reason: the requested change is still a small one-file commentary-panel fix

Writer Slot
- main: active
- writer: `src/components/VerseCommentary.tsx`

Contract Freeze
- freeze: keep the left body unchanged while the right commentary panel resolves and toggles uploaded learning-comic images
- write_sets:
  - writer: `src/components/VerseCommentary.tsx`

Reviewer
- reviewer: pending

Last Update
- time: 2026-05-21 00:00 KST
- note: switched comic image lookup to folder/file-based matching and added dev-only diagnostics
