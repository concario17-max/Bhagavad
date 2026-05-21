Current Task
- task: merge chapter selector and mode toggle into one header pill
- phase: implementation
- scope: combine the chapter/verse selector with the commentary/text toggle into one segmented header control using `Text` for the right-side mode label

Route
- route: Route B
- reason: the change spans shared header UI, selector logic, and right-panel mode switching, so it crosses multiple files and shared state behavior

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: the header exposes one segmented control that combines chapter/verse selection with `Commentary/Text` mode switching, while the page layout and panel content stay functionally equivalent
- write_sets:
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/components/ChapterVerseSelector.tsx`
  - worker_shared: `src/context/UIContext.tsx`
  - worker_shared: `src/pages/VerseView.tsx`
  - worker_shared: `src/components/verse/VerseDeepDivePanel.tsx`

Reviewer
- reviewer: reviewer-pending

Last Update
- time: 2026-05-21 17:35 KST
- note: merged header pill controls into explicit Commentary/Text chips and verified production build
