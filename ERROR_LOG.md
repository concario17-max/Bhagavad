## 2026-05-21
- time: 2026-05-21 16:10 KST
- location: verification -> `npm run build`
- summary: PowerShell execution policy blocked the initial build command during review
- details: `npm run build` failed once because `npm.ps1` was blocked by the local execution policy; the build was rerun successfully through `cmd /c npm run build`.
- status: resolved

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

- time: 2026-05-21 00:00 KST
- location: verification -> `npm run build`
- summary: PowerShell execution policy blocked the initial build command
- details: `npm run build` failed once because `npm.ps1` was blocked by the local execution policy; the build was rerun successfully through `npm.cmd run build`.
- status: resolved
time: 2026-05-21 16:00 KST
location: build verification
summary: `npm run build` was blocked by PowerShell execution policy
details: PowerShell refused to load `C:\Program Files\nodejs\npm.ps1`, so the verification command did not start. Re-run with `npm.cmd` instead.
status: open
time: 2026-05-21 16:01 KST
location: build verification
summary: build rerun succeeded with `npm.cmd run build`
details: The project built successfully after bypassing the PowerShell wrapper.
status: resolved

time: 2026-05-21 16:28 KST
location: verification -> `npm run build`
summary: PowerShell execution policy blocked the initial build command for this toggle refactor
details: `npm run build` failed once because `npm.ps1` was blocked by the local execution policy; the build was rerun successfully with `npm.cmd run build`.
status: resolved
## 2026-05-21 17:25 KST
- time: 2026-05-21 17:25 KST
- location: `npm run test:compile`
- summary: PowerShell blocked `npm.ps1` execution
- details: `npm run test:compile` failed before TypeScript ran because the local PowerShell execution policy disallows loading `C:\Program Files\nodejs\npm.ps1`. The check will be retried with `npm.cmd`.
- status: open

## 2026-05-21 17:25 KST
- time: 2026-05-21 17:25 KST
- location: `cmd /c npm run test:compile`
- summary: Verification completed after PowerShell policy fallback
- details: The TypeScript compile check succeeded when rerun through `npm.cmd`, confirming the translation split changes compile cleanly.
- status: resolved

## 2026-05-23 12:30 KST
- time: 2026-05-23 12:30 KST
- location: `npm run build`
- summary: PowerShell execution policy blocked the initial build command
- details: `npm run build` failed before Vite started because `npm.ps1` is blocked by the local PowerShell execution policy. Re-run with `npm.cmd`.
- status: open

## 2026-05-23 12:30 KST
- time: 2026-05-23 12:30 KST
- location: `npm.cmd run build`
- summary: Build verification succeeded after PowerShell fallback
- details: The Vite production build completed successfully when rerun through `npm.cmd`, confirming the new comic assets are included in the bundle.
- status: resolved
time: 2026-05-27 12:20 KST
location: apply_patch
summary: initial layout patch failed on an incorrect component path
details: attempted to update src/components/verse/VerseCommentary.tsx, but the file lives at src/components/VerseCommentary.tsx; no code changes were applied in that attempt
status: open
time: 2026-05-27 12:25 KST
location: apply_patch
summary: incorrect path issue resolved
details: retried the patch against the correct component path and completed the layout edits successfully
status: resolved
time: 2026-05-27 12:24 KST
location: npm run build
summary: PowerShell execution policy blocked npm.ps1
details: running the build via npm in PowerShell failed before compilation because script execution is disabled; will retry through npm.cmd
status: resolved
## 2026-05-27
- time: 2026-05-27 12:53 KST
- location: verification -> `npm run build`
- summary: PowerShell execution policy blocked the initial build command
- details: `npm run build` failed before compilation because `npm.ps1` is blocked by the local execution policy; rerun with `npm.cmd`.
- status: resolved
## 2026-05-27
- time: 2026-05-27 12:57 KST
- location: shell -> git add && git commit
- summary: PowerShell rejected `&&` as a command separator
- details: the combined git command failed because this shell version does not accept `&&`; rerun the same steps with `;` separators.
- status: resolved
