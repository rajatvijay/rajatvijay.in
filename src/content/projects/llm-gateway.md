---
title: "LLM Gateway"
subtitle: "Self-serve API provisioning for enterprise LLM access"
role: "Architect"
timeline: "2025 → ongoing"
team: "4 engineers"
color: "#1D9E75"
techStack: ["TypeScript", "Portkey", "Redis", "CloudFlare Workers"]
featured: true
problem: "12 teams using LLMs independently with no cost visibility, no rate limiting, and hard-coded model choices."
approach: "Centralized gateway using Portkey for routing, caching, fallbacks, and per-team budget controls."
impact:
  - { metric: "40%", label: "Cost reduction" }
  - { metric: "0", label: "Provider outage downtime" }
decisions:
  - title: "Gateway vs. SDK wrapper"
    detail: "A gateway is language-agnostic and lets us add features without team coordination."
  - title: "Portkey over custom build"
    detail: "Build-vs-buy: Portkey's routing layer would have taken 3 months to replicate."
---

## The problem

12 teams using LLMs independently with no cost visibility, no rate limiting, and hard-coded model choices. Each team managed their own API keys, had no budget visibility until the bill arrived, and no fallback when a provider had an outage.

## The approach

Centralized gateway using Portkey that gives every team:

- **Self-serve API keys** with per-team budgets
- **Model-agnostic routing** — switch from GPT-4 to Claude without code changes
- **Automatic fallbacks** — if one provider is down, traffic routes to another
- **Cost dashboards** — real-time spend tracking per team and per feature

## Key decisions

**Gateway vs. SDK wrapper.** A gateway is language-agnostic and lets us add features (caching, rate limiting, fallbacks) without coordinating across 12 teams.

**Portkey over custom build.** Build-vs-buy: Portkey's routing layer would have taken 3 months to replicate. We shipped in 3 weeks instead.
