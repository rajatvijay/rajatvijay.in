---
title: "feat: Add Buttondown newsletter subscription"
type: feat
date: 2026-03-22
---

# feat: Add Buttondown newsletter subscription

## Overview

Replace the "coming soon" newsletter placeholder with a working Buttondown email subscription form. Users can subscribe from the dedicated `/newsletter` page and inline after blog posts, without leaving `rajat.dev`.

## Problem Statement

The site has a `NewsletterSignup` component and a `/newsletter` page that both display "launching soon" text. There is no way for visitors to actually subscribe. The `DetailCTA` at the bottom of blog posts links to the placeholder page. This is a dead end for engaged readers who want to follow the newsletter.

## Proposed Solution

Integrate Buttondown's public embed-subscribe endpoint via **client-side fetch**. The form submits to `https://buttondown.com/api/emails/embed-subscribe/vijay` with JSON content type. No API key is needed (this is a public, unauthenticated endpoint identified by username). The user stays on `rajat.dev` throughout — custom success/error states are rendered inline.

**Why client-side fetch over HTML form POST:** A form POST navigates the user to Buttondown's Turnstile CAPTCHA page with no return path to `rajat.dev`. The fetch approach keeps users on-site with a better UX. Buttondown's CORS headers (`Access-Control-Allow-Origin: *`) make this viable.

## Technical Approach

### Integration Contract

**Endpoint:** `POST https://buttondown.com/api/emails/embed-subscribe/vijay`

**Request:**
```
Content-Type: application/x-www-form-urlencoded
Body: email=subscriber@example.com&embed=1
```

**Response:** HTML body in all cases. Determine outcome by HTTP status code:
- 2xx → success (subscription pending confirmation)
- 400 → error (invalid email, already subscribed, or missing field)
- 429 → rate limited
- 5xx → server error

**No API key needed.** The username in the URL is the identifier. Buttondown uses double opt-in by default — success means "confirmation email sent," not "subscribed."

### Architecture

The site is Astro SSG (fully static). No server-side code. The integration is entirely client-side:

1. HTML `<form>` for progressive enhancement and accessibility
2. `<script>` block intercepts submit, calls `fetch()`, manages UI states
3. Honeypot hidden field for basic bot protection
4. CSP update in `vercel.json` to allow `connect-src https://buttondown.com`

### Form States

| State | UI | Button | Input |
|-------|-----|--------|-------|
| Default | Form visible, empty | "Subscribe" | Enabled, placeholder "you@example.com" |
| Submitting | — | "Subscribing..." | Disabled |
| Success | Form replaced with success message | Hidden | Hidden |
| Error (validation) | Inline error below input | "Subscribe" | Enabled, focused |
| Error (network/server) | Inline error below input | "Try again" | Enabled |

### Form Layout

**`full` variant** (newsletter page): Centered, max-width 560px. Horizontal layout — email input and button on one line. Stacks vertically below 480px.

**`inline` variant** (blog posts): Left-aligned within content width. Same horizontal layout. Same mobile stack.

Both variants show a brief privacy note below the form: "No spam. Unsubscribe anytime."

### Implementation Phases

#### Phase 1: CSP Update

Update `vercel.json` to add `https://buttondown.com` to `connect-src`:

```diff
- connect-src 'self'
+ connect-src 'self' https://buttondown.com
```

**File:** `vercel.json` (line 12)

#### Phase 2: Update NewsletterSignup Component

Replace the "Newsletter launching soon." text with a working form in `NewsletterSignup.astro`.

**Form HTML structure:**
```html
<form class="newsletter-form" aria-label="Newsletter subscription">
  <div class="newsletter-form-fields">
    <label for="newsletter-email" class="sr-only">Email address</label>
    <input
      type="email"
      id="newsletter-email"
      name="email"
      placeholder="you@example.com"
      autocomplete="email"
      required
      aria-describedby="newsletter-status"
    />
    <!-- Honeypot for bots -->
    <input type="text" name="url" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button type="submit" class="btn btn-primary">Subscribe</button>
  </div>
  <p class="newsletter-privacy">No spam. Unsubscribe anytime.</p>
  <div id="newsletter-status" role="status" aria-live="polite"></div>
</form>
```

**Client-side script (~30 lines):**
- Intercept form `submit` event with `preventDefault()`
- Check honeypot field — if filled, silently "succeed" (bot)
- Disable input + button, change button text to "Subscribing..."
- `fetch()` to Buttondown endpoint with JSON body
- On success (2xx): replace form with "Check your inbox to confirm your subscription!" message, move focus to it
- On 400: show "Something went wrong. Please check your email and try again." below input
- On 429: show "Too many requests. Please try again later."
- On network error / 5xx: show "Something went wrong. Please try again."
- Re-enable input + button on error

