Current Task
- task: move the word-by-word section into the primary verse card
- phase: completed
- scope: embed the word-by-word section inside the primary verse card and remove the separate outer section from the verse reader layout

Route
- route: Route B
- reason: the requested change spans the verse reader page and the primary verse component, so it needs coordinated multi-file layout work

Writer Slot
- main: planner-only
- worker_layout: `src/pages/VerseView.tsx`, `src/components/verse/VersePrimaryCard.tsx`, `src/components/verse/VerseLexiconSection.tsx`

Contract Freeze
- freeze: render the word-by-word section inside the primary verse card, remove the separate outer word-by-word block from the verse reader page, and keep the existing collapse behavior and content styling intact
- write_sets:
  - worker_layout: `src/pages/VerseView.tsx`, `src/components/verse/VersePrimaryCard.tsx`, `src/components/verse/VerseLexiconSection.tsx`

Reviewer
- reviewer: Ptolemy (`019d7d3c-2ad7-7361-aa9b-4b75d35e339f`)

Last Update
- time: 2026-04-12 00:00 KST
- note: word-by-word section moved inside the primary verse card and reviewer found no blockers
