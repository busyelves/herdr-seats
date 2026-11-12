---
name: run-phases
description: Run the brief, build, review, fold loop for the named phases without supervision, as the orchestrator. Argument names the phases ("P4 P5 P6"), plus `fast` for fast mode; phases that ship together share one brief. Builds through implementer subagents by default; `fast` builds in this pane as fast as it can, where the owner can watch and talk to it. This is what "run it yourself" means.
---

# Run phases

You orchestrate; an implementer subagent builds each brief, so your context stays wide enough to review. In fast mode you are the implementer, and the Lead is your reviewer.

## Fast mode

On `fast` in the argument (or `direct`), or the owner's "fast", "speed up", "no implementers" or "do it yourself": get through the phases as fast as you can. The owner's "fast" means this mode, never Claude Code's `/fast` output setting, which only the owner types.

- **Build it yourself**, phase after phase, in this pane, so the owner sees each edit land and can steer you by typing here. Work in the folder the dispatch names; "live" from the owner means the code checkout they watch.
- **Subagents only when they make you faster**: background helpers for bulky reads, searches, logs and test output; parallel implementers only for parts that are truly independent. Never one just to follow the process; the owner's "no implementers" means none.
- **Per phase**: one dated plan line in the tracker's row instead of a frozen brief, build, check your own diff against it, typecheck and lint only, fold. A decision gets its dated one-line note in the tracker as you make it. No test writing or test runs mid-build.
- **At the end**, in one pass: lean tests, one per behaviour the owner would notice, then the full suite once, then the chain report. While fixing what the suite found, rerun only the failing tests; the full suite runs once more, after the last fix. The Lead reviews the whole range once.
- **Never skipped**: the owner's word for push, PR, merge and deploy; the never list in `docs/away.md`; the full suite before anything merges or deploys.

Fast work fills context faster, so expect the Lead's handover call earlier.

## Start

Print `Chain: P4 → P5 → P6 · serial · builder: subagent` (or `builder: this seat (fast)`) and one line of scope per phase. Group phases that ship together under one brief and say so. A phase that depends on a ruling you do not have: ask the Lead if one is live; otherwise note it and run the phases that do not depend on it.

## Per phase

1. **Brief** with `/seats:brief-write`. Done when the brief is frozen with its `head:` stamp and risk read.
2. **Build** through implementer subagents (the Agent tool), never a Herdr pane: one subagent per landable part, independent parts in parallel, each on the model the dispatch names for builders, else the project's, else this seat's (the Agent tool's `model`), and the risk read's effort. It runs on this seat's account and only its report returns here. Its prompt is the `/seats:brief-build <path>` starter and nothing from your context. Done when each reports.
3. **Steer**: the owner's words to you reach the builder at once, verbatim and dated. A permission the owner gives here goes to the Lead in the same turn by `seat_send`, verbatim, so it lands in `docs/away.md`; with no Lead live, write it there yourself.
4. **Review** with `/seats:brief-review`. Spec-preserving findings are fixed inside this phase; the rest ride the next brief as "(+fixes)". A finding that needs an owner ruling goes to the Lead if live, else parks; the chain continues when later phases do not depend on it.
5. **Fold**: the phase's Status row, dated decisions-log lines, the brief's `executed:`, `built_by:` and `reviewed_by:` stamps, any law graduated by kind. Commit the docs per project law. Send one status line to the Lead if live.

## End

The full suite runs once, here, per the project law's gate cadence. Chain report: per phase, status · commits · fixed in-phase · logged · waiting on the owner. Then `Resume by reading <tracker>.` · `Next action: <the phase you would take next>.` · `Blocked on: <thing, or "nothing">.` If the Lead dispatched you, the report goes to it and it picks what comes next.

## Rules

- Only builds go to subagents; in fast mode, only those that make you faster. The fold, `/seats:checkpoint` and a retire are yours, in this context; never delegate them.
- A builder takes one phase, or one part of a phase, never two phases, even when they share a brief. A builder cannot hand over, so the size of its job is its only context limit.
- Builders run targeted gates per item; you run none mid-review.
- Serial by default; parallel only for phases the owner named as disjoint.
- Trackers only, never issues; a tracker born in the chain is born through `/seats:tracker-new`.
- Low context mid-chain: finish this phase's review and fold, then `/seats:seat-handover`. A builder is never left running at a reset.
