# Bhagavad Release Checklist

Updated: 2026-03-18
Production URL: [https://bhagavad-9yk.pages.dev](https://bhagavad-9yk.pages.dev)

## Build Status

- [x] `npx tsc --noEmit`
- [x] `npm run build`

## Production QA

- [x] Home page loads directly with no password gate
- [x] `BHAGAVAD GITA` home title renders correctly
- [x] 18 chapter cards render
- [x] Chapter card click opens a verse page
- [x] Verse page breadcrumb renders
- [x] Word-by-word section expands and collapses
- [x] Translation cards render
- [x] Right panel switches between `Notes` and `Commentary`
- [x] Right panel expands when the left chapter panel is closed
- [x] Dark mode toggle works
- [x] Direct hash URL entry works, for example `/#/chapter/1/verse/1`

## Mobile and Accessibility

- [x] Mobile left chapter panel opens
- [x] Mobile right verse panel opens
- [x] `Close Chapters` button is visible
- [x] `Close verse panel` button is visible

## Operational Notes

- Cloudflare Pages is the production host
- GitHub Actions is a CI validation path, not the live deployment target
- Notes are local to the browser because they use local storage
- Commentary availability depends on the current source dataset, not just the panel UI

## Recommended Final Manual QA

- Check typography, spacing, and contrast on real devices
- Read through a long verse flow and confirm scrolling comfort
- Verify mobile tap targets and drawer close gestures on an actual phone
