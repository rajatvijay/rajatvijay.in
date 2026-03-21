---
title: "fix: Audit findings batch — 17 issues"
type: fix
date: 2026-03-21
---

# Fix Audit Findings Batch

## Fixes

### 1. Newsletter form — disable until real provider connected
- Remove the JS submit handler that fakes "Coming soon!"
- Replace the form with a static "Newsletter coming soon" message
- Remove the "840+" subscriber count claim
- File: `src/components/NewsletterSignup.astro`

### 3. Subscriber count — remove fabricated number
- Remove "Join 840+ engineering leaders" text
- File: `src/components/NewsletterSignup.astro`

### 5. Blog post prev/next — add "← Newer" link
- Compute both prevPost (newer) and nextPost (older)
- Render both in a nav row: newer on left, older on right
- File: `src/pages/writing/[slug].astro`

### 6. About page — remove route but keep code
- Delete `src/pages/about.astro` (removes the route)
- Keep the code in a `src/pages/_archive/about.astro` for future use
- About is already removed from nav (done previously)

### 7. Reading + Newsletter — no header active state
- These pages are footer-only links. Add a check so the nav doesn't break when on these routes (already handled — the active class just won't match, which is fine). No code change needed.

### 9. Mobile menu — close on link click + Escape
- Add click listeners on nav links to close menu
- Add Escape keydown listener
- File: `src/components/Header.astro`

### 10. Homepage empty sections — guard with length check
- Wrap "LATEST WRITING", "FEATURED PROJECTS", "FEATURED PRODUCTS" in `{items.length > 0 && ...}` guards
- File: `src/pages/index.astro`

### 11. Writing page "0 posts" — add empty state
- Show "No posts yet" instead of "You've discovered all 0 posts"
- File: `src/pages/writing/index.astro`

### 12. Projects + Products empty states
- Add "No projects yet" / "No products yet" fallback text
- Files: `src/pages/projects/index.astro`, `src/pages/products/index.astro`

### 13. Talks with no media — show "Notes only" indicator
- If no youtubeId and no slidesUrl, show a muted "Notes" pill
- File: `src/pages/talks/index.astro`

### 14. GitHub fallback dates — use relative string directly
- Remove hardcoded ISO dates from fallback, just use relative strings
- File: `src/utils/github.ts`

### 15. Product URL required for coming-soon — make optional
- Change `url: z.string().url()` to `url: z.union([z.string().url(), z.literal('')]).default('')`
- Guard the CTA render in template
- File: `src/content.config.ts`, `src/pages/products/[slug].astro`

### 16. Shiki theme mismatch — use CSS variable approach
- Configure Astro Shiki to use `css-variables` theme instead of separate light/dark
- Map Shiki CSS vars to our design tokens in global.css
- File: `astro.config.mjs`, `src/styles/global.css`

### 17. Dark mode hover shadows invisible — use token
- Add `--shadow-hover` CSS custom property that adapts in dark mode
- Replace all hardcoded `rgba(0,0,0,0.08)` shadows
- Files: `src/styles/global.css`, multiple page files

### 18. Mobile nav opaque vs header blur — match styles
- Apply same blur/transparency to mobile nav dropdown
- File: `src/components/Header.astro`

### 21. Footer RSS opens in same tab — add target blank
- Add `target="_blank" rel="noopener noreferrer"` to RSS link
- File: `src/components/Footer.astro`

### 22. Newsletter page copy claims features that don't exist
- Rewrite to honest "coming soon" messaging
- File: `src/pages/newsletter.astro`

## Acceptance Criteria

- [ ] Newsletter form is disabled with honest "coming soon" message
- [ ] No fabricated subscriber count
- [ ] Blog posts have both "← Newer" and "Older →" navigation
- [ ] About page route removed, code archived
- [ ] Mobile menu closes on link click and Escape
- [ ] Homepage sections hidden when empty
- [ ] Writing/Projects/Products pages have empty states
- [ ] Talks without media show "Notes" pill
- [ ] GitHub fallback doesn't use stale dates
- [ ] Coming-soon products don't require URL
- [ ] Code blocks follow dark mode toggle (not system pref)
- [ ] Hover shadows visible in dark mode
- [ ] Mobile nav matches header blur style
- [ ] RSS link opens in new tab
- [ ] Newsletter page has honest copy
