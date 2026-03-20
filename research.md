# Bhagavad Gita Project Research Report

Updated: 2026-03-20
Workspace: `C:\Users\roadsea\Desktop\nagham`

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
