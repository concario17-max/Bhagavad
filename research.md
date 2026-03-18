# Bhagavad Research Report

Updated: 2026-03-18
Workspace: `C:\Users\roadsea\Desktop\nagham`

## 1. Project Summary

This project is a static Bhagavad Gita reading application built with React, Vite, and TypeScript.
It now opens directly to the home screen with no password gate.

The main reading flow is:

1. Open the chapter grid on the home page.
2. Enter a verse page from a chapter card or chapter/verse selector.
3. Navigate verses from the left chapter panel or footer controls.
4. Read the verse in the center column.
5. Use the right panel for `Commentary` or `Notes`.

The app is structured as a reading-first interface rather than a general-purpose dashboard.

## 2. Runtime Stack

- React 19
- React DOM 19
- TypeScript 5
- Vite 7
- `react-router-dom` 7
- Tailwind CSS v4
- `lucide-react`
- `framer-motion`

Build commands in active use:

- `npm run dev`
- `npm run build`
- `npx tsc --noEmit`

## 3. Entry and App Shell

Entry point: [src/main.tsx](C:/Users/roadsea/Desktop/nagham/src/main.tsx)

The app boot sequence:

1. Load global CSS from [src/index.css](C:/Users/roadsea/Desktop/nagham/src/index.css)
2. Mount `ThemeProvider`
3. Mount `UIProvider`
4. Render `App`

[src/App.tsx](C:/Users/roadsea/Desktop/nagham/src/App.tsx) uses `HashRouter`, which is appropriate for static hosting on Cloudflare Pages because deep links do not rely on origin-side route rewrites.

The app also preloads `gita.json` on startup through `preloadGitaData()`, reducing repeat fetch latency after the first screen.

## 4. Routing

Routes:

- `/`
- `/chapter/:chapterNum/verse/:verseNum`

Because routing is hash-based, shared links remain stable on static hosting and direct verse links work without server-side route configuration.

## 5. Global State

### 5.1 Theme

Provider: [src/context/ThemeContext.tsx](C:/Users/roadsea/Desktop/nagham/src/context/ThemeContext.tsx)

Responsibilities:

- store `light | dark`
- toggle theme
- sync the active class to the root document
- persist user preference

Storage helper: [src/utils/storage.ts](C:/Users/roadsea/Desktop/nagham/src/utils/storage.ts)

### 5.2 UI

Provider: [src/context/UIContext.tsx](C:/Users/roadsea/Desktop/nagham/src/context/UIContext.tsx)

Responsibilities:

- mobile left drawer open state
- mobile right drawer open state
- desktop left panel visibility
- desktop right panel visibility
- active right panel mode: `notes | commentary`

Current naming is now aligned with the real UX:

- `isNotesOpen`
- `isDesktopNotesOpen`
- `toggleNotesPanel()`
- `activeVersePanel`

Default right panel mode is `commentary` unless the browser already has a saved user preference.

## 6. Local Storage Model

Central helper: [src/utils/storage.ts](C:/Users/roadsea/Desktop/nagham/src/utils/storage.ts)

Current active keys:

- `theme`
- `gita-active-verse-panel`
- `gita-desktop-sidebar`
- `gita-desktop-notes`
- `gita-show-lexicon`
- `gita-note-{chapter}-{verse}`

Migration note:

- the app still reads legacy key `gita-desktop-reflections`
- if found, it migrates that value into `gita-desktop-notes`

Note APIs are now consistently named:

- `getNote()`
- `setNote()`
- `getAllNotes()`
- `StoredNote`

This is now much cleaner than the older mixed `Reflections` naming.

## 7. Data Loading and Caching

Fetcher: [src/utils/dataFetcher.ts](C:/Users/roadsea/Desktop/nagham/src/utils/dataFetcher.ts)

Behavior:

- keeps a resolved in-memory cache
- keeps an in-flight promise cache
- retries cleanly after a failed request by clearing the promise cache

