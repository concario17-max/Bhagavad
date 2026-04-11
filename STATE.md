Current Task
- task: shrink the Sanskrit text size in the verse primary card
- phase: completed
- scope: change the Sanskrit line in the verse primary card to text-[13px] sm:text-[14px] without altering the rest of the layout

Route
- route: Route A
- reason: the requested change is a one-file typography tweak in the verse primary card

Writer Slot
- main: active
- writer: `src/components/verse/VersePrimaryCard.tsx`

Contract Freeze
- freeze: change the Sanskrit line in the verse primary card to text-[13px] sm:text-[14px] and keep the rest of the layout unchanged
- write_sets:
  - writer: `src/components/verse/VersePrimaryCard.tsx`

Reviewer
- reviewer: pending

Last Update
- time: 2026-04-12 00:00 KST
- note: Sanskrit text reduced to 13px/14px and build passed
