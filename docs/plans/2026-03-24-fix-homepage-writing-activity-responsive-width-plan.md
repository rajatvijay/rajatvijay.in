---
title: "fix: Homepage Latest Writing/Activity responsive layout and width ratio"
type: fix
date: 2026-03-24
---

# fix: Homepage Latest Writing/Activity responsive layout and width ratio

## Overview

The `.home-grid` on the homepage splits Latest Writing and Activity 50/50 (`1fr 1fr`). Latest Writing should take 1/3 and Activity should take 2/3 of the total width. Both sections also need thorough responsive testing and fixes to eliminate horizontal scrolling and data clipping at all viewport sizes.

## Problem Statement

1. **Width ratio wrong** — Latest Writing and Activity are `1fr 1fr` (50/50). Latest Writing content is narrow (just post titles + dates) and doesn't need half the viewport. Activity (GitHub grid + topmate card) benefits from more space.
2. **GitHub contribution grid clips on small viewports** — The grid is ~624px wide (52 cols × 12px). At narrow widths, `overflow: hidden` hides columns silently — data is lost without visual indication.
3. **No intermediate breakpoints** — The grid jumps from 2-column to 1-column at 768px. Between ~769px and ~900px, the 1fr 2fr split may squeeze Latest Writing too much.

## Acceptance Criteria

- [x] `.home-grid` uses `1fr 2fr` ratio on desktop (Latest Writing = 1/3, Activity = 2/3)
- [x] No horizontal scroll at any viewport width (320px, 375px, 768px, 1024px, 1440px)
- [x] No data is hidden or clipped — all post titles and the full GitHub grid are visible at every size
- [x] GitHub contribution grid adapts gracefully on mobile (scaled or restructured, not just clipped)
- [x] Topmate card text doesn't overflow or get cut off
- [x] Post titles in Latest Writing wrap naturally (no truncation) at narrow widths
- [x] All existing animations preserved (scroll reveal stagger, hover effects, contribution fade)
- [ ] Works in both light and dark mode
- [ ] `prefers-reduced-motion` still respected

## Technical Approach

### Phase 1: Width Ratio Fix

**File:** `src/pages/index.astro` (line 246)

Change the grid template from equal columns to 1/3 + 2/3:

```css
/* Before */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin: 32px 0;
}

/* After */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin: 32px 0;
}
```

### Phase 2: GitHub Contribution Grid Responsive Fix

**File:** `src/pages/index.astro`

The contrib grid is ~624px wide. In the 2/3 column at desktop widths (1080px container → ~700px for activity), this fits. But on tablet or when the grid stacks to single column on mobile, it will overflow.

**Approach — CSS `scale()` on narrow viewports:**

```css
@media (max-width: 768px) {
  .contrib-grid {
    transform-origin: top left;
    transform: scale(calc(min(1, (100cqi - 48px) / 624)));
    /* fallback for browsers without container queries */
    transform: scale(0.55);
    height: 50px; /* prevent gap from untransformed height */
  }
}
```

**Alternative (simpler):** Use a fixed scale factor at 768px that fits phones:

```css
@media (max-width: 768px) {
  .contrib-grid {
    transform: scale(0.55);
    transform-origin: top left;
    height: 48px;
  }
}

@media (max-width: 375px) {
  .contrib-grid {
    transform: scale(0.48);
    height: 42px;
  }
}
```

**Recommendation:** Simple fixed scale factors — two breakpoints cover the range well.

### Phase 3: Intermediate Breakpoint Safety

At widths between 768px–960px, the 1/3 column for Latest Writing could get very narrow (~230px). Post titles should wrap naturally, but verify. If squeeze is too tight, add a breakpoint to stack earlier:

```css
@media (max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
```

This makes sections stack at 900px instead of 768px, giving more breathing room. Test whether 768px is sufficient first — only add the 900px breakpoint if content is visibly cramped.

### Phase 4: Thorough Responsive Testing

Test at each viewport width and verify:

| Width | Expected Layout | Check |
|-------|----------------|-------|
| 320px | Stacked, single column, scaled GitHub grid | No overflow, all data visible |
| 375px | Stacked, single column, scaled GitHub grid | No overflow, all data visible |
| 768px | Stacked (or 2-col if breakpoint raised) | Transition point — verify both states |
| 1024px | 1fr 2fr side-by-side | GitHub grid fits in 2/3 column |
| 1440px | 1fr 2fr side-by-side | Comfortable spacing |

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `src/pages/index.astro` (line 246) | `1fr 1fr` → `1fr 2fr` | Low — single property change |
| `src/pages/index.astro` (line 417+) | Add contrib-grid scale for mobile | Low — CSS transform only |
| `src/pages/index.astro` (line 423) | Possibly raise stacking breakpoint to 900px | Low — CSS media query |

## What NOT to Change

- **No animation code** — contribution stagger, hover effects, scroll reveals stay untouched
- **No JavaScript** — all fixes are CSS-only
- **No HTML structure** — just CSS adjustments
- **No dark mode changes** — fixes are theme-agnostic

## Testing Plan

- [ ] Screenshot/verify homepage at 320px, 375px, 768px, 900px, 1024px, 1440px
- [ ] Confirm Latest Writing takes ~1/3 width and Activity takes ~2/3 at desktop
- [ ] Confirm GitHub grid is fully visible (not clipped) at every viewport
- [ ] Confirm no horizontal scrollbar appears at any width
- [ ] Confirm all post titles are readable (not truncated) at narrowest 1/3 width
- [ ] Confirm topmate card text wraps properly
- [ ] Confirm contribution stagger animation still plays
- [ ] Confirm hover effects on post links and topmate card still work
- [ ] Toggle dark mode at each viewport — no regressions
- [ ] Test with `prefers-reduced-motion: reduce` — animations disabled

## References

- Current grid definition: `src/pages/index.astro:244-249`
- Mobile breakpoint: `src/pages/index.astro:417-425`
- Grid overflow fix: `src/pages/index.astro:411-416`
- Contribution stagger animation: `src/pages/index.astro:313-323`
- Related plan: `docs/plans/2026-03-24-fix-responsive-breakage-across-all-pages-plan.md` (covers general responsive fixes including GitHub grid scaling)
