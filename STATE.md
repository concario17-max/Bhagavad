Current Task
- task: move the deep-dive toggle from the right panel into the header
- phase: completed
- scope: keep the right-panel content switch between commentary and deep-dive, but render the `심화` toggle in the header instead of inside the right panel, and keep the left translations-only layout intact

Route
- route: Route B
- reason: the toggle location change requires shared state between the header and verse panel across multiple files

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: move the `심화` toggle UI into the header, keep the right panel driven by shared mode state, preserve the translations-only left panel, and leave comic/commentary behavior unchanged unless needed for the new shared state
- write_sets:
  - worker_shared: `src/context/UIContext.tsx`, `src/components/Header.tsx`
  - worker_feature: `src/pages/VerseView.tsx`, `src/components/verse/VerseDeepDivePanel.tsx`, `src/components/VerseCommentary.tsx` if the old toggle needs removal

Reviewer
- reviewer: Mencius

Last Update
- time: 2026-05-21 16:40 KST
- note: header-hosted deep-dive toggle completed and build verified successfully
