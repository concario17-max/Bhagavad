# Bhagavad Gita Project Research Report

Updated: 2026-04-03
Workspace: `C:\Users\roadsea\Desktop\gita`

## 1. Current Product Shape

This repository is a static Bhagavad Gita reading application built with React 19, Vite 7, TypeScript, Tailwind CSS v4, and `react-router-dom` 7.

Runtime content is driven by:

- `public/gita.json`
- `public/lexicon.json`
- `public/mp3/*`

The app has two user-facing screens:

1. chapter home
2. verse reader

Current feature set:

- chapter cards and chapter/verse quick-jump
- responsive verse reader
- desktop three-column reading frame
- mobile left/right drawers
- Sanskrit, IAST, Korean pronunciation, audio, lexicon, translations
- commentary side panel with graceful empty-state handling
- light/dark theme

## 2. Runtime Architecture

### Entry and providers

Entry file: [src/main.tsx](C:/Users/roadsea/Desktop/nagham/src/main.tsx)

Startup order:

1. global CSS
2. `ThemeProvider`
3. `UIProvider`
4. `App`

There is no longer a global browser error listener printing uncaught errors to `console.error`.

### Router and route ownership

Router file: [src/App.tsx](C:/Users/roadsea/Desktop/nagham/src/App.tsx)

Routes:

- `/`
- `/chapter/:chapterNum/verse/:verseNum`

Key architectural change:

- verse routes now mount [src/context/VerseDataContext.tsx](C:/Users/roadsea/Desktop/nagham/src/context/VerseDataContext.tsx)
- route-level verse data is shared by the reader, sidebar, and commentary
- grouped verse aliases still redirect to the stored base verse URL

### Shared verse data

File: [src/context/VerseDataContext.tsx](C:/Users/roadsea/Desktop/nagham/src/context/VerseDataContext.tsx)

Responsibilities:

- load `gita.json` through the shared fetch cache
- resolve grouped verses
- expose chapter, verse, range, status, and commentary availability
- provide a single source of truth for verse-route consumers

This removed the old repeated fetch pattern from `VerseView`, `Sidebar`, and `VerseCommentary`.

### Reader composition

Main reader file: [src/pages/VerseView.tsx](C:/Users/roadsea/Desktop/nagham/src/pages/VerseView.tsx)

The reader is now decomposed into explicit subcomponents:

- [src/components/verse/VerseBreadcrumb.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseBreadcrumb.tsx)
- [src/components/verse/VersePrimaryCard.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VersePrimaryCard.tsx)
- [src/components/verse/VerseAudioPlayer.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseAudioPlayer.tsx)
- [src/components/verse/VerseLexiconSection.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseLexiconSection.tsx)
- [src/components/verse/VerseTranslationsSection.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseTranslationsSection.tsx)
- [src/components/verse/VerseNavigationFooter.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseNavigationFooter.tsx)
- [src/components/verse/VerseMessageState.tsx](C:/Users/roadsea/Desktop/nagham/src/components/verse/VerseMessageState.tsx)

This keeps the same reading flow while removing the original monolithic view structure.

## 3. Layout and UI State

### Shell and desktop frame

Files:

- [src/components/ui/AppShell.tsx](C:/Users/roadsea/Desktop/nagham/src/components/ui/AppShell.tsx)
- [src/components/ui/desktopVerseLayout.ts](C:/Users/roadsea/Desktop/nagham/src/components/ui/desktopVerseLayout.ts)
- [src/components/Header.tsx](C:/Users/roadsea/Desktop/nagham/src/components/Header.tsx)
- [src/components/ui/SidebarLayout.tsx](C:/Users/roadsea/Desktop/nagham/src/components/ui/SidebarLayout.tsx)

Desktop frame rules:

- left open + right open: `20 / 60 / 20`
- left closed + right open: `0 / 60 / 40`
- left open + right closed: `20 / 80 / 0`
- left closed + right closed: `0 / 100 / 0`

Current behavior:

- header aligns to the same frame model
- fake panel gaps from leftover translate state are removed
- the main reading column keeps its own readable inner max width
- side panels expose stable test attributes for width and state verification

### UI state contract

File: [src/context/UIContext.tsx](C:/Users/roadsea/Desktop/nagham/src/context/UIContext.tsx)

Separate state is maintained for:

- mobile left drawer
- mobile right drawer
- desktop left panel
- desktop right panel

That separation still holds after the desktop frame refactor.

## 4. Data Access and Content Logic

### Shared fetch/cache

File: [src/utils/dataFetcher.ts](C:/Users/roadsea/Desktop/nagham/src/utils/dataFetcher.ts)

Behavior:

- in-memory cache
- in-flight promise cache
- retry on failed fetch by clearing the stored promise

### Verse helpers

File: [src/utils/verse.ts](C:/Users/roadsea/Desktop/nagham/src/utils/verse.ts)

Current responsibilities:

- grouped verse resolution
- range label generation
- previous/next verse path generation across chapter boundaries