This prevents duplicate fetches from home, sidebar, verse view, and notes modal.

## 8. Home Page

Page: [src/pages/ChapterList.tsx](C:/Users/roadsea/Desktop/nagham/src/pages/ChapterList.tsx)

Responsibilities:

- render the 18 chapter cards
- provide chapter and verse selector controls
- open `Compendium`, `Lexicon`, and `Notes` modals

Metadata is resolved through [src/utils/chapterMeta.ts](C:/Users/roadsea/Desktop/nagham/src/utils/chapterMeta.ts), so the home cards and sidebar use the same chapter naming rules.

## 9. Verse Page

Page: [src/pages/VerseView.tsx](C:/Users/roadsea/Desktop/nagham/src/pages/VerseView.tsx)

This is the main reader page.

Responsibilities:

- fetch the current verse
- resolve verse ranges through shared verse utilities
- redirect range aliases to the correct verse URL
- show Sanskrit, IAST, Korean pronunciation, audio, word-by-word, and translations
- support previous and next verse navigation

Notable current UI behavior:

- the earlier intro card above the verse has been removed
- Sanskrit block spacing has been tightened
- translation helper copy above the translation cards has been removed
- translation labels are standardized and uppercase

Current translation labels:

- `ENGLISH`
- `HAM`
- `GIL`
- `MYUNG`
- `SUK`

Translation definitions are centralized in [src/utils/content.ts](C:/Users/roadsea/Desktop/nagham/src/utils/content.ts).

## 10. Left Panel

Files:

- [src/components/Sidebar.tsx](C:/Users/roadsea/Desktop/nagham/src/components/Sidebar.tsx)
- [src/components/ui/SidebarLayout.tsx](C:/Users/roadsea/Desktop/nagham/src/components/ui/SidebarLayout.tsx)
- [src/components/ui/SidebarMenu.tsx](C:/Users/roadsea/Desktop/nagham/src/components/ui/SidebarMenu.tsx)

Current behavior:

- chapter list and verse list share a fixed left panel
- the top chapter region now uses about `30%` of the panel height
- the bottom verse region uses about `70%`

This directly reflects the most recent user request.

## 11. Right Panel

Files:

- [src/components/VersePanelToggle.tsx](C:/Users/roadsea/Desktop/nagham/src/components/VersePanelToggle.tsx)
- [src/components/VerseSidePanel.tsx](C:/Users/roadsea/Desktop/nagham/src/components/VerseSidePanel.tsx)
- [src/components/NotesPanel.tsx](C:/Users/roadsea/Desktop/nagham/src/components/NotesPanel.tsx)
- [src/components/VerseCommentary.tsx](C:/Users/roadsea/Desktop/nagham/src/components/VerseCommentary.tsx)

Current UX:

- the header toggle switches between `Notes` and `Commentary`
- default visible mode is `Commentary`
- `Notes` and `Commentary` use the same width rules
- when the left chapter panel is closed on desktop, the right panel expands from `460px` to `760px`
- this wider behavior now applies equally to both `Notes` and `Commentary`

### 11.1 Notes Panel

[src/components/NotesPanel.tsx](C:/Users/roadsea/Desktop/nagham/src/components/NotesPanel.tsx)

Responsibilities:

- edit the current verse note
- save to local storage
- export current note
- export all notes

Current export names:

- `Bhagavad_Gita_Note_{chapter}_{verse}.txt`
- `Bhagavad_Gita_All_Notes.txt`

### 11.2 Notes Modal

[src/components/NotesModal.tsx](C:/Users/roadsea/Desktop/nagham/src/components/NotesModal.tsx)

Responsibilities:

- gather all saved notes from local storage
- join them with verse data from `gita.json`
- show a Sanskrit preview and stored note text

### 11.3 Commentary Panel

[src/components/VerseCommentary.tsx](C:/Users/roadsea/Desktop/nagham/src/components/VerseCommentary.tsx)

