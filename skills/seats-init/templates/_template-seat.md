---
type: seat
tracker: plan-<feature>     # the authoritative doc; this file is orientation, never a substitute
seat: <pane name>           # diagnostic; the file is keyed by feature, not by pane
lead: <seat name or none>
head: <sha>                 # HEAD at last update
written: YYYY-MM-DD         # re-stamped at every rewrite
platform: claude-code       # diagnostics only
---

# Seat — <feature>

> Written YYYY-MM-DD by the seat for its own successor. Rewritten in place each span, never appended; retires with the tracker (the Lead's `seat-lead` is standing). Facts live in [[plan-<feature>]]; this holds what a fresh context cannot recover from it. Conventions: [[_conventions]].

## State as of YYYY-MM-DD

Branch `<branch>`, <pushed / unpushed, and who pushes>.

| Commit | What |
|---|---|
| `<sha>` | <phase, one line> |

**Done:** <P…>. **Open:** <P… (briefed in [[brief-…]]), P…>.

## Corrections to my own earlier claims (do not re-assert)

- I said <X>. The code showed <Y>.

## Closed rulings (do not reopen without new evidence)

- <ruling and its scope, one line>

## Still open, one line each

- **P<n>** — <the single load-bearing sentence>

## Tried and didn't work (do not retry without new evidence)

- <approach> — <why it failed, one line>

## Gotchas

- <trap in the code or rig: flaky test, misleading name, required flag or setup>

## Open doubts

- <a suspicion not yet proven, and what would settle it>

## Fleet craft (only when this seat drove other seats)

- <which pane holds which tracker and owns which docs; what is waiting on the owner>

## Resume

- `Resume by reading <this file>, then [[plan-<feature>]].`
- `Next action: <one sentence>.`
- `Blocked on: <thing, or "nothing">.`