### Commentary handling

Files:

- [src/components/VerseCommentary.tsx](C:/Users/roadsea/Desktop/nagham/src/components/VerseCommentary.tsx)
- [src/utils/content.ts](C:/Users/roadsea/Desktop/nagham/src/utils/content.ts)

Current product decision:

- keep the commentary toggle visible
- keep the panel available in desktop and mobile layouts
- show a clearer empty-state when the current source payload is not readable

This preserves layout consistency and keeps the UI contract ready for future commentary sources.

## 5. Runtime Error Handling and Text Integrity

### Runtime logging cleanup

`src/` no longer contains scattered `console.warn` / `console.error` runtime noise for expected data-miss cases.

Notable cleanup:

- `storage.ts` now fails silently for storage access exceptions
- home and lexicon loading failures render UI states instead of logging
- the global error listener was removed from `main.tsx`

### Encoding cleanup

Shared UI files and visible literals were normalized:

- broken header icon text fixed
- mojibake comments removed from shared UI components
- lexicon generation punctuation cleanup no longer contains corrupted characters

Some old one-off data-prep scripts still contain historic encoding noise, but the runtime source and the primary maintained paths were cleaned.

## 6. Commentary Reality

The current source data still exposes commentary fields structurally, but practically the dataset is not readable commentary content for end users.

Observed filtered outcome from `gita.json`:

- many entries are dollar-prefixed placeholders
- many entries are Devanagari blocks
- one entry is effectively source metadata
- displayable English commentary remains absent

So the panel behavior is now:

- openable everywhere
- readable when real commentary exists in the future
- explanatory when the current dataset does not support it

## 7. Tests and Verification

The repository now has a real baseline verification layer.

Added files:

- [tests/run-unit.ts](C:/Users/roadsea/Desktop/nagham/tests/run-unit.ts)
- [tests/run-e2e.ts](C:/Users/roadsea/Desktop/nagham/tests/run-e2e.ts)
- [tsconfig.test.json](C:/Users/roadsea/Desktop/nagham/tsconfig.test.json)

Package scripts:

