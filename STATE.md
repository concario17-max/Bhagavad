Current Task
- task: clone yoga layout, ui, and behavior into gita without copying images or source data
- phase: implementation
- scope: port yoga's shell, header, sidebar, page layout, theme behavior, drawer persistence, and verse navigation dynamics into gita while keeping gita's own data and comic assets

Route
- route: Route B
- reason: the change spans shared UI shell files and feature pages, so it needs coordinated rewrite, verification, and publication

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the current `import.meta.glob('../../comics/*/*.png')` integration unchanged and only add the new chapter asset folders to the tracked repository state
- write_sets:
  - worker_shared: `src/index.css`
  - worker_shared: `src/context/ThemeContext.tsx`
  - worker_shared: `src/context/UIContext.tsx`
  - worker_shared: `src/components/ui/AppShell.tsx`
  - worker_shared: `src/components/ui/desktopVerseLayout.ts`
  - worker_shared: `src/components/ui/SidebarLayout.tsx`
  - worker_shared: `src/components/ui/SidebarMenu.tsx`
  - worker_shared: `src/components/ui/GlassCard.tsx`
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/components/Sidebar.tsx`
  - worker_shared: `src/components/ThemeToggle.tsx`
  - worker_shared: `src/components/ChapterVerseSelector.tsx`
  - worker_shared: `src/components/SidebarLayout.tsx`
  - worker_shared: `src/components/SidebarMenu.tsx`
  - worker_shared: `package.json`
  - worker_shared: `package-lock.json`
  - worker_feature: `src/App.tsx`
  - worker_feature: `src/pages/ChapterList.tsx`
  - worker_feature: `src/pages/VerseView.tsx`
  - worker_feature: `src/components/VerseCommentary.tsx`

Reviewer
- reviewer: reviewer-pending

Last Update
- time: 2026-05-27 10:14 KST
- note: scope expanded to theme, shell, sidebar, and persistence behavior while keeping data and comic assets untouched
