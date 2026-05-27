Current Task
- task: redesign the verse header controls to match the requested button-based layout
- phase: implementation
- scope: keep the existing data flow and navigation behavior, but restyle the header controls into the compact button/chip layout shown in the mockups

Route
- route: Route B
- reason: the change touches the sticky header and selector controls across multiple files, so it needs coordinated implementation and verification

Writer Slot
- main: active
- writer: `main` planner

Contract Freeze
- freeze: keep the existing data flow, navigation behavior, and commentary/deep-dive logic intact while adjusting only the header presentation and control grouping
- write_sets:
  - worker_shared: `src/components/Header.tsx`
  - worker_shared: `src/components/ChapterVerseSelector.tsx`
  - worker_shared: `src/index.css`

Reviewer
- reviewer: Arendt

Last Update
- time: 2026-05-27 13:42 KST
- note: compact header chips implemented; chapter change now routes immediately, and build plus e2e passed
