Current Task
- task: rename 학습만화 folder to comics and update comic image references
- phase: completed
- scope: move the comic asset folder to `comics`, update the glob and any path references, and verify the chapter image mapping still resolves correctly

Route
- route: Route B
- reason: the scope touches asset paths and at least one implementation file, so it needs a frozen contract and delegated implementation

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: rename the comic asset folder to `comics`, update the comic glob/path logic to match, keep the reader behavior unchanged, and verify chapter 1 still resolves the expected comic images
- write_sets:
  - worker: `src/components/VerseCommentary.tsx`, `학습만화 -> comics`

Reviewer
- reviewer: Volta

Last Update
- time: 2026-05-21 00:00 KST
- note: comic asset folder rename completed; comics folder and path logic are aligned and build passed
