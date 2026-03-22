# Testing Spec — rajat.dev

Exhaustive manual + browser-automated testing spec for the personal website.
Run against `npm run dev` (localhost:4321) or the production build.

---

## Prerequisites

```bash
npm run dev   # Start dev server at localhost:4321
# OR
npm run build && npm run preview  # Production build at localhost:4321
```

---

## 1. Homepage — Desktop Light Mode

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 1.1 | Page loads at `/` | Title "Rajat — Director of Engineering & AI" | |
| 1.2 | Hero section | Photo (26KB, 200x200), title with serif font, subtitle, two CTAs (Read the blog, Book a 1:1) | |
| 1.3 | Hero image | `fetchpriority="high"` and `decoding="async"` attributes present | |
| 1.4 | Social bar | X/Twitter, GitHub, LinkedIn icons with `aria-label` and `aria-hidden` SVGs | |
| 1.5 | The Arc section | `<h2>` heading "THE ARC", 3 timeline items as `<h3>`, decorative dots have `aria-hidden` | |
| 1.6 | Metrics strip | 4 metric cards (25 Engineers, 4 AI products, 12 Enterprise clients, 8+ Years) | |
| 1.7 | Latest Writing | `<h2>` heading, 4 posts listed with title + date + read time | |
| 1.8 | Activity section | GitHub contribution grid with `role="img"` and descriptive `aria-label` | |
| 1.9 | Topmate card | "Got a question?" card with coral accent border | |
| 1.10 | Featured Projects | 3-column grid, 3 project cards linking to detail pages | |
| 1.11 | Featured Products | 3-column grid, 3 product cards | |
| 1.12 | Featured Reading | Book cards with colored reading-spine, `aria-hidden` on decorative elements | |
| 1.13 | Footer | 3-column: brand, nav links (Writing/Projects/Products/Talks/Reading/Newsletter), social links with "(opens in new tab)" sr-only text | |
| 1.14 | Sticky header | Header sticks to top on scroll with backdrop blur | |
| 1.15 | Console | Zero JS errors (only Vite/Astro debug messages in dev) | |

## 2. Homepage — Desktop Dark Mode

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 2.1 | Toggle dark mode | Click moon icon → instant switch (no 300ms fade) | |
| 2.2 | Dark background | `#1C1B18` background, grain texture overlay visible | |
| 2.3 | Text contrast | All text meets AAA 7:1 ratio (text-muted `#B5B2AA`, text-secondary `#B8B5AD`) | |
| 2.4 | Accent colors | Coral accent `#F0997B`, teal `#5DCAA5` visible on dark bg | |
| 2.5 | Cards | Surface cards `#252420` with `#3D3B36` border | |
| 2.6 | Dark pills | pill-coral `#F5B39E` on `#4A1B0C`, pill-teal `#78D4B5` on `#04342C` — all AAA | |
| 2.7 | Toggle back | Click sun icon → instant switch back to light mode | |
| 2.8 | Persistence | Refresh page → dark mode persists via localStorage | |

## 3. Homepage — Mobile (375x812)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 3.1 | Layout | Photo centered above text, CTAs stacked vertically, single-column grid | |
| 3.2 | Hamburger menu | Visible, nav links hidden | |
| 3.3 | Open menu | Click hamburger → nav links appear, `aria-expanded="true"`, focus moves to first link | |
| 3.4 | Close via Escape | Press Escape → menu closes, focus returns to hamburger button | |
| 3.5 | Close via button | Click hamburger again → menu closes | |
| 3.6 | Featured grids | Single column on mobile | |
| 3.7 | Footer | Single column on mobile | |

## 4. Writing Pages

### 4.1 Writing Index (`/writing`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 4.1.1 | Page title | "Writing — Rajat" | |
| 4.1.2 | Tags row | Clickable `<a>` tag pills linking to `/writing/tag/{tag}` | |
| 4.1.3 | Post list | All posts with `<time datetime>` elements, h2 titles, descriptions | |
| 4.1.4 | Inline tag links | Tag pills inside each post are separate `<a>` elements (NOT nested inside the post link) | |
| 4.1.5 | No empty links | Zero `<a>` elements with no text content | |
| 4.1.6 | Post count | "You've read through all N posts" at bottom | |
| 4.1.7 | "Writing" nav active | `aria-current="page"` on Writing nav link | |

