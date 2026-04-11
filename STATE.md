Current Task
- task: compact the embedded word-by-word section
- phase: completed
- scope: shrink the word-by-word area inside the primary verse card so it reads closer to the primary verse block without changing the collapse behavior

Route
- route: Route B
- reason: the requested change still spans the verse reader page and the embedded lexicon component, so it needs coordinated multi-file layout work

Writer Slot
- main: planner-only
- worker_layout: `src/components/verse/VerseLexiconSection.tsx`, `src/components/verse/VersePrimaryCard.tsx`

Contract Freeze
- freeze: reduce the embedded word-by-word section width, grid density, and padding so it fits the primary verse card more tightly while keeping the existing collapse behavior and content styling intact
- write_sets:
  - worker_layout: `src/components/verse/VerseLexiconSection.tsx`, `src/components/verse/VersePrimaryCard.tsx`

Reviewer
- reviewer: Goodall (`019d7d40-f1b1-7e03-8fa1-e4a7a681a208`)

Last Update
- time: 2026-04-12 00:00 KST
- note: embedded word-by-word section compacted and reviewed with no blockers