**Styles:**
- Use existing `.btn-primary` for the submit button
- Input styled with existing design tokens (`var(--surface)`, `var(--text)`, `var(--border)`)
- Error text: `var(--coral)` (already AAA-compliant in both themes)
- Success text: `var(--teal)` (already AAA-compliant)
- `@media (max-width: 480px)`: stack input and button vertically
- `@media (prefers-reduced-motion: reduce)`: no transitions on state changes

**File:** `src/components/NewsletterSignup.astro`

#### Phase 3: Update Newsletter Page

Remove the "Launching soon. In the meantime, follow me on X for updates." paragraph. The form itself replaces this messaging.

Keep the "What to expect" section — it provides context for why someone should subscribe.

**File:** `src/pages/newsletter.astro`

#### Phase 4: Activate Inline Variant in Blog Posts

The import already exists (unused) in `src/pages/writing/[slug].astro` (line 3). Render `<NewsletterSignup variant="inline" />` after the blog post content, replacing or complementing the existing `DetailCTA`.

**Decision:** Keep `DetailCTA` but change its text from "Subscribe to the blog" to something complementary, or remove it in favor of the inline form. The inline form is more actionable than a link.

**File:** `src/pages/writing/[slug].astro`

#### Phase 5: Clean Up Unused Code

- Remove the static "Newsletter launching soon." text from `NewsletterSignup.astro`
- Remove unused import if `DetailCTA` is replaced by inline form in `[slug].astro`

## Files to Modify

| File | Change |
|------|--------|
| `vercel.json` | Add `https://buttondown.com` to `connect-src` in CSP |
| `src/components/NewsletterSignup.astro` | Replace placeholder with form, add script, add styles |
| `src/pages/newsletter.astro` | Remove "launching soon" copy |
| `src/pages/writing/[slug].astro` | Activate inline `NewsletterSignup` component |
| `src/components/DetailCTA.astro` | Potentially remove or update (depending on inline form decision) |

No new files needed.

## Acceptance Criteria

### Functional
- [x] Email input + subscribe button renders on `/newsletter` page
- [x] Email input + subscribe button renders inline after each blog post
- [x] Submitting a valid email calls Buttondown's embed-subscribe endpoint
- [x] Success state shows "Check your inbox to confirm your subscription!"
- [x] Error state shows an appropriate message for invalid email, network error, and rate limit
- [x] Honeypot field is present and hidden; bots filling it see a fake success
- [x] Form disables during submission to prevent double-submit
- [x] Button text changes to "Subscribing..." during submission
- [x] "Launching soon" text is removed from all locations

### Accessibility (WCAG AAA)
- [x] Email input has a visible or screen-reader-accessible label (`<label>` or `aria-label`)
- [x] Error/success messages announced via `aria-live="polite"` region
- [x] Focus moves to success message after successful submission
- [x] Focus moves to error message or back to input on validation error
- [x] All new elements meet 7:1 contrast ratio (AAA)
- [x] Input and button meet 44x44px minimum target size
- [x] `autocomplete="email"` on the input
- [x] Full keyboard operability (Tab to input, Tab to button, Enter to submit)
- [x] `prefers-reduced-motion` respected (no transitions when reduced)

### Security
- [x] CSP updated with minimal changes (only `connect-src` addition)
- [x] No API keys exposed in client-side code
- [x] Honeypot field for basic bot protection

### Design
- [x] Form uses existing design tokens (`.btn-primary`, `var(--surface)`, etc.)
- [x] Dark mode support (all states)
- [x] Responsive: horizontal on desktop, stacked below 480px
- [x] Both `inline` and `full` variants styled appropriately
- [x] Privacy note visible below form

## Design Notes

- The form is the first `<form>` element on the entire site — keep it simple and consistent with the existing minimal aesthetic
- Use the existing `.btn-primary` coral button style; don't introduce new button variants
- Error color: `var(--coral)` — already used for accents and verified AAA-compliant
- Success color: `var(--teal)` — already used for tags and verified AAA-compliant
- The Buttondown endpoint returns HTML regardless of `Accept` header — don't try to parse the response body; use status codes only

## References

- Buttondown embed endpoint: `https://buttondown.com/api/emails/embed-subscribe/{username}`
- Buttondown CORS: `Access-Control-Allow-Origin: *` (verified)
- Existing component: `src/components/NewsletterSignup.astro`
- Existing page: `src/pages/newsletter.astro`
- CSP config: `vercel.json` (line 12)
- Design tokens: `src/styles/global.css`
- Blog post template: `src/pages/writing/[slug].astro`
