Current Task
- task: move non-English/HAM translations into the deep-dive panel
- phase: implementation
- scope: keep the left panel limited to ENGLISH/HAM and render GIL/MYUNG/SUK translations inside the right-side deep-dive view

Route
- route: Route B
- reason: the change spans left and right panel components plus shared translation rendering, so it crosses multiple files and layout behavior

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: left panel renders only ENGLISH/HAM, right deep-dive panel renders the remaining translation blocks, and the shared header mode toggle remains the entry point for commentary vs deep-dive
- write_sets:
  - main: `src/components/verse/VerseTranslationsSection.tsx`
  - worker_shared: `src/components/verse/VerseDeepDivePanel.tsx`
  - worker_shared: `src/pages/VerseView.tsx`
  - worker_shared: `src/utils/content.ts`

Reviewer
- reviewer: reviewer-pending

Last Update
- time: 2026-05-21 17:25 KST
- note: implemented translation split, cleaned the deep-dive panel copy, and verified with `npm run test:compile` and `npm run build`
