# Bhagavad Implementation Plan

Updated: 2026-03-20
Workspace: `C:\Users\roadsea\Desktop\nagham`

## Historical Work

- [x] P0. Encoding normalization
- [x] P1. Shared verse resolution logic
- [x] P2. Commentary display consolidation
- [x] P3. Shared chapter metadata
- [x] P4. Centralized local storage helpers
- [x] P5. Authentication review and removal path
- [x] P6. Desktop verse frame alignment
- [x] P7. Notes UI removal
- [x] P8. Korean readability font update
- [x] P9. Research report refresh

## 2026-03-20 Problem-Fix TODO

### T0. Reader architecture decomposition

Goal:
Reduce the size and responsibility concentration of `src/pages/VerseView.tsx`.

- [x] Audit `VerseView.tsx` and split responsibilities into explicit sub-sections
- [x] Extract verse header / breadcrumb block into a dedicated component
- [x] Extract verse text card into a dedicated component
- [x] Extract audio player UI/state handling into a dedicated component
- [x] Extract translation section rendering into a dedicated component
- [x] Keep current UX and spacing identical during refactor
- [x] Re-run route navigation checks after extraction

### T1. Shared verse-data ownership cleanup

Goal:
Avoid repeated verse data reads across `VerseView`, `Sidebar`, and `VerseCommentary`.

- [x] Map which components currently fetch `gita.json` independently
- [x] Decide the cleanest ownership model for verse/chapter data at route level
- [x] Pass current verse data to commentary instead of re-fetching inside `VerseCommentary`
- [x] Evaluate whether sidebar chapter data should consume cached route-level data or stay independent
- [x] Preserve lazy loading and avoid introducing unnecessary rerenders
- [x] Verify commentary open/close behavior still matches current UX

### T2. Runtime error-handling cleanup

Goal:
Replace scattered `console.error` / `console.warn` usage with cleaner runtime handling.

- [x] Inventory all remaining runtime `console.error` and `console.warn` calls in `src/`
- [x] Separate expected content-miss states from true runtime failures
- [x] Remove global error noise in `src/main.tsx` if it is no longer needed
- [x] Replace fetch failure logging with a minimal centralized strategy
- [x] Keep debugging signal for development without shipping noisy runtime logs
- [x] Re-check all data-loading branches after cleanup

### T3. Encoding and text-integrity pass

Goal:
Remove mojibake-style comments and suspicious corrupted text traces in source files.

- [x] Audit source comments and UI literals for broken encoding artifacts
- [x] Fix corrupted comment blocks in shared UI files first
- [x] Confirm visible Sanskrit / Korean / transliteration text remains intact after any encoding-safe rewrite
- [x] Re-check generated lexicon normalization patterns for corrupted character handling
- [x] Verify no user-facing text regresses during cleanup

### T4. Commentary product strategy handling

Goal:
Handle the current reality that commentary data is structurally present but effectively unusable.

- [x] Decide whether the right panel should stay permanently available with empty-state messaging
- [x] Evaluate hiding the commentary toggle when a verse has no displayable commentary
- [x] If keeping the toggle visible, improve the empty-state to explain the source limitation more helpfully
- [x] Audit whether a future alternate commentary source can plug into the same UI contract
- [x] Ensure any UX change still works in desktop and mobile panel modes

### T5. Test baseline introduction

Goal:
Add the first real app-level verification layer to a repo that currently has no source tests.

- [x] Define the minimum testing stack for this repo
- [x] Add at least one route-level render test for home and verse pages
- [x] Add unit coverage for `getDesktopVerseColumns()`
- [x] Add unit coverage for `resolveVerse()` and `getVerseRange()`
- [x] Add unit coverage for `isDisplayableCommentary()`
- [x] Add an end-to-end smoke flow for chapter -> verse -> commentary toggle
- [x] Add test commands to `package.json`

### T6. Unused-code and dependency pruning

Goal:
Remove dead weight and align the repository with actual runtime usage.

- [x] Confirm whether `src/components/Footer.tsx` is truly unused
- [x] Remove `Footer.tsx` if it has no active integration path
- [x] Confirm `framer-motion` is no longer referenced anywhere in tracked source
- [x] Remove unused dependency entries only after a successful build and test pass
- [x] Re-check bundle output after dependency cleanup

### T7. Documentation drift prevention

Goal:
Keep research and planning docs aligned with actual runtime state.

- [x] Update `release-checklist.md` to match current post-Notes behavior
- [x] Add a small maintenance checklist for refreshing `research.md` after structural changes
- [x] Add a small maintenance checklist for refreshing `plan.md` after each completed tranche
- [x] Decide whether `reuse-guide.md` should be tracked or moved elsewhere
- [x] Decide whether `.agents/` should stay untracked or be formalized

### T8. Data pipeline clarity

Goal:
Make the content-generation side of the repo easier to understand and maintain.

- [x] Document which root `.txt` and `.md` source files feed which JSON fields
- [x] Document the intended order of cleanup / extraction / merge scripts
- [x] Audit root-level update scripts for overlapping or obsolete behavior
- [x] Decide whether the data-prep scripts should be consolidated under `scripts/`
- [x] Add a reproducible content-refresh procedure

## Execution Status

- [x] Phase 1. T3 encoding cleanup
- [x] Phase 2. T2 runtime logging cleanup
- [x] Phase 3. T0 reader decomposition
- [x] Phase 4. T1 shared verse-data ownership cleanup
- [x] Phase 5. T4 commentary UX decision
- [x] Phase 6. T5 test baseline introduction
- [x] Phase 7. T6 unused-code and dependency pruning
- [x] Phase 8. T7 and T8 documentation / pipeline cleanup

## Validation Targets

- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] source test suite
- [x] route smoke verification for `/` and `/chapter/:chapterNum/verse/:verseNum`
- [x] desktop frame verification for all four states
- [x] mobile drawer regression check

## Current Status

This implementation tranche is complete.
The plan now reflects shipped work rather than future-only backlog.
