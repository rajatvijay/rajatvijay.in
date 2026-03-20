---
title: "Building an Internal LLM Gateway with Portkey"
description: "How we built a self-serve API provisioning system for LLM access across engineering teams."
date: 2026-02-10
tags: ["AI", "Tutorial"]
readTime: 6
featured: false
tldr: "A centralized LLM gateway gives you cost control, rate limiting, and model-agnostic switching — here's how we built one with Portkey."
---

When multiple teams at Certa started using LLMs independently, we had a problem: no visibility into costs, no rate limiting, and no way to switch models without code changes.

## The problem

Each team was:
- Managing their own API keys
- Hard-coding model choices
- No budget visibility until the bill arrived
- No fallback when a provider had an outage

## The gateway approach

We built an internal LLM Gateway using Portkey that gives every team:

1. **Self-serve API keys** with per-team budgets
2. **Model-agnostic routing** — switch from GPT-4 to Claude without code changes
3. **Automatic fallbacks** — if one provider is down, traffic routes to another
4. **Cost dashboards** — real-time spend tracking per team and per feature

## Implementation

The gateway sits between our services and LLM providers. Teams hit our internal endpoint, and the gateway handles routing, caching, and observability.

```typescript
const response = await gateway.chat({
  messages: [{ role: 'user', content: prompt }],
  config: { team: 'risk-scoring', budget: 'standard' }
});
```

## Results

- 40% cost reduction from caching and model routing
- Zero downtime during provider outages
- 12 teams onboarded in the first month

If you're running more than two teams using LLMs, you need a gateway. The ROI is immediate.
