Current Task
- task: redesign the reader layout with a centered chapter/verse selector and a 50:50 verse/commentary split
- phase: completed
- scope: remove the left sidebar from the verse-reader shell, move chapter/verse selection into the header center using the existing sidebar menu data, simplify the header to title/icon/theme toggle only, and redesign the verse page into a desktop 50:50 split with a stacked mobile fallback

Route
- route: Route B
- reason: the change spans the shared shell, header, selector UI, verse presentation, and planning docs across multiple files

Writer Slot
- main: planner-only
- worker_header: `src/components/Header.tsx`, `src/App.tsx`
- worker_selector: `src/components/ChapterVerseSelector.tsx`, `src/pages/ChapterList.tsx`
- worker_reader: `src/pages/VerseView.tsx`, `src/components/VerseCommentary.tsx`
- worker_docs: `plan.md`

Contract Freeze
- freeze: remove the left sidebar from the reader layout, add a centered chapter/verse selector in the header using the existing chapter and verse data, keep only title/icon/theme toggle in the header chrome, and present verse body plus commentary as a 50:50 desktop split with a stacked mobile fallback
- write_sets:
  - worker_header: `src/components/Header.tsx`, `src/App.tsx`
  - worker_selector: `src/components/ChapterVerseSelector.tsx`, `src/pages/ChapterList.tsx`
  - worker_reader: `src/pages/VerseView.tsx`, `src/components/VerseCommentary.tsx`
  - worker_docs: `plan.md`

Reviewer
- reviewer: Kant (`019d7a37-e37c-7e10-a4a3-f0911b6cdc92`)

Last Update
- time: 2026-04-11 11:30 KST
- note: centered header selector, 50:50 verse/commentary split, and mobile stacked fallback implemented; build and typecheck passed
