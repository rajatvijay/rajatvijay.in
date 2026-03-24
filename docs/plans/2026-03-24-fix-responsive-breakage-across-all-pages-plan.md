---
title: "fix: Responsive breakage across all pages"
type: fix
date: 2026-03-24
---

# fix: Responsive breakage across all pages

## Overview

Responsiveness is broken across multiple pages. Fix all layout, typography, and spacing issues on mobile/tablet devices without regressing any existing animations (hero entrance, scroll reveals, metrics count-up, hover micro-interactions, etc.).

## Problem Statement

After recent animation and color work, several responsive issues exist:

1. **GitHub contribution grid invisible on mobile** — the grid is ~624px wide (52 cols × 12px) but the container is ~350px on phones. `overflow: hidden` clips most of it, leaving an empty card with just the "GitHub" label
2. **Post navigation doesn't stack on mobile** — writing and talks detail pages keep side-by-side layout that breaks on narrow viewports
3. **Newsletter input too narrow on tablets** — `max-width: 320px` creates awkward whitespace at 600–800px widths
4. **Newsletter full-variant title doesn't scale** — fixed `2rem` is too large on small screens
5. **Talk tags can overflow** — no `flex-wrap` means pills push beyond container
6. **Newsletter inline component padding not responsive** — 32px padding stays fixed on mobile
7. **Surface cards don't reduce padding on mobile** — 24px padding everywhere wastes space on small screens

## Acceptance Criteria

- [ ] All pages render correctly at 320px, 375px, 768px, 1024px, and 1440px widths
- [ ] No horizontal overflow on any page at any viewport
- [ ] All existing animations continue to work (hero entrance, scroll reveals, metrics count-up, hover effects, mobile menu transition)
- [ ] `prefers-reduced-motion` still disables all animations
- [ ] No visual regressions in dark mode

## Technical Approach

All fixes use existing breakpoints (768px, 480px, 600px) and CSS-only changes. No JavaScript modifications needed. No animation code is touched.

### Phase 1: Layout Fixes

#### 1.1 GitHub contribution grid on mobile

**File:** `src/pages/index.astro`

The grid is 52 columns × 12px = ~624px, which overflows any phone viewport. Two options:

**Option A — Scale down the grid with CSS transform (recommended):**

Wrap the grid in a container that scales it to fit, preserving the visual pattern:

```css
@media (max-width: 768px) {
  .contrib-grid {
    transform: scale(0.65);
    transform-origin: top left;
    height: 56px; /* 7 rows × 10px cells + 6 × 2px gaps ≈ 82px × 0.65 ≈ 53px, round up */
  }
}
```

This keeps the full year visible at a smaller size. The `height` override prevents the untransformed space from creating a gap.

**Option B — Hide on mobile, show text summary instead:**

Hide the grid entirely on mobile and show a text-based contribution count:

```css
@media (max-width: 768px) {
  .contrib-grid { display: none; }
}
```

And render a fallback `<p class="meta contrib-summary">` with the total contribution count, hidden on desktop.

**Recommendation:** Option A — the grid is a recognizable visual element worth keeping.

#### 1.2 Post navigation mobile stacking

**File:** `src/pages/writing/[slug].astro`

Add mobile media query to stack prev/next navigation:

```css
/* Add inside existing <style> block */
@media (max-width: 768px) {
  .post-nav {
    flex-direction: column;
  }
  .post-nav-link {
    max-width: 100%;
  }
  .post-nav-link.next {
    text-align: left;
  }
}
```

**File:** `src/pages/talks/[slug].astro`

Already has mobile stacking for `.talk-nav` — verify it works. The existing rule at line ~198 handles this.

#### 1.2 Talk tags flex-wrap

**File:** `src/pages/talks/index.astro`

```css
/* Change existing .talk-tags rule */
.talk-tags {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;  /* ADD */
}
```

### Phase 2: Typography Fixes

#### 2.1 Newsletter full-variant title responsive scaling

**File:** `src/components/NewsletterSignup.astro`

Replace the fixed `font-size: 2rem` in `.newsletter.full .newsletter-title` with fluid scaling:

```css
.newsletter.full .newsletter-title {
  font-size: clamp(1.5rem, 1rem + 2vw, 2rem);
}
```

This matches the `clamp()` pattern already used for `.hero-title` and `h1` in `global.css`.

### Phase 3: Spacing & Padding Fixes

#### 3.1 Newsletter input tablet width

**File:** `src/components/NewsletterSignup.astro`

The existing 480px breakpoint removes `max-width` for very small screens. Add a rule for tablets:

```css
@media (max-width: 768px) {
  .newsletter-input {
    max-width: none;
  }
}
```

This lets the input fill available space on tablets while still being constrained on desktop.

#### 3.2 Newsletter inline padding responsive

**File:** `src/components/NewsletterSignup.astro`

Add mobile padding reduction:

```css
@media (max-width: 768px) {
  .newsletter {
    padding: 20px;
  }
}
```

#### 3.3 Surface card padding responsive

**File:** `src/styles/global.css`

Add mobile padding for the shared `.surface-card` class:

```css
@media (max-width: 768px) {
  .surface-card {
    padding: 16px;
  }
}
```

This affects all cards site-wide (The Arc, GitHub widget, topmate card, featured cards, book rows, impact cards, talk sidebar, etc.) — consistent tighter spacing on mobile.

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `src/pages/index.astro` | Scale GitHub grid on mobile | Low — CSS transform, no layout shift |
| `src/pages/writing/[slug].astro` | Add post-nav mobile stacking | Low — CSS-only addition |
| `src/pages/talks/index.astro` | Add flex-wrap to talk tags | Low — CSS-only addition |
| `src/components/NewsletterSignup.astro` | Fluid title + responsive input/padding | Low — CSS-only |
| `src/styles/global.css` | Surface card responsive padding | Medium — affects all cards |

## What NOT to Change

- **No animation code** — hero entrance, scroll reveals, metrics count-up, hover effects all stay untouched
- **No JavaScript** — all fixes are CSS-only
- **No breakpoint changes** — use existing 768px/480px/600px
- **No dark mode changes** — all fixes are theme-agnostic
- **No HTML structure changes** — just CSS adjustments

## Testing Plan

- [ ] Test homepage at 320px, 375px, 768px, 1024px, 1440px
- [ ] Test writing index and individual post pages at all widths
- [ ] Test talks index and individual talk pages at all widths
- [ ] Test newsletter page at all widths
- [ ] Test reading page at all widths
- [ ] Test projects and products index pages at all widths
- [ ] Test 404 page at all widths
- [ ] Verify hero entrance animation plays on mobile
- [ ] Verify scroll reveals trigger on mobile scroll
- [ ] Verify metrics count-up works on mobile
- [ ] Verify mobile menu open/close animation works
- [ ] Toggle dark mode on mobile — no regressions
- [ ] Test with `prefers-reduced-motion: reduce` enabled

## References

- Existing fluid typography: `src/styles/global.css` lines 210–226 (clamp patterns)
- Existing 768px breakpoints: `src/styles/global.css` lines 535–540
- Animation system: `src/styles/global.css` lines 616–633 (scroll reveal), 640–647 (reduced motion)
- Previous responsive work: commit `cc9a153` (rem conversion + clamp)
