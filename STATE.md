Current Task
- task: center the verse experience into a single canvas layout
- phase: complete
- scope: keep the sticky header and existing verse behavior, but normalize the main content into a centered max-w-[52rem] canvas with balanced side margins and cleaner visual rhythm

Route
- route: Route B
- reason: the change touches shared verse screen structure and component sizing across multiple files, so it needs coordinated implementation and verification

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing data flow, navigation behavior, and modal/asset handling intact while tightening the verse layout into a single centered canvas
- write_sets:
  - worker_shared: `src/pages/VerseView.tsx`
  - worker_shared: `src/components/VerseCommentary.tsx`
  - worker_shared: `src/components/VerseSidePanel.tsx`
  - worker_shared: `src/components/ui/ContentReader.tsx`
  - worker_shared: `src/components/ui/AppShell.tsx`
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/index.css`
  - worker_feature: `src/components/verse/VerseDeepDivePanel.tsx`
  - worker_feature: `src/components/verse/VerseTranslationsSection.tsx`

Reviewer
- reviewer: main-review

Last Update
- time: 2026-05-27 12:10 KST
- note: centered canvas layout implemented and verified with build and browser screenshot
