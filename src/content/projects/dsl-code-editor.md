---
title: "DSL Code Editor"
subtitle: "NL editing for JSON DSL configurations"
color: "#6B6860"
techStack: ["React", "Monaco Editor", "Claude API", "JSON Schema"]
featured: true
impact:
  - { metric: "5x", label: "Faster config editing" }
  - { metric: "↓ 90%", label: "Validation errors" }
---

## The problem

Power users needed to edit complex JSON DSL configurations but the raw JSON was error-prone and hard to navigate. One misplaced bracket could break an entire workflow, and there was no way to validate changes before saving.

## The approach

Built a Monaco-based editor with natural language commands that generate valid DSL patches, validated against the schema in real-time. Users type what they want to change in plain English, and the editor produces a valid JSON patch.

## Key decisions

**Monaco vs. custom editor.** Monaco's LSP support gave us free autocomplete, syntax highlighting, and error highlighting out of the box. Building this from scratch would have taken months.

**Patch-based NL editing.** Generating full configs from natural language was unreliable — too many edge cases. Patch-based edits on existing configs worked better because the model only needs to understand the delta, not the entire schema.