### 4.2 Tag Archive (`/writing/tag/{tag}`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 4.2.1 | Page loads | Title "Tagged: {tag}", post count, back link to /writing | |
| 4.2.2 | Filtered posts | Only posts with matching tag shown | |
| 4.2.3 | All tags | Test `/writing/tag/AI`, `/writing/tag/Leadership`, `/writing/tag/Culture`, `/writing/tag/Tutorial`, `/writing/tag/Career` | |

### 4.3 Blog Post Detail (`/writing/{slug}`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 4.3.1 | Reading progress | Fixed progress bar at top, updates on scroll with rAF throttle | |
| 4.3.2 | Back link | "← Back to writing" links to /writing | |
| 4.3.3 | Post meta | `<time datetime>` with formatted date, read time | |
| 4.3.4 | TL;DR callout | Present when post has `tldr` field, coral accent border | |
| 4.3.5 | Prose content | Body text within `65ch` max-width, blog headings are full-size (not label-style) | |
| 4.3.6 | Code blocks | Syntax highlighted (Shiki), monospace font | |
| 4.3.7 | Share row | X/Twitter (intent URL), LinkedIn (share URL), Copy link button | |
| 4.3.8 | Copy link | Click → text changes to "Copied!", reverts after 2s | |
| 4.3.9 | Post navigation | "← Older" and/or "Newer →" links to adjacent posts | |
| 4.3.10 | DetailCTA | "Subscribe to the blog" + "Book a 1:1 AMA" links | |
| 4.3.11 | JSON-LD | `BlogPosting` schema with headline, datePublished, author, url | |
| 4.3.12 | OG meta | `og:type="article"`, `article:published_time`, `article:tag` | |

## 5. Projects Pages

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 5.1 | Index (`/projects`) | 3-column grid, tech stack pills, card hover effects | |
| 5.2 | Detail (`/projects/{slug}`) | Colored icon, title, tech pills, impact metrics (2-col grid), prose content, DetailCTA | |
| 5.3 | Shared CSS | items-grid styles come from global.css (not duplicated in scoped style) | |

## 6. Products Pages

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 6.1 | Index (`/products`) | 3-column grid, type pills (Web App/Mobile), status badges | |
| 6.2 | Status badges | "Beta" badge teal, "Coming soon" badge neutral — all AAA contrast | |
| 6.3 | Detail (`/products/{slug}`) | Title, tagline, CTA button or "Coming soon" disabled state, prose content | |

## 7. Talks Pages

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 7.1 | Index (`/talks`) | Featured talk with YouTube embed, "ALL TALKS" list with Video/Notes pills | |
| 7.2 | YouTube iframe | `sandbox="allow-scripts allow-same-origin allow-presentation"`, `loading="lazy"`, nocookie domain | |
| 7.3 | Preconnect | `<link rel="preconnect" href="https://www.youtube-nocookie.com">` in head | |
| 7.4 | Detail (`/talks/{slug}`) | Event label, title, date, YouTube embed, sidebar details (sticky), prev/next nav | |

## 8. Reading Page (`/reading`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 8.1 | Book list | Books with cover images (or placeholder), title, author, status badge, quick take | |
| 8.2 | Cover images | `width="64" height="96"` attributes, `loading="lazy"`, `alt="Cover of {title}"` | |
| 8.3 | Status badges | "Reading" teal, "Finished" neutral — AAA contrast in both modes | |
| 8.4 | Preconnect | `<link rel="preconnect" href="https://m.media-amazon.com">` in head | |

## 9. Newsletter Page (`/newsletter`)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 9.1 | Layout | Centered card with "NEWSLETTER" label, title, description | |
| 9.2 | Status | "Newsletter launching soon." message | |
| 9.3 | What to expect | Deep/signal post cadence description | |

