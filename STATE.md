Current Task
- task: normalize remaining question-mark placeholders in `public/gita.json`
- phase: completed
- scope: remove or normalize all remaining `??` placeholder patterns in commentary text across chapters 5, 10, 11, 13, 14, 15, and 18 while preserving valid Korean punctuation and bullets

Route
- route: Route B
- reason: the remaining placeholder cleanup spans 258 hits across many verses in the shared commentary JSON, so it is no longer a tight single-file hotfix

Writer Slot
- main: planner-only
- worker_shared: `public/gita.json`

Contract Freeze
- freeze: remove or normalize all remaining `??` placeholder patterns in `public/gita.json` without changing the intended commentary structure or the summary headings already fixed
- write_sets:
  - worker_shared: `public/gita.json`

Reviewer
- reviewer: Einstein (`019d7657-aaae-7461-9691-6fd01db59246`)

Last Update
- time: 2026-04-10 16:54 KST
- note: remaining placeholder cleanup completed; scan is 0 and build passed
