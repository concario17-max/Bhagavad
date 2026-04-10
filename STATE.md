Current Task
- task: remove date-tagged source/meta residue from imported commentary
- phase: completed
- scope: remove date-tagged commentary residue across all imported chapters, harden the import filter, and add a save-time cleanup pass so stored data does not keep the residue

Route
- route: Route B
- reason: touches shared asset data plus the import script across multiple directories and requires verification, so it exceeds Route A limits in this workspace

Writer Slot
- main: planner-only
- worker_shared: `scripts/import_commentary_from_odt.ps1`, `public/gita.json`

Contract Freeze
- freeze: remove date-tagged residue from commentary and harden the import filter against those variants, including reference-section headings and bibliography-like lines in saved commentary
- write_sets:
  - worker_shared: `scripts/import_commentary_from_odt.ps1`, `public/gita.json`
  - split_note: one worker is required because all cleanup converges on the same shared files

Reviewer
- reviewer: Avicenna (`019d74d4-555b-7f31-931b-56682c39f8f3`)

Last Update
- time: 2026-04-10 10:15 KST
- note: worker reran chapter 18 import to trigger global saved-data cleanup, local regex audit reached zero date-tag matches, and reviewer reported no blocking findings
