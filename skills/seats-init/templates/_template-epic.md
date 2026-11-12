---
feature: <name>
status: active          # active | shipped
started: YYYY-MM-DD
shipped:                # set at retire: when the SEQUENCING job is done, not when every child ships
issue:                  # "#N" only when born with `/seats:tracker-new … issue`; children attach as sub-issues
tags:                   # union of the children's real work
  - <tag>
---

> Epic governing the `<name>` run: it owns the order, the dependency graph and the cross-tracker contracts; each child tracker owns its own detail. Children: [[plan-a]] [[plan-b]]. Conventions: [[_conventions]].

## Context & direction (locked YYYY-MM-DD)

- **Goal:** <what the arc achieves as a whole>
- **Focus:** <the inviolate core of the order>

## The order & run status

| Run | Tracker | Why this slot | Size | Status |
|-----|---------|---------------|------|--------|
| 1 | [[plan-a]] | <dependency, risk or momentum> | S–L | 🔲 todo |
| 2 | [[plan-b]] | | | 🔲 todo |

**Dependency graph:** <real edges only, e.g. `{1 independent} · 2-P1 → 3 → 4`; say which edges are technical and which are a single-builder choice>

**Critical-path risk:** <the child whose churn could freeze the others, and the de-risking split>

**Flex rules:** <what may move and on what trigger; what never moves>

## Cross-tracker contracts

- **<contract>** — built by [[plan-a]] P1; consumed by [[plan-b]], [[plan-c]]

## Decisions log

- YYYY-MM-DD — <run-level decision and its reasoning, one line>
