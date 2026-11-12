---
name: seat-handover
description: Reset an orchestrator or Lead seat without losing its judgment. Sweeps corrections, closed rulings, review instincts and state into the seat doc, updates tracker or epic status, commits, and prints the successor's resume pointer. Argument names what comes next ("for P7 P8").
---

# Seat handover

Facts live in the tracker. What dies with this context is judgment; this ritual keeps it.

## Sweep

1. **Tracker or epic current:** Status grid, decisions log, dangling state. A durable invariant graduates now, by kind (the seam's law file, else the project law).
2. **The seat doc** `docs/handoff/seat-<feature>.md`, from `_template-seat.md`, about 120 lines; two seats on one tracker keep `seat-<feature>-<pane>.md` each, and the pane name is frontmatter, never the key. In place means rewritten to current state, never appended; a span note replaces the last one. An orchestrator's doc lives as long as its feature and retires with the tracker; a new feature starts fresh. The Lead's doc is standing across features and never retires. An instinct that keeps earning graduates into the law or `brief-review`, not into the next doc. Sections: State · Corrections to your own earlier claims · Closed rulings · Still open, one line per phase · Tried and didn't work · Gotchas · Open doubts · Fleet craft, when you drove seats · Resume. The three middle ones hold what the tracker never shows: an approach that failed and why, so nobody retries it; a trap in the code or rig (a flaky test, a misleading name, a required flag); a suspicion not yet proven. A few lines each, empty when there is none; a doubt proven or settled moves to Closed rulings or goes, a fixed gotcha goes, and one that keeps coming back graduates into the law.
3. **Epic runs:** close this run's row, open the next, check each child agrees.
4. **Issues:** none touched. A tracker the owner wanted an issue for and that lacks one gets `/seats:tracker-new <name> issue` now.
5. **Commit the docs** per project law. Code commits are not this ritual's; uncommitted code is flagged, never swept.

## Quiescence

Done only when no background task of this session runs, every launched build's commit has landed or was folded or abandoned explicitly, and `git status` shows no agent-authored edits. A `/clear` kills a subagent mid-edit; a peer seat's commit must have landed. Work in flight: finish the sweep, say what you wait on, finish in a later turn.

## End

`Resume by reading docs/handoff/seat-<feature>.md, then <tracker>.` · `Next action: <one sentence>.` · `Blocked on: <thing, or "nothing">.`

Then seat the successor:

- **Always:** run `seat_handover` (or `seat handover <your name> --pointer -` in Bash) with the three lines. It opens the successor beside this pane, sends the pointer and gives it your name. The successor runs on Opus 5.5 at high effort unless the owner named another ("hand over to Fable", "Opus high"): then pass `model` and `effort` (`--model`, `--effort` in Bash). An orchestrator's pane closes once the successor settles, and the Lead is told. A Lead stays as `<repo>-cc-lead-advisor` and the name moves at once; `close` only on the owner's "no advisor". Quiescence first: a builder of this session must have landed.
- **The Lead may do it for you:** when it asks for your three lines instead, send them and stop; it runs the same handover on your seat.

## Rules

Read ritual plus doc writes; no gates. Brief before reset: `/seats:brief-write` first while judgment is live, then this, unless the context is already degraded.
