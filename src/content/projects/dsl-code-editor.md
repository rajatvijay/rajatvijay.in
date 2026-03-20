---
title: "DSL Code Editor"
subtitle: "NL editing for JSON DSL configurations"
role: "Lead"
timeline: "2025"
team: "3 engineers"
color: "#6B6860"
techStack: ["React", "Monaco Editor", "Claude API", "JSON Schema"]
featured: true
problem: "Power users needed to edit complex JSON DSL configurations but the raw JSON was error-prone and hard to navigate."
approach: "Built a Monaco-based editor with natural language commands that generate valid DSL patches, validated against the schema in real-time."
impact:
  - { metric: "5x", label: "Faster config editing" }
  - { metric: "↓ 90%", label: "Validation errors" }
decisions:
  - title: "Monaco vs. custom editor"
    detail: "Monaco's LSP support gave us free autocomplete and error highlighting."
  - title: "Patch-based NL editing"
    detail: "Generating full configs from NL was unreliable. Patch-based edits on existing configs worked better."
---
