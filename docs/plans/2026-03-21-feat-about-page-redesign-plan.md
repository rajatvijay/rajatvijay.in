---
title: "feat: Redesign About Page"
type: feat
date: 2026-03-21
---

# Redesign About Page

## Overview

Transform the about page from a standard bio + schedule layout into something memorable and distinctive. Replace generic filler sections with content that reveals how Rajat actually thinks, leads, and operates — not just what he's done.

## What to Remove

- **Day-in-my-life timeline + time allocation bars** — 210 LOC of over-engineered visualization for static schedule data. It's impressive engineering but visitors don't care how your Tuesday looks. Remove entirely (also deletes `src/data/schedule.json`).
- **"What I'm working on now"** — redundant with the Building in Public section on the homepage. Remove.

## What to Keep

- **Header** — name, tagline, social links (add real photo later)
- **The Short Version** — concise bio. Tighten the copy.
- **Colophon** — signals craft.

## New Sections

### 1. Career Diff

Instead of a plain career timeline (already on homepage as "The Arc"), show it as a **code diff** — familiar to engineers, nobody does this on a personal site.

```
src/pages/about.astro — Career Diff section
```

**Format:** A styled `<pre>` block that looks like a git diff:

```diff
- Role: Frontend Engineer
+ Role: Director of Engineering & AI

- Team: just me and the DOM
+ Team: 25 engineers across 4 squads

- Stack: React, TypeScript, CSS
+ Stack: React, TypeScript, Python, Claude API, Portkey, Qdrant

- Challenge: pixel-perfect responsive layouts
+ Challenge: multi-agent orchestration at enterprise scale

- Metric: Lighthouse score
+ Metric: 73% drop-off → 15% drop-off
```

Style it with the actual diff colors (green for additions, red/coral for deletions), monospace font, and the familiar `+`/`-` prefix. Put it in a surface-card with a fake filename header like `rajat-career.diff`.

### 2. How I Think (My Stack Beyond Code)

Not a tech stack — a **thinking stack**. Three columns:

| Mental Models | Books That Shaped Me | Tools I Use Daily |
|---|---|---|
| Composability over configuration | Thinking in Systems | Claude Code |
| Ship → measure → iterate | Staff Engineer | Linear |
| 70/20/10 capacity splits | The Art of Action | Excalidraw |
| Defaults beat options | Designing Data Apps | Obsidian |

Render as a 3-column grid of surface-cards, each with a label header and a list. Compact, scannable. On mobile, stack vertically.

### 3. Questions People Ask Me

An expandable FAQ. Each question is a clickable row that reveals the answer. The questions should be real things people DM or ask in 1:1s:

- **"But you're a frontend engineer — how did you end up leading AI?"**
- **"Do you still write code?"**
- **"How do you evaluate ML work without an ML background?"**
- **"What's your advice for someone wanting to move from IC to management?"**
- **"How do you stay technical as a director?"**

Implementation: native `<details><summary>` elements — zero JS, accessible, printable. Style the summary as a bold question with a `+`/`-` toggle indicator.

### 4. Principles (How I Lead)

Not generic beliefs — **specific, opinionated principles** with a one-line explanation:

- **"I never assign work I haven't done myself"** — If I'm asking you to set up a monitoring pipeline, I've already set one up at least once to understand the friction.
- **"Every 1:1 starts with 'what's blocking you?'"** — Not status updates. We have Linear for that.
- **"Ship with 80% confidence"** — The last 20% of certainty costs 80% of the time. Ship, measure, adjust.
- **"The person closest to the problem makes the call"** — Title doesn't equal context. Engineers decide architecture; PMs decide scope.
- **"Celebrate the assist, not just the goal"** — The engineer who unblocked three teammates shipped more than the one who closed three tickets.

Format: Each principle is a bold title followed by a one-line explanation in secondary text. Vertical list with dividers — same visual pattern as "Things I Believe" but with the added context.

## Section Order (Top to Bottom)

1. **Header** — photo, name, tagline, social links
2. **The Short Version** — 3 sentences
3. **Career Diff** — the memorable, shareable centerpiece
4. **How I Think** — 3-column thinking stack
5. **Questions People Ask Me** — expandable FAQ
6. **Principles** — how I lead
7. **Colophon**

## Files to Modify

- `src/pages/about.astro` — full rewrite of template + styles
- `src/data/schedule.json` — **delete** (no longer needed)

## Design Notes

- Career diff uses `--font-mono`, green (`--teal`) for additions, coral for deletions
- Diff block has a "filename" header bar like a code editor tab
- FAQ uses `<details>/<summary>` — no client JS needed
- Thinking stack grid: 3 columns on desktop, 1 on mobile
- Principles: bold title + secondary explanation, with bottom border between items
- All sections use existing design tokens — no new colors or fonts

## Acceptance Criteria

- [ ] Day-in-my-life timeline and schedule.json removed
- [ ] "What I'm working on now" removed
- [ ] Career diff section renders as a styled code diff
- [ ] "How I Think" renders as 3-column grid
- [ ] FAQ uses native `<details>` elements, works without JS
- [ ] Principles section shows title + explanation pairs
- [ ] Dark mode works for all new sections (especially diff colors)
- [ ] Mobile responsive (diff scrolls horizontally, grid stacks)
- [ ] Page is shorter and more focused than current version
