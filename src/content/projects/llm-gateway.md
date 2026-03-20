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
