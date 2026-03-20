# rajat.dev — Personal Website

Personal website for Rajat, Director of Engineering & AI at Certa. Built with Astro, following the design system in `docs/rajat_website_design_system.pdf`.

## Quick Start

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Structure

```
src/
├── content/          # Markdown content (blog posts, projects)
│   ├── blog/         # Blog posts with frontmatter
│   └── projects/     # Project case studies
├── components/       # Astro components
├── data/             # JSON data (reading, talks, schedule)
├── layouts/          # Base layout with head, header, footer
├── pages/            # File-based routing
│   ├── index.astro          # Homepage ("The Arc")
│   ├── writing/              # Blog listing + [slug] pages
│   ├── projects/             # Project listing + [slug] pages
│   ├── about.astro           # Bio, day-in-my-life, beliefs
│   ├── talks.astro           # Speaking & talks
│   ├── reading.astro         # Reading shelf
│   ├── newsletter.astro      # Newsletter signup
│   ├── 404.astro             # Custom 404
│   ├── feed.xml.ts           # RSS feed
│   └── feed.json.ts          # JSON feed
└── styles/
    └── global.css    # Design tokens, typography, utilities
```

## Adding Content

**Blog post:** Create `src/content/blog/my-post.md` with frontmatter:
```yaml
---
title: "Post Title"
description: "Short description"
date: 2026-03-20
tags: ["AI", "Leadership"]
readTime: 8
featured: false
tldr: "Optional TL;DR for the callout box"
---
```

**Project:** Create `src/content/projects/my-project.md` — see existing files for schema.

**Reading list:** Edit `src/data/reading.json`.

**Talks:** Edit `src/data/talks.json`.

## Design System

- **Colors:** Coral accent, warm gray neutrals, teal for code/links
- **Fonts:** Inter (sans), Instrument Serif (hero), JetBrains Mono (code)
- **Dark mode:** Toggle in header, persisted to localStorage, grain texture overlay
- Full spec: `docs/rajat_website_design_system.pdf`

## Deploy

Static output — deploy to Vercel, Netlify, or any static host. Set `site` in `astro.config.mjs` to your domain.
