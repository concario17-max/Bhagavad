Current Task
- task: implement comic-first mode toggle in VerseCommentary only
- phase: completed
- scope: make the right commentary panel default to comic mode when a matched comic exists, fall back to commentary when no comic exists, remember the choice per verse in localStorage, and remove debug diagnostics from the UI

Route
- route: Route A
- reason: the implementation is now confined to a single-file slice in VerseCommentary.tsx with one direct verification pass

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the left body unchanged, default the right panel to comic when a matched comic image exists, fall back to commentary when comic is unavailable, persist the user's choice per verse in localStorage, and remove all debug diagnostics from the UI
- write_sets:
  - main: `src/components/VerseCommentary.tsx`

Reviewer
- reviewer: none

Last Update
- time: 2026-05-21 00:00 KST
- note: comic-first VerseCommentary toggle implemented and production build passed
