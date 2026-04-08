---
title: "Mind"
description: "A read-later app you actually own. Self-hostable, offline-first, no algorithms."
summary: "A PWA that installs on any device, works offline, and lets you share URLs straight from your phone's share sheet. Your reading list lives on your own database — no tracking, no feeds, no noise."
url: "https://mind-tawny.vercel.app"
github: "https://github.com/rajatvijay/mind"
techStack: ["Next.js", "React", "Turso", "Drizzle", "Tailwind CSS"]
featured: true
---

Mind is a read-later app you actually own. It's a PWA that installs on any device, works offline, and lets you share URLs straight from your phone's share sheet. Your reading list lives on your own database — no tracking, no feeds, no noise.

## Features

- **Share to save** — share a URL from any app on your phone, Mind catches it
- **Offline-first** — your article list loads instantly from cache, even without a connection
- **Installable** — works as a native app on iOS, Android, and desktop
- **Keyboard-first** — `j`/`k` to navigate, `/` to search, `e` to mark read, `?` for all shortcuts
- **API access** — generate a token to save articles from scripts, shortcuts, or automation
- **Swipe gestures** — swipe right to mark read, left to delete on mobile
- **Dark by default** — easy on the eyes, always

## iOS Shortcut

Save articles from Safari's share sheet using an iOS Shortcut. Share any link from Safari and pick the shortcut — it hits your Mind instance's API and saves the article.
