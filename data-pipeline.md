# Bhagavad Data Pipeline

Updated: 2026-03-20
Workspace: `C:\Users\roadsea\Desktop\nagham`

## 1. Source File Mapping

The runtime JSON file is [public/gita.json](C:/Users/roadsea/Desktop/nagham/public/gita.json).

The current root source files map to runtime fields like this:

- `1.han bal-1.txt` -> `korean_pronunciation`
  Preferred updater: `scripts/update_korean_pronunciation.js`
- `3.eng.txt` -> `translation_en`
  Raw-text extractor: `scripts/extract_local_translation.js`
- `translation_en.md` -> `translation_en`
  Markdown cleanup and extractor path:
  `scripts/clean_en_md.js`, `scripts/patch_en.js`, `scripts/extract_en_md.js`
- `4.ham.txt` -> `translation_ham`
  Updater: `scripts/extract_4_5_translation.js`
- `5.gil.txt` -> `translation_gil`
  Updater: `scripts/extract_4_5_translation.js`
- `6.jimong.txt` -> `translation_jimong`
  Updater: `update_jimong.cjs`
- `7.suk.txt` -> `translation_suk`
  Updater: `update_suk.cjs`
- `public/gita.json` word entries -> `public/lexicon.json`
  Generator: `scripts/generate_lexicon.js`

`2.dan.txt` was not found in the active maintained update path during this audit and should be treated as a legacy or manual reference input until its consumer is formalized.

## 2. Script Roles

### Active maintained path

- `scripts/update_korean_pronunciation.js`
- `scripts/extract_en_md.js`
- `scripts/extract_4_5_translation.js`
- `update_jimong.cjs`
- `update_suk.cjs`
- `scripts/generate_lexicon.js`
- validation helpers in `scripts/check_*.js`

### Overlapping or legacy-looking paths

- `scripts/update_pronunciation.js`
  Overlaps with `scripts/update_korean_pronunciation.js`
- `scripts/extract_local_translation.js`
  Older English-text path from `3.eng.txt`
- `scripts/extract_english_translation.js`
- `scripts/extract_github_translation.js`

Recommended interpretation:

- prefer the local markdown-driven English path first
- keep `3.eng.txt` extraction as a fallback recovery path
- treat GitHub/raw extraction helpers as historical or one-off tooling unless they are revalidated

## 3. Recommended Refresh Order

When refreshing content, use this order:

1. update pronunciation / Korean reading text
2. update English translations
3. update `HAM` and `GIL`
4. update `MYUNG`
5. update `SUK`
6. run cleanup/standardization scripts only if the new source files require them
7. regenerate the lexicon
8. run media and sequence validation
9. run app validation (`typecheck`, `build`, `tests`)

## 4. Reproducible Content Refresh Procedure

Suggested local runbook:

1. Back up `public/gita.json`.
2. Run `node scripts/update_korean_pronunciation.js`.
3. If English source of truth is markdown, run:
   `node scripts/clean_en_md.js`
   `node scripts/patch_en.js`
   `node scripts/extract_en_md.js`
4. If English needs to be rebuilt from the raw text instead, run:
   `node scripts/extract_local_translation.js`
5. Run `node scripts/extract_4_5_translation.js`.
6. Run `node update_jimong.cjs`.
7. Run `node update_suk.cjs`.
8. If formatting drift appears, apply only the cleanup scripts needed for that field set.
9. Run `node scripts/generate_lexicon.js`.
10. Run:
    `node scripts/check_mp3.js`
    `node scripts/check_sequence.js`
    `node scripts/check_unused_mp3.js`
11. Run:
    `npx tsc --noEmit`
    `npm run build`
    `npm run test:unit`
    Playwright smoke verification through `tests/run-e2e.ts`

## 5. Consolidation Decision

Decision for now:

- keep active content-prep logic inside `scripts/` where possible
- allow `update_jimong.cjs` and `update_suk.cjs` to remain at the repo root until they are migrated without changing behavior

Reason:

- they still represent the clearest current merge logic for their source files
- moving them without functional tests for the content pipeline would add risk for little immediate product value

## 6. Maintenance Rule

If any root source file, extraction script, or field ownership changes:

- update this document
- update `research.md`
- re-run the validation steps at the end of the refresh procedure
