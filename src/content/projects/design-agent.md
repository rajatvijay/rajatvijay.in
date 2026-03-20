---
title: "Studio / Design Agent"
subtitle: "No-code workflow creation via natural language"
role: "Lead / Architect"
timeline: "2024 → ongoing"
team: "8 engineers"
color: "#D85A30"
techStack: ["React", "TypeScript", "Claude API", "Portkey", "Qdrant"]
featured: true
problem: "No-code platforms still require structured workflow thinking. At Certa, 73% of new users dropped off at condition configuration."
approach: "Built a multi-agent system: users describe workflows in natural language, the Design Agent translates to JSON DSL with a validation loop."
impact:
  - { metric: "3.2x", label: "Faster workflow creation" }
  - { metric: "↓ 58%", label: "Drop-off at config step" }
decisions:
  - title: "Why multi-agent over single prompt?"
    detail: "Single-shot produced correct syntax but wrong semantics."
  - title: "Schema-aware chunking vs. full-context"
    detail: "200+ node types. Chunking by category cut costs 4x."
---

## The problem

No-code platforms still require structured workflow thinking. At Certa, 73% of new users dropped off at condition configuration. The conditions themselves weren't complex — they were things like "send an email when a vendor's risk score changes." But expressing that as a structured workflow with triggers, conditions, and actions required users to think in our system's language.

## The approach

Built a multi-agent system: users describe workflows in natural language, the Design Agent translates to JSON DSL with a validation loop.

This isn't just a prompt-to-JSON converter. It's a multi-agent system:

1. **Intent parser** — understands what the user wants
2. **Schema validator** — ensures the output matches the workflow DSL
3. **Feedback loop** — shows the user what it understood and iterates

## Key decisions

**Why multi-agent over single prompt?** Single-shot produced correct syntax but wrong semantics. A multi-agent architecture let us separate intent understanding from schema compliance.

**Schema-aware chunking vs. full-context.** With 200+ node types, sending the full schema in every prompt was expensive and noisy. Chunking by category cut costs 4x while maintaining accuracy.
