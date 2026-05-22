Current Task
- task: sync comics folders 6 through 8 into the repository
- phase: implementation
- scope: add the new `comics/6`, `comics/7`, and `comics/8` image assets so the existing comic glob picks them up without code changes

Route
- route: Route B
- reason: the change spans shared asset directories with multiple new files, so it needs coordinated verification and repo publication

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the current `import.meta.glob('../../comics/*/*.png')` integration unchanged and only add the new chapter asset folders to the tracked repository state
- write_sets:
  - worker_shared: `comics/6`
  - worker_shared: `comics/7`
  - worker_shared: `comics/8`

Reviewer
- reviewer: reviewer-pending

Last Update
- time: 2026-05-22 00:00 KST
- note: comics asset sync verified and queued for commit/push
