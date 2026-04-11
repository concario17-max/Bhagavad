Current Task
- task: remove interstitial prose between commentary titles and core-keyword blocks
- phase: completed
- scope: identify and remove the five remaining verses where a prose line appears between the title and the `핵심 키워드` block, and harden the importer so the pattern does not recur

Route
- route: Route B
- reason: the fix touches both the shared commentary JSON and the import script, and it needs a data scan plus importer hardening across multiple files

Writer Slot
- main: planner-only
- worker_shared: `public/gita.json`
- worker_importer: `scripts/import_commentary_from_odt.ps1`

Contract Freeze
- freeze: remove the interstitial prose lines from the five identified verses in `public/gita.json`, and update the importer so title-to-keyword blocks stay adjacent without reintroducing metadata or apology lines
- write_sets:
  - worker_shared: `public/gita.json`
  - worker_importer: `scripts/import_commentary_from_odt.ps1`

Reviewer
- reviewer: Einstein (`019d7657-aaae-7461-9691-6fd01db59246`)

Last Update
- time: 2026-04-11 00:00 KST
- note: five interstitial prose lines removed, importer normalized, scan/build/review passed
