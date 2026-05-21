Current Task
- task: fix mobile comic panel scrolling
- phase: implementation
- scope: let the right commentary panel scroll long comic images on mobile so the content is not clipped

Route
- route: Route A
- reason: the requested change is a small one-file layout tweak in the mobile side panel wrapper

Writer Slot
- main: active
- writer: `src/components/VerseSidePanel.tsx`

Contract Freeze
- freeze: keep the left body unchanged and make the right commentary panel scrollable on mobile so long comic images can be viewed fully
- write_sets:
  - writer: `src/components/VerseSidePanel.tsx`

Reviewer
- reviewer: pending

Last Update
- time: 2026-05-21 00:00 KST
- note: added overflow scrolling to the mobile side panel wrapper
