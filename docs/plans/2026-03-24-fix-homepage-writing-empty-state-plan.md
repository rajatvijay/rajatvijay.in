---
title: "Fix homepage layout with zero posts + writing coming soon page"
type: fix
date: 2026-03-24
---

# Fix homepage layout with zero posts + writing coming soon page

## Problem

After removing all blog posts:

1. **Homepage `.home-grid` is distorted** — the grid is `1fr 2fr`, so when Latest Writing conditionally hides, the Activity section gets squished into the narrow 1fr column with the 2fr column empty.
2. **Writing page empty state is bare** — just `<p>No posts yet. Check back soon.</p>`. Needs a beautiful coming soon treatment.

## Fix 1: Homepage — center activity when no posts

**File:** `src/pages/index.astro`

When `allPosts.length === 0`, the Latest Writing section doesn't render. The Activity section should take full width and be centered, not squished into the first grid column.

**Approach:** When no posts, replace the `home-grid` 2-column layout with a single centered column for the activity section. Use a conditional class or restructure the grid.

```astro
<!-- Replace the existing home-grid block (lines 84-120) -->
{allPosts.length > 0 ? (
  <div class="home-grid" data-reveal>
    <section class="latest-writing">
      <h2 class="label">LATEST WRITING</h2>
      <!-- ... existing post list ... -->
    </section>
    <section class="activity-feed">
      <!-- ... existing activity content ... -->
    </section>
  </div>
) : (
  <div class="home-activity-solo" data-reveal>
    <section class="activity-feed">
      <!-- ... same activity content ... -->
    </section>
  </div>
)}
```

```css
/* src/pages/index.astro <style> block */
.home-activity-solo {
  max-width: 560px;
  margin: 32px auto;
}
```

This keeps the Activity section (GitHub graph + Topmate CTA) centered and reasonably sized when there's no writing section to balance against. No grid, no awkward empty column.

### Acceptance Criteria

- [ ] Activity section is centered and full-width when zero posts
- [ ] Layout looks intentional, not broken
- [ ] No change when posts exist (normal 2-column grid)

---

## Fix 2: Writing page — beautiful coming soon

**File:** `src/pages/writing/index.astro`

Replace the empty state with a coming soon design that:
- Has visual weight (not just a text line)
- Includes the newsletter signup (so visitors can subscribe for when posts launch)
- Matches the site's editorial tone
- Uses existing design tokens and patterns

**Approach:** When zero posts, hide the tags row and post list, show a centered coming soon section with:
1. A short editorial message
2. The `NewsletterSignup` component (inline variant) so visitors can get notified
3. Subtle visual treatment using existing `surface-card` pattern

```astro
<!-- src/pages/writing/index.astro -->
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import NewsletterSignup from '../../components/NewsletterSignup.astro';
import { getSortedPosts } from '../../utils/posts';
import { formatDateMedium } from '../../utils/formatDate';

const allPosts = await getSortedPosts();
const allTags = [...new Set(allPosts.flatMap(p => p.data.tags))];
---

<BaseLayout title="Writing — Rajat" description="Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.">
  <div class="container page-top">
    <h1>Writing</h1>
    <p class="secondary-text page-desc">
      Essays on building AI products, leading engineering teams, and the path from frontend to AI leadership.
    </p>

    {allPosts.length > 0 ? (
      <Fragment>
        {allTags.length > 0 && (
          <div class="tags-row" role="list" aria-label="Filter by tag">
            {allTags.map(tag => (
              <a href={`/writing/tag/${tag}`} class="pill pill-coral" role="listitem">{tag}</a>
            ))}
          </div>
        )}

        <ul class="writing-list">
          {allPosts.map(post => (
            <li class="writing-item">
              <a href={`/writing/${post.id}`} class="writing-link">
                <div class="writing-meta">
                  <time class="meta" datetime={post.data.date.toISOString()}>{formatDateMedium(post.data.date)}</time>
                  <span class="meta">{post.data.readTime} min read</span>
                </div>
                <h2 class="writing-title">{post.data.title}</h2>
                <p class="writing-desc secondary-text">{post.data.description}</p>
              </a>
              <div class="writing-tags">
                {post.data.tags.map(tag => (
                  <a href={`/writing/tag/${tag}`} class="pill pill-teal pill-sm">{tag}</a>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div class="reading-stats surface-card writing-end-card">
          <p class="meta">You've read through all {allPosts.length} posts</p>
        </div>
      </Fragment>
    ) : (
      <div class="coming-soon">
        <div class="coming-soon-inner">
          <span class="label accent-text">COMING SOON</span>
          <p class="coming-soon-text">
            I'm working on the first batch of essays. Topics on deck: career transitions into AI leadership,
            building LLM products at enterprise scale, and the frontend skills that transfer to AI product work.
          </p>
          <p class="coming-soon-sub meta">
            Subscribe to get notified when the first essay drops.
          </p>
        </div>
        <NewsletterSignup variant="inline" />
      </div>
    )}
  </div>
</BaseLayout>
```

```css
/* Styles */
.coming-soon {
  margin-top: 32px;
}
.coming-soon-inner {
  text-align: center;
  max-width: 480px;
  margin: 0 auto 24px;
}
.coming-soon-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 12px 0;
}
.coming-soon-sub {
  margin-bottom: 24px;
}
```

### Acceptance Criteria

- [ ] Writing page shows "COMING SOON" label + editorial copy when zero posts
- [ ] Newsletter signup is embedded for visitor conversion
- [ ] Tags row is hidden when no tags exist
- [ ] Normal post list renders when posts exist (no regression)
- [ ] Looks polished in both light and dark mode
- [ ] Works on mobile

## References

- `src/pages/index.astro:84-120` — homepage grid with Latest Writing + Activity
- `src/pages/index.astro:244-248` — `.home-grid` CSS (1fr 2fr)
- `src/pages/writing/index.astro` — writing listing page
- `src/components/NewsletterSignup.astro` — newsletter form component
