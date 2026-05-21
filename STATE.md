Current Task
- task: sync comics 2-5 folders with verse comic mapping
- phase: completed
- scope: ensure the new comics/2 through comics/5 assets are tracked and resolve correctly in the right-panel comic toggle flow

Route
- route: Route B
- reason: the scope touches shared comic assets across multiple chapter folders and needs verification of image resolution before any implementation writes

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: update the comics asset set for chapter folders 2 through 5, keep the existing comic lookup flow intact if it already resolves those folders, and verify the mapped images load correctly for the new folders
- write_sets:
  - worker_shared: `comics/2`, `comics/3`, `comics/4`, `comics/5`
  - worker_feature: `src/components/VerseCommentary.tsx` if a code-path fix is required by verification

Reviewer
- reviewer: Huygens

Last Update
- time: 2026-05-21 00:00 KST
- note: comics 2-5 are already covered by the glob mapping; asset tracking is the remaining sync step
