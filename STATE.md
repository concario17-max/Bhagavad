Current Task
- task: centered single-panel verse screen with header controls and mode swapping
- phase: complete
- scope: remove the right-side panel and bottom navigation strip, keep previous/next controls in the center header, and swap the center body between summary / translation / keywords

Route
- route: Route B
- reason: the change touches shared shell, verse view, and commentary behavior across multiple files, so it needed coordinated implementation and verification

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing comic asset integration and any source data untouched while reshaping only the verse UI and related controls
- write_sets:
  - worker_shared: `src/components/ui/AppShell.tsx`
  - worker_shared: `src/components/ui/SidebarLayout.tsx`
  - worker_shared: `src/components/ui/SidebarMenu.tsx`
  - worker_shared: `src/components/ui/GlassCard.tsx`
  - worker_shared: `src/components/ui/desktopVerseLayout.ts`
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/components/ChapterVerseSelector.tsx`
  - worker_shared: `src/context/UIContext.tsx`
  - worker_shared: `src/index.css`
  - worker_feature: `src/pages/VerseView.tsx`
  - worker_feature: `src/components/VerseCommentary.tsx`
  - worker_feature: `src/components/VerseSidePanel.tsx`
  - worker_feature: `src/App.tsx`

Reviewer
- reviewer: main-review

Last Update
- time: 2026-05-27 11:02 KST
- note: centered verse panel and header control flow are implemented and verified with build and test:compile
