---
title: "feat: Add Products Section"
type: feat
date: 2026-03-20
---

# Add Products Section

## Overview

Add a new top-level Products section (`/products`) showcasing things Rajat has built and makes available — web apps, mobile apps, open source tools, templates, and digital downloads. Each product gets its own markdown-driven detail page. The section supports 7+ products across all pricing models (free, freemium, one-time, subscription).

## Problem Statement

Currently the site has "Projects" (case studies of work at Certa) but no way to showcase independent products that visitors can actually use, download, or buy. These are two different things — projects show *what you did*, products show *what you ship*.

## Proposed Solution

Follow the exact same pattern as talks and projects: a content collection with markdown files, a listing page, and dynamic detail pages. Products get their own nav slot.

## Technical Approach

### Content Collection

**`src/content/products/*.md`** — one file per product.

**Schema (`src/content.config.ts`):**

```typescript
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),                    // One-liner below the title
    description: z.string(),                // SEO / card description
    color: hexColor,                        // Brand color for icon
    icon: z.string().default(''),           // Emoji or empty for color swatch
    type: z.enum(['web', 'mobile', 'oss', 'template', 'download']),
    pricing: z.enum(['free', 'freemium', 'paid', 'subscription']),
    url: z.string().url(),                  // Primary CTA link
    featured: z.boolean().default(false),
    techStack: z.array(z.string()).default([]),
    status: z.enum(['live', 'beta', 'coming-soon']).default('live'),
  }),
});
```

**Example product file — `src/content/products/logs-and-gains.md`:**

```markdown
---
title: "Logs & Gains"
tagline: "A personal fitness tracking app"
description: "Track workouts, nutrition, and progress with a clean minimal interface."
color: "#D85A30"
icon: ""
type: mobile
pricing: free
url: "https://logsandgains.app"
featured: true
techStack: ["React Native", "TypeScript", "Supabase"]
status: live
---

## What it does

A fitness tracker that doesn't try to be everything...

## Why I built it

Most fitness apps are bloated...
```

### Pages

#### Listing — `src/pages/products/index.astro`

- Grid of product cards (similar density to projects listing)
- Each card shows: color icon, title, tagline, type pill, pricing pill
- Cards link to `/products/[slug]`
- Filter row at top by type (Web, Mobile, OSS, Template, Download) — pills like the writing tags
- Featured products get a subtle highlight (coral left border)

#### Detail — `src/pages/products/[slug].astro`

Layout (top to bottom):
1. **Header** — color icon, title, tagline
2. **Meta row** — type pill, pricing pill, status badge, tech stack pills
3. **CTA button** — "Try it free →", "Get it →", "View on GitHub →" etc. (derived from pricing + type)
4. **Divider**
5. **Markdown body** — themed prose (same styles as project pages)

CTA label logic:
- `free` + `oss` → "View on GitHub →"
- `free` + `web` → "Try it free →"
- `free` + `mobile` → "Download →"
- `freemium` → "Try it free →"
- `paid` / `subscription` → "Get started →"
- `coming-soon` status → "Notify me →" (disabled style)

### Navigation

Add "Products" to the header nav in `src/components/Header.astro`:

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/products', label: 'Products' },  // NEW
  { href: '/talks', label: 'Talks' },
  { href: '/about', label: 'About' },
];
```

Also add to footer links in `src/components/Footer.astro`.

### Homepage Integration

Add a "PRODUCTS" section on the homepage between "SELECTED PROJECTS" and the footer. Show 3 featured products as cards (same pattern as project cards).

## Files to Create/Modify

### New files:
- `src/content/products/*.md` — product content files (start with 2-3 examples)
- `src/pages/products/index.astro` — listing page
- `src/pages/products/[slug].astro` — detail page

### Modified files:
- `src/content.config.ts` — add `products` collection + schema
- `src/components/Header.astro` — add Products to nav
- `src/components/Footer.astro` — add Products to footer links
- `src/pages/index.astro` — add featured products section

## Acceptance Criteria

- [ ] Content collection with Zod schema validates all product fields
- [ ] Listing page at `/products` renders all products as a card grid
- [ ] Each product has a detail page at `/products/[slug]`
- [ ] Detail page renders markdown body with themed prose styles
- [ ] CTA button label adapts based on pricing + type
- [ ] Type and pricing pills use existing pill styles (coral/teal)
- [ ] Status badge shows for beta/coming-soon products
- [ ] Products nav link appears in header and footer
- [ ] Featured products appear on homepage
- [ ] Dark mode works correctly
- [ ] Mobile responsive
- [ ] Build passes with 0 errors

## Design Notes

- Product cards follow the same visual language as project cards (surface-card, color icon, hover lift)
- Pricing pill: `free` → teal, `freemium` → teal, `paid`/`subscription` → coral
- Type pill: always teal (matches tech-pill style)
- Status badge: `live` → no badge, `beta` → teal outline pill, `coming-soon` → muted outline pill
- Detail page CTA is a `btn-primary` (coral background)
- Markdown prose uses the same themed styles from project detail pages (coral h2 labels, teal bullets, etc.)
