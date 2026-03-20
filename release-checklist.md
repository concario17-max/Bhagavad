# Bhagavad Release Checklist

Updated: 2026-03-20
Production URL: [https://bhagavad-9yk.pages.dev](https://bhagavad-9yk.pages.dev)

## Build and Test Commands

- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [x] `npm run test:unit`
- [x] Playwright smoke verification via `tests/run-e2e.ts`

## Product QA

- [x] Home page loads directly with no password gate
- [x] `BHAGAVAD GITA` home title renders correctly
- [x] 18 chapter cards render
- [x] Chapter and verse selectors navigate correctly
- [x] Verse page breadcrumb renders
- [x] Word-by-word section expands and collapses
- [x] Translation cards render
- [x] Commentary toggle opens and closes the right panel
- [x] Commentary empty-state explains current source limitations
- [x] Desktop layout supports all four frame states
- [x] Dark mode toggle works
- [x] Direct hash URL entry works, for example `/#/chapter/1/verse/1`

## Mobile QA

- [x] Mobile left chapter drawer opens and closes
- [x] Mobile right commentary drawer opens and closes
- [x] Main reader scroll lock still engages while mobile drawers are open

## Operational Notes

- Cloudflare Pages is the production host
- GitHub Actions is a CI validation path, not the live deployment target
- Commentary visibility is a UI affordance, not proof of commentary data quality
- `reuse-guide.md` and `.agents/` remain untracked local workflow files

## Documentation Maintenance

- [x] Refresh `research.md` after structural runtime changes
- [x] Refresh `plan.md` after each completed implementation tranche
- [x] Keep [data-pipeline.md](C:/Users/roadsea/Desktop/nagham/data-pipeline.md) aligned with any script or source-file workflow changes

## Recommended Final Manual QA

- Check typography, spacing, and contrast on real devices
- Read through a long verse flow and confirm scrolling comfort
- Verify mobile tap targets and drawer close gestures on an actual phone
