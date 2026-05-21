Current Task
- task: move translations to the left panel and add a right-panel deep-dive toggle
- phase: completed
- scope: keep ENGLISH and HAM on the left, move the remaining verse-reading content into the right panel, add a top-bar toggle labeled `심화` to switch the right panel between commentary and deep-dive, and remove the breadcrumb line `Home / Chapter 1, Verse 1`

Route
- route: Route B
- reason: the requested layout split spans multiple shared UI files and needs coordinated changes across the verse page and the right-panel renderer

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: left panel shows only the readable translation blocks, right panel toggles between commentary and a deep-dive view containing the moved verse-reading content, the breadcrumb is removed, and the existing comic/commentary toggle behavior stays intact unless the new layout requires a minimal compatibility adjustment
- write_sets:
  - worker_left: `src/pages/VerseView.tsx`, `src/components/verse/VerseTranslationsSection.tsx`, `src/components/verse/VerseBreadcrumb.tsx`
  - worker_right: `src/components/VerseCommentary.tsx`, `src/components/verse/VersePrimaryCard.tsx`, `src/components/verse/VerseAudioPlayer.tsx`, `src/components/verse/VerseNavigationFooter.tsx`, `src/components/verse/VerseLexiconSection.tsx`, `src/components/verse/VerseDeepDivePanel.tsx` if needed

Reviewer
- reviewer: main-review

Last Update
- time: 2026-05-21 16:08 KST
- note: layout split completed and build verified successfully
