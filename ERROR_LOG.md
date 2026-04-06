## 2026-04-06
- time: 2026-04-06 17:34 KST
- location: scripts/import_commentary_from_odt.ps1 -> public/gita.json
- summary: chapter 8 import hit a transient write lock
- details: `WriteAllText` failed once with "user-mapped section open" while writing `public/gita.json` during the chapter 8 import; the same import succeeded on retry and chapters 7-9 were verified afterward.
- status: resolved
