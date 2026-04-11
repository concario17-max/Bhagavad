Current Task
- task: increase the Sanskrit text size in the verse primary card
- phase: completed
- scope: raise the Sanskrit line by 2px in the verse primary card without changing the rest of the typography

Route
- route: Route A
- reason: the requested change is a one-file typography tweak in the verse primary card

Writer Slot
- main: active
- writer: `src/components/verse/VersePrimaryCard.tsx`

Contract Freeze
- freeze: raise the Sanskrit line from 13px/14px to 15px/16px while keeping the rest of the layout unchanged
- write_sets:
  - writer: `src/components/verse/VersePrimaryCard.tsx`

Reviewer
- reviewer: pending

Last Update
- time: 2026-04-12 00:00 KST
- note: Sanskrit text increased to 15px/16px and build passed
