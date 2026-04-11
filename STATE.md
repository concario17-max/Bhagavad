Current Task
- task: reduce excessive horizontal whitespace in the verse reader body
- phase: completed
- scope: widen the verse reader content area, reduce nested max-width and padding stacking, and keep the desktop split readable without making the body column feel boxed in

Route
- route: Route B
- reason: the fix spans the verse reader shell, multiple verse subcomponents, and the planning docs across multiple files

Writer Slot
- main: planner-only
- worker_reader: `src/pages/VerseView.tsx`, `src/components/VerseCommentary.tsx`, `src/components/verse/VersePrimaryCard.tsx`, `src/components/verse/VerseTranslationsSection.tsx`, `src/components/ui/ContentReader.tsx`
- worker_docs: `plan.md`

Contract Freeze
- freeze: widen the verse reader content area and trim stacked max-width / padding constraints so the body column reads as open space instead of a boxed inset layout
- write_sets:
  - worker_reader: `src/pages/VerseView.tsx`, `src/components/VerseCommentary.tsx`, `src/components/verse/VersePrimaryCard.tsx`, `src/components/verse/VerseTranslationsSection.tsx`, `src/components/ui/ContentReader.tsx`
  - worker_docs: `plan.md`

Reviewer
- reviewer: Kant (`019d7a37-e37c-7e10-a4a3-f0911b6cdc92`)

Last Update
- time: 2026-04-11 11:45 KST
- note: reader width tuning implemented and verified with typecheck/build
