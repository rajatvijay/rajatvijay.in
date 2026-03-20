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