- `npm run test:compile`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run test`

Coverage now includes:

- `getDesktopVerseColumns()`
- `resolveVerse()`
- `getVerseRange()`
- `isDisplayableCommentary()`
- home route render
- direct verse route render
- desktop 4-state frame verification
- mobile left/right drawer smoke
- commentary toggle smoke

Validated during this implementation:

- `npx tsc --noEmit`
- `npm run build`
- `npm run test:unit`
- Playwright smoke flow via compiled `tests/run-e2e.ts`

## 8. Dependency and Repo Hygiene

Current runtime dependencies:

- `react`
- `react-dom`
- `react-router-dom`
- `lucide-react`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `vite`

Changes completed:

- removed unused `framer-motion`
- removed unused [src/components/Footer.tsx](C:/Users/roadsea/Desktop/nagham/src/components/Footer.tsx)

Current tracked cleanup outcome:

- no runtime Notes system
- no unused footer component
- no unused animation dependency

## 9. Documentation and Workflow Decisions

Files updated as part of this tranche:

- [plan.md](C:/Users/roadsea/Desktop/nagham/plan.md)
- [release-checklist.md](C:/Users/roadsea/Desktop/nagham/release-checklist.md)
- [research.md](C:/Users/roadsea/Desktop/nagham/research.md)
- [data-pipeline.md](C:/Users/roadsea/Desktop/nagham/data-pipeline.md)

Decision on local workflow files:

- `reuse-guide.md` remains an untracked local workflow reference
- `.agents/` remains an untracked local operator/agent configuration folder

Reason:

- neither file set affects runtime
- they are environment-specific working aids, not required application source

## 10. Content Pipeline Reference

Detailed source-to-JSON notes now live in:

- [data-pipeline.md](C:/Users/roadsea/Desktop/nagham/data-pipeline.md)

That document covers:

- root text/markdown source mapping
- active vs overlapping scripts
- recommended refresh order
- reproducible content refresh checklist

## 11. Final Assessment

The project now has a cleaner runtime architecture than the version described in the previous report:

- reader responsibilities are split
- verse data ownership is centralized
- desktop/mobile panel logic is cleaner
- runtime logging noise is removed
- commentary UX is honest about source limitations
- tests exist and exercise the main reading paths
- unused code and dependencies were pruned

The remaining strategic limitation is still content quality, especially commentary completeness, not frontend structure.

## 12. Commentary Import Audit (2026-04-03)

### Current source of truth

Commentary is currently stored inline inside [public/gita.json](C:/Users/roadsea/Desktop/gita/public/gita.json) as the optional `commentary_en` field on each `GitaVerse` record.

Relevant type contract:

- [src/types/index.ts](C:/Users/roadsea/Desktop/gita/src/types/index.ts)
  `GitaVerse.commentary_en?: string`

There is no dedicated tracked commentary import pipeline in the current repository:

- no maintained script targeting `commentary_en`
- no tracked ODT/DOCX parser
- no commentary-specific normalization utility

The user-provided import source currently present in the workspace is:

- `C:\Users\roadsea\Desktop\gita\바가바드 기타_1장 해설.odt`

That `.odt` file is a standard OpenDocument zip container and includes `content.xml`, embedded fonts, and table markup, so direct extraction is feasible in a local script without external services.

### Runtime rendering path

Commentary is resolved and rendered through the verse route stack:

1. [src/context/VerseDataContext.tsx](C:/Users/roadsea/Desktop/gita/src/context/VerseDataContext.tsx)
   loads `gita.json`, resolves the requested verse, computes `verseRange`, and derives `hasDisplayableCommentary`
2. [src/components/VerseSidePanel.tsx](C:/Users/roadsea/Desktop/gita/src/components/VerseSidePanel.tsx)
   mounts the right-side commentary panel
3. [src/components/VerseCommentary.tsx](C:/Users/roadsea/Desktop/gita/src/components/VerseCommentary.tsx)
   reads `verseData.commentary_en` and renders it

Important current rendering limitation:

- [src/components/VerseCommentary.tsx](C:/Users/roadsea/Desktop/gita/src/components/VerseCommentary.tsx) only splits commentary on newline boundaries and renders plain `<p>` blocks
- there is no structured rendering for tables
- there is no structured rendering for ordered lists
- there is no structured rendering for bullet lists
- there is no inline heading treatment beside the verse label

So the current UI cannot faithfully display the requested import rules without additional formatting or parsing work.

### Current display filter

Commentary visibility is not based on raw presence alone.

[src/utils/content.ts](C:/Users/roadsea/Desktop/gita/src/utils/content.ts) currently marks commentary as displayable only when it:

- is non-empty
- does not start with `$`
- does not start with `Hindi commentary by `
- does not contain Devanagari characters

This means a newly imported Korean commentary source would be displayable under the current filter, but imported structured blocks still need renderer support.

### Verse key mapping behavior

Verse route resolution is gap-based, not strict-id based.

[src/utils/verse.ts](C:/Users/roadsea/Desktop/gita/src/utils/verse.ts):

- `resolveVerse()` finds the stored verse entry whose `verse` number covers the requested number up to the next stored verse
- `getVerseRange()` infers grouped ranges by looking at numeric gaps between adjacent stored entries

Important implication:

- grouped verses are stored under the first verse number only
- the `id` field does not reliably encode the full grouped range
- grouped audio filenames do encode the range, for example `001_004-006.mp3`

Observed chapter 1 grouped entries:

- `1.4` represents verses `1.4-1.6`
- `1.16` represents verses `1.16-1.18`
- `1.21` represents verses `1.21-1.22`
- `1.29` represents verses `1.29-1.31`
- `1.32` represents verses `1.32-1.33`
- `1.34` represents verses `1.34-1.35`
- `1.36` represents verses `1.36-1.37`
- `1.38` represents verses `1.38-1.39`
- `1.45` represents verses `1.45-1.46`

So any commentary import must map commentary blocks to the stored first-verse key, not to every verse number independently, or route resolution will drift.

### Current data reality

Repository inspection of [public/gita.json](C:/Users/roadsea/Desktop/gita/public/gita.json) shows:

- `18` chapters
- `640` stored verse entries
- `639` entries with a non-empty `commentary_en`
- `431` entries using dollar-prefixed placeholders such as `$15` or `$16`
- `1` entry that is source-metadata text (`Hindi Commentary By ...`)
- `0` entries that pass the current displayability rule

Chapter 1 currently has `35` stored verse entries, and all `35` contain some `commentary_en` payload, but that payload is a mix of placeholders and Hindi commentary text rather than the desired imported Korean commentary.

### Import-rule impact

The requested rule set implies more than a text replacement:

- all existing `commentary_en` values must be replaced for the target scope
- meta blocks must be stripped during import, not only hidden in the UI
- numbering and bullet semantics must survive extraction
- tables must be preserved in a structured form
- the first title in a commentary block must be exposed as an inline heading beside the verse number

That likely requires both:

1. a commentary import/cleanup pipeline
2. a richer commentary rendering contract than raw newline-delimited text

### Risks

Primary implementation risks:

- The repository currently has only one supplied commentary source file, and it covers chapter 1 only. Full-repository commentary replacement cannot be completed for chapters 2-18 unless additional source files are supplied or the intended scope is explicitly chapter 1 only.
- Grouped verse storage is gap-based. A naive per-verse import could misassign commentary for combined verse entries.
- The current renderer cannot preserve table or list semantics, so import-only work would still lose structure at display time.
- The cleanup rules remove several classes of meta text. Overly broad filtering could delete valid commentary unless the parser distinguishes true content from import scaffolding.
- Existing unit tests currently only validate commentary visibility heuristics, not commentary import mapping, structured rendering, or full-repository residue cleanup.