Commentary visibility is controlled by [src/utils/content.ts](C:/Users/roadsea/Desktop/nagham/src/utils/content.ts).

Current display rules:

- hide empty commentary
- hide values starting with `$`
- hide values containing Devanagari script
- hide metadata-only stubs starting with `Hindi Commentary By `

This matters because the source field `commentary_en` is not actually a clean English commentary dataset.

## 12. Data Audit

Primary content file: `public/gita.json`

Lexicon file: `public/lexicon.json`

### 12.1 Translation Coverage

Full verse count: `640`

Coverage found in current source data:

- `translation_en`: `640`
- `translation_ham`: `640`
- `translation_gil`: `640`
- `translation_jimong` shown as `MYUNG`: `640`
- `translation_suk`: `580`

This means `SUK` is the only translation stream with incomplete coverage.

### 12.2 Commentary Coverage

Audit result across all `640` verses:

- blank: `1`
- dollar-placeholder values: `431`
- Devanagari commentary blocks: `207`
- readable English commentary blocks: `0`
- metadata-only English stub after filtering: excluded

One raw entry previously passed the older filter:

- `18.2`: `Hindi Commentary By Swami Ramsukhdas`

That string is a label, not readable commentary content, so the commentary rule now excludes it as well.

Conclusion:

The current empty commentary states are mainly a source-data limitation, not a UI rendering bug.

### 12.3 Lexicon Integrity

Quick audit results:

- `21` top-level lexicon buckets
- all buckets are arrays
- no sampled entries were missing `word` or `meaning`

## 13. Typography and Visual Direction

Primary fonts in [src/index.css](C:/Users/roadsea/Desktop/nagham/src/index.css):

- `Cormorant Garamond`
- `Noto Serif`
- `Gowun Batang`
- `Manrope`

Role split:

- brand and display headings: `Cormorant Garamond`
- interface text: `Manrope`
- Sanskrit and IAST: `Noto Serif`
- Korean reading text: `Gowun Batang`

This palette now matches the reading-focused, archival tone of the product better than the earlier font stack.

## 14. Deployment

Static host target: Cloudflare Pages

Relevant files:

- [vite.config.js](C:/Users/roadsea/Desktop/nagham/vite.config.js)
- [.github/workflows/deploy.yml](C:/Users/roadsea/Desktop/nagham/.github/workflows/deploy.yml)

Current deployment model:

- Cloudflare Pages serves the production app
- GitHub Actions acts as a CI build check only
- the old `gh-pages` deployment path has been removed

This fixed the earlier preview failure pattern where a built artifact branch was being treated like a source branch.

## 15. Metadata and Sharing

HTML entry: [index.html](C:/Users/roadsea/Desktop/nagham/index.html)

Current metadata includes:

- favicon
- apple touch icon
- description
- `theme-color`
- `color-scheme`
- Open Graph tags
- Twitter card tags

User-facing wording now says `notes`, not `reflections`.

## 16. Current Risks

### 16.1 Commentary Source Quality

The right-side commentary UI is stable, but the data behind `commentary_en` is mostly placeholders or Hindi/Devanagari commentary.
This is the biggest remaining content limitation in the project.

### 16.2 Local-Only Notes

Notes are stored only in browser local storage.
They do not sync across devices or browsers.

### 16.3 Partial Translation Coverage

`SUK` is missing on 60 verses, so that card will not appear consistently across the full text.

### 16.4 Legacy Support Still Present

There is still a legacy storage migration path for `gita-desktop-reflections`.
That is intentional and low-risk, but it is one remaining trace of the older naming model.

## 17. Overall Assessment

The project is now in a coherent and production-usable state.

The biggest improvements over its earlier state are:

- no password gate
- clean `Notes / Commentary` panel model
- stable internal scroll container behavior
- equalized right panel sizing
- centralized storage helpers
- centralized translation and commentary presentation rules
- Cloudflare-friendly routing and deployment
- cleaner typography and metadata

The main remaining issues are now content quality and product depth, not structural instability.