## 10. 404 Page

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 10.1 | Navigate to `/nonexistent` | 404 page renders | |
| 10.2 | Content | "404" number, witty tagline, 3 CTA buttons (blog, projects, home) | |
| 10.3 | Terminal code | Visible without opacity reduction (using --text-muted color) | |
| 10.4 | Noindex | `<meta name="robots" content="noindex">` present | |

## 11. SEO Verification

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 11.1 | robots.txt | `GET /robots.txt` → `User-agent: *`, `Allow: /`, `Sitemap: https://rajat.dev/sitemap-index.xml` | |
| 11.2 | RSS feed | `GET /feed.xml` → valid RSS 2.0 with `content:encoded` namespace, 5 items | |
| 11.3 | JSON feed | `GET /feed.json` → JSON Feed v1.1 with 5 items | |
| 11.4 | Sitemap | `GET /sitemap-index.xml` → generated by @astrojs/sitemap | |
| 11.5 | Homepage meta | title, description, canonical, og:type="website", og:image, twitter:card, JSON-LD (Person + WebSite) | |
| 11.6 | Blog post meta | og:type="article", article:published_time, article:author, article:tag, JSON-LD (BlogPosting) | |
| 11.7 | Meta author | `<meta name="author" content="Rajat Vijay">` on all pages | |
| 11.8 | OG image | `og:image` and `twitter:image` resolve to `/og-default.png` (1200x630) | |
| 11.9 | Favicon | SVG data URI + `/favicon-32x32.png` + `/apple-touch-icon.png` (180x180) | |

## 12. Accessibility (WCAG 2.1 AAA)

### 12.1 Color Contrast (1.4.6 — 7:1 for normal text)

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 12.1.1 | text-muted light | `#555249` on `#FAFAF8` = 7.47:1 | |
| 12.1.2 | text-muted dark | `#B5B2AA` on `#1C1B18` = 8.13:1 | |
| 12.1.3 | text-secondary light | `#504E49` on `#FAFAF8` = 7.95:1 | |
| 12.1.4 | text-secondary dark | `#B8B5AD` on `#1C1B18` = 8.41:1 | |
| 12.1.5 | btn-primary | `#FFFFFF` on `#8A3519` = 8.06:1 | |
| 12.1.6 | copy-link | Uses `var(--teal-text)` not `var(--teal)` | |
| 12.1.7 | coming-soon badge light | `var(--neutral-800)` on `var(--neutral-200)` | |
| 12.1.8 | coming-soon badge dark | `#D5D3CD` on `var(--neutral-800)` | |
| 12.1.9 | Dark pills | pill-coral `#F5B39E`, pill-teal `#78D4B5` — both ≥7:1 | |

### 12.2 Structure & Semantics

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 12.2.1 | Heading hierarchy | h1 → h2 (sections) → h3 (items), no skipped levels | |
| 12.2.2 | Section labels | All section labels are `<h2 class="label">`, not `<span>` | |
| 12.2.3 | Landmarks | `<header>` (banner), `<main>`, `<nav>` (Main/Footer), `<footer>` (contentinfo) | |
| 12.2.4 | Skip link | First Tab → "Skip to content" link appears, activates `#main-content` | |
| 12.2.5 | aria-current | Active nav link has `aria-current="page"` | |

### 12.3 Keyboard Navigation

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 12.3.1 | Tab order | Skip link → logo → nav links → dark toggle → main content links → footer | |
| 12.3.2 | Focus rings | Coral outline (2px, 2px offset) visible on all focused elements | |
| 12.3.3 | Mobile menu | Open → focus to first link; Escape → close + focus to button | |
| 12.3.4 | Theme toggle | `role="switch"`, `aria-checked` updates on click | |

### 12.4 Motion & Animation

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 12.4.1 | Reduced motion | `@media (prefers-reduced-motion: reduce)` exists in CSS | |
| 12.4.2 | Effect | All transitions/animations set to 0.01ms, scroll-behavior: auto | |

### 12.5 ARIA & Screen Reader

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 12.5.1 | Social SVGs | `aria-hidden="true"` and `focusable="false"` on all icon SVGs | |
| 12.5.2 | Decorative elements | arc-dots, reading-spine have `aria-hidden="true"` | |
| 12.5.3 | External links | Footer social links have "(opens in new tab)" sr-only text | |
| 12.5.4 | GitHub grid | `role="img"` with descriptive `aria-label` | |
| 12.5.5 | Reading progress | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | |

