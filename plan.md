# Bhagavad Implementation Plan

Updated: 2026-03-18
Workspace: `C:\Users\roadsea\Desktop\nagham`

## Historical Work

- [x] P0. Encoding normalization
- [x] P1. Shared verse resolution logic
- [x] P2. Commentary display consolidation
- [x] P3. Shared chapter metadata
- [x] P4. Centralized local storage helpers
- [x] P5. Authentication review and removal path

## 2026-03-18 Improvement TODO

### T0. Internal naming alignment

- [x] Rename remaining `Reflections`-style component and state names to `Notes`
- [x] Rename `UIContext` right-panel state to `isNotesOpen`, `isDesktopNotesOpen`, and `toggleNotesPanel`
- [x] Replace file-level `Reflections` components with `NotesPanel` and `NotesModal`
- [x] Keep legacy desktop storage migration for `gita-desktop-reflections`
- [x] Preserve behavior while cleaning names

### T1. Notes data and export naming

- [x] Rename note storage APIs to `getNote`, `setNote`, and `getAllNotes`
- [x] Rename note type to `StoredNote`
- [x] Align note export copy and filenames with `Notes`
- [x] Verify `Notes` wording across home modal and right panel entry points

### T2. Right panel state structure

- [x] Keep `commentary` as the default active right panel mode
- [x] Confirm forced-open toggle behavior through `toggleNotesPanel(true)`
- [x] Keep identical width rules for `Notes` and `Commentary`
- [x] Keep expansion behavior identical when the left chapter panel closes

### T3. Content integrity review

- [x] Re-check translation coverage in `public/gita.json`
- [x] Re-check `lexicon.json` structural integrity
- [x] Confirm translation label policy stays fixed as `ENGLISH / HAM / GIL / MYUNG / SUK`
- [x] Document incomplete `SUK` coverage instead of hiding it silently

### T4. Commentary rule audit

- [x] Audit `commentary_en` values across the source dataset
- [x] Confirm empty commentary states mainly come from source data
- [x] Refine commentary visibility rules to hide metadata-only stubs
- [x] Update placeholder copy to reflect actual source-data limitations

### T5. UI and layout closing pass

- [x] Keep left panel at real `30% / 70%` height split
- [x] Keep tightened verse header spacing
- [x] Keep removal of non-essential helper copy above verse content
- [x] Keep parity between `Notes` and `Commentary` sizing rules

### T6. Documentation and maintenance

- [x] Rewrite `research.md` to match the current codebase
- [x] Update `plan.md` with completed implementation status
- [x] Refresh release documentation to match the no-password flow and `Notes` naming

## Validation

- [x] `npx tsc --noEmit`
- [x] `npm run build`

## Outcome

The remaining 2026-03-18 cleanup work is complete.
The codebase now uses `Notes` terminology consistently in implementation and documentation, commentary behavior matches the actual source data, and the current plan items are fully closed.
