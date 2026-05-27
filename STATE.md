Current Task
- task: restore desktop verse layout to a two-column composition while keeping the centered canvas feel
- phase: implementation
- scope: keep the sticky header and centered max-w canvas, but bring back a desktop two-column verse composition for wider screens while preserving the mobile one-column stack

Route
- route: Route B
- reason: the change touches the verse page and shared reading components across multiple files, so it needs coordinated implementation and verification

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing data flow, navigation behavior, and commentary/deep-dive logic intact while adjusting only the desktop layout composition
- write_sets:
  - worker_shared: `src/pages/VerseView.tsx`
  - worker_shared: `src/components/VerseCommentary.tsx`
  - worker_shared: `src/components/verse/VerseDeepDivePanel.tsx`
  - worker_shared: `src/components/verse/VerseTranslationsSection.tsx`
  - worker_shared: `src/components/verse/VersePrimaryCard.tsx`
  - worker_shared: `src/components/verse/VerseAudioPlayer.tsx`
  - worker_shared: `src/index.css`

Reviewer
- reviewer: visual check passed

Last Update
- time: 2026-05-27 12:24 KST
- note: desktop two-column composition restored inside the centered canvas; mobile remains one-column