## 13. Performance

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 13.1 | Hero image | `public/rajat.jpg` ≤ 30KB, 400x400px, no EXIF | |
| 13.2 | Grain overlay | Uses `/noise.png` (static tile), not SVG feTurbulence | |
| 13.3 | Body transitions | No `transition` on body element | |
| 13.4 | Scroll handler | Reading progress uses `requestAnimationFrame` throttle | |
| 13.5 | fetchpriority | Hero `<img>` has `fetchpriority="high"` | |
| 13.6 | Font loading | 3 woff2 fonts with `font-display: swap`, only Inter + Playfair preloaded | |

## 14. Security

| # | Test Case | Expected | Status |
|---|-----------|----------|--------|
| 14.1 | CSP | `upgrade-insecure-requests` present in vercel.json CSP header | |
| 14.2 | X-DNS-Prefetch-Control | `off` header present | |
| 14.3 | YouTube sandbox | `sandbox="allow-scripts allow-same-origin allow-presentation"` on iframes | |
| 14.4 | .env | Only `GITHUB_TOKEN`, no unused tokens | |
| 14.5 | .env.example | Exists with `GITHUB_TOKEN=` | |
| 14.6 | github.ts | `fetchGitHub` has try/catch + GraphQL error check | |

## 15. Console Errors

| # | Page | Expected Errors | Status |
|---|------|-----------------|--------|
| 15.1 | `/` | Zero | |
| 15.2 | `/writing` | Zero | |
| 15.3 | `/writing/{slug}` | Zero | |
| 15.4 | `/writing/tag/{tag}` | Zero | |
| 15.5 | `/projects` | Zero | |
| 15.6 | `/projects/{slug}` | Zero | |
| 15.7 | `/products` | Zero | |
| 15.8 | `/products/{slug}` | Zero | |
| 15.9 | `/talks` | Zero | |
| 15.10 | `/talks/{slug}` | Zero | |
| 15.11 | `/reading` | 4x Amazon image 404s (expected in local dev, works in prod) | |
| 15.12 | `/newsletter` | Zero | |
| 15.13 | `/nonexistent` (404) | Zero | |

---

## Bugs Found During Testing

| # | Bug | Severity | Fix |
|---|-----|----------|-----|
| 1 | Nested `<a>` tags on writing index — tag `<a>` inside post `<a>` caused browser to split into empty ghost links | P1 (invalid HTML) | Moved tag links outside parent `<a>` element (commit `fc8217c`) |

---

## How to Run

### Manual Testing
Follow each section above, checking off each test case.

### Automated (Browser DevTools MCP)
```
1. Start dev server: npm run dev
2. Use Chrome DevTools MCP to:
   - navigate_page to each URL
   - take_screenshot for visual verification
   - take_snapshot for a11y tree inspection
   - evaluate_script for meta tag/JSON-LD/heading verification
   - list_console_messages for error checking
   - emulate viewport for mobile testing
   - press_key Tab/Escape for keyboard nav testing
```

### Quick Smoke Test Script
```js
// Run in browser console on each page:
(() => {
  const issues = [];

  // Check heading hierarchy
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  let lastLevel = 0;
  headings.forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (level > lastLevel + 1) issues.push(`Skipped heading: ${h.tagName} after H${lastLevel}`);
    lastLevel = level;
  });

  // Check empty links
  document.querySelectorAll('a[href]').forEach(a => {
    if (!a.textContent.trim() && !a.querySelector('img,svg'))
      issues.push(`Empty link: ${a.href}`);
  });

  // Check images without alt
  document.querySelectorAll('img:not([alt])').forEach(img => {
    issues.push(`Image without alt: ${img.src}`);
  });

  // Check aria-current on nav
  const activeNav = document.querySelector('nav[aria-label="Main navigation"] .active');
  if (activeNav && !activeNav.getAttribute('aria-current'))
    issues.push('Active nav link missing aria-current');

  console.log(issues.length ? issues : 'All checks passed!');
})();
```
