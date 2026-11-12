---
feature: <feature>
status: active          # active | shipped
started: YYYY-MM-DD
shipped:                # set at retire; the file moves to docs/outdated/ unrenamed
issue:                  # "#N" only when born with `/seats:tracker-new … issue`
epic:                   # epic-<name> when this is a child tracker
tags:                   # from [[tag-vocabulary]]; only fields this tracker does real work in
  - <tag>
---

> Tracker for `<feature>`: the one state truth for this work, companion to its [[roadmap]] line. Conventions: [[_conventions]].

## Context & direction (locked YYYY-MM-DD)

- **Goal:** <what shipping this achieves>
- **Scope / model:** <how it is being approached>
- **Deferred:** <what is explicitly out, for now>
- **Focus:** <the one thing that matters most>

## Status

| #  | Item        | Status  |
|----|-------------|---------|
| P1 | <work-item> | 🔲 todo |
| P2 | <work-item> | 🔲 todo |

---

## P1 — <work-item>

<one line on why this matters, then the design and file-level notes>

- [ ] <finding or fix> [SEV]

## Deliberately out of scope / deferred

- **<thing>** — <why> (when needed: <what to do>)

## Decisions log

- YYYY-MM-DD — <decision and its reasoning, one line>

## Verification

- **Automated:** <the project's gates for the touched areas, copied from its law>
- **Manual:** <the click-through a human runs against dev with realistic data>

## File map

- **<subsystem>** — `path/a`, `path/b`

## Known issues (orthogonal)

- <issue> — <why it is noted but not fixed here>
