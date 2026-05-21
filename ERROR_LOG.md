## 2026-05-21
- time: 2026-05-21 15:38 KST
- location: verification -> `cmd /c npm run test:e2e`
- summary: e2e validation failed on a missing commentary-panel toggle
- details: after the router redirect change, the e2e run timed out waiting for `hide commentary panel`; the current app does not appear to render that button, so the test expectations and UI are out of sync.
- status: resolved

## 2026-05-21
- time: 2026-05-21 15:52 KST
- location: verification -> `npm run test:e2e`
- summary: e2e expectations no longer matched the current reader UI
- details: the old test waited for home-page and commentary-panel toggle controls that are not present in the current route flow; the test was updated to verify the redirect and chapter/verse selector navigation instead.
- status: resolved

## 2026-05-21
- time: 2026-05-21 15:41 KST
- location: verification -> `npm run build`
- summary: PowerShell execution policy blocked the initial build command
- details: `npm run build` failed once because `npm.ps1` was blocked by the local execution policy; the build will be rerun through `npm.cmd`.
- status: resolved

## 2026-04-06
- time: 2026-04-06 17:34 KST
- location: scripts/import_commentary_from_odt.ps1 -> public/gita.json
- summary: chapter 8 import hit a transient write lock
- details: `WriteAllText` failed once with "user-mapped section open" while writing `public/gita.json` during the chapter 8 import; the same import succeeded on retry and chapters 7-9 were verified afterward.
- status: resolved

## 2026-04-10
- time: 2026-04-10 16:45 KST
- location: verification -> `npm run build`
- summary: PowerShell execution policy blocked the initial build command
- details: `npm run build` failed once because `npm.ps1` was blocked by the local execution policy; the build was rerun successfully with `cmd /c npm run build`.
- status: resolved

- time: 2026-04-11 11:45 KST
- location: verification -> `npx tsc --noEmit`, `npm run build`
- summary: PowerShell execution policy blocked the initial verification commands
- details: `npx tsc --noEmit` and `npm run build` failed once because `npx.ps1` and `npm.ps1` were blocked by the local execution policy; both commands were rerun successfully through `cmd /c`.
- status: resolved

- time: 2026-04-10 00:00 KST
- location: scripts/import_commentary_from_odt.ps1 -> public/gita.json
- summary: chapter 3 reimport stopped on verse-block count mismatch
- details: after adding summary-heading preservation for `h` nodes, the chapter 3 ODT reimport returned 40 imported blocks for 41 verses, so the chapter was not rewritten during the bulk refresh.
- status: deferred

## 2026-04-12
- time: 2026-04-12 00:00 KST
- location: verification -> `npx tsc --noEmit`
- summary: PowerShell execution policy blocked the initial typecheck command
- details: `npx tsc --noEmit` failed once because `npx.ps1` was blocked by the local execution policy; the check will be rerun through the `.cmd` binary.
- status: resolved
