---
name: checkpoint
description: End a segment. Sweeps everything this session learned into the trackers, law and roadmap, commits the docs, prints a resume pointer, then does what the argument asks (brief the next phase, continue, retire, park). Argument in plain words; "run tests first" or "no tests" steers the gate. Run at phase boundaries, before a reset, at end of day.
---

# Checkpoint

The conversation is about to be discarded; the docs are what remains.

**Run it yourself, in this context, start to finish**. Never through a subagent or another seat, retire included: the sweep's source is what this context holds, and a fresh agent can only re-read the repo to rebuild it, slowly and worse. Too little context left to finish: `/seats:seat-handover` instead.

## Declare first

Print two lines, then keep to them:

- `Ending: handoff for X | continue with X | retire | park | sweep only`
- `Tests: verdict from transcript | run first | not needed`

| Argument | Ending |
|---|---|
| upcoming work named without a do-it-now verb ("plan P5", "next session P5") | handoff |
| "do", "implement", "start P5", "keep going" | continue |
| "done", "retire" | retire |
| "pausing", "switching to X" | park |
| none | sweep only |
| "run the tests", "verify first" | Tests: run first, once, before the sweep, every part named |
| "tests already ran", "no tests" | Tests: not needed |

A verdict not visible in context and not asked for is written as `last verified: unknown — re-run <command>`, never re-run to be sure.

## Sweep, always and in full

It verifies and writes only what is missing: a current section is left alone, a clean tree gets no commit, and `sweep: all current` is a legitimate result.

1. **Trackers touched:** Status grid with SHAs · one dated decisions-log line per ruling made in chat · checkboxes and resolutions, append-only.
2. **Dangling state** into the tracker: unpushed commits, un-run checks, known-failing tests with their cause, where work stopped. Test environments this seat created are removed.
3. **Law:** a durable invariant graduates now, by kind, as one sentence.
4. **Roadmap:** only lines whose state changed. Issues are never written here; one read check is a finding: a retired tracker whose issue is still open.
5. **Commit this seat's work only,** code and docs, path-scoped, per project law; foreign edits are reported, never swept. A memory dir that is a repo is committed too.
6. **Resume pointer:** `Resume by reading <tracker> §<section>.` · `Next action: <one sentence>.` · `Blocked on: <thing, or "nothing">.`

Seat ownership holds: a Lead sweeps its seat doc, epics and roadmap; a correction to a seat's tracker goes to that seat.

## Ending, as declared

- **Handoff:** `/seats:brief-write <phases>` in this turn, ending with the `/seats:brief-build <path>` starter. A described handoff is a failed one.
- **Continue:** start the work; no re-asking.
- **Retire:** graduate invariants · `shipped:` · the roadmap line · tracker, its briefs and seat doc to `docs/outdated/` in one commit · close the issue, when the tracker has one, with a closing comment (shipped / cut / `Tracker:`). Atomic, never partial.
- **Park:** a dated line in the tracker; the pointer names the new target.
- **New tracker from findings:** `/seats:tracker-new <what it is> [issue]`, then seed the findings into it.

## Litany

`Sweep: all current | wrote: …` · `Commands run: …` · `Ending honored: yes | NO: …`. A NO is fixed in this turn. A project without `docs/` tiers gets that said, and the setup skill offered, instead of invented files.
