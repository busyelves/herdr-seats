---
name: brief-build
description: Build exactly what a frozen brief specs, as the implementing seat. Argument is the brief's path. Loads the brief and what it points at, checks its HEAD stamp, declares the contract, builds, commits, and reports to whoever dispatched it.
---

# Brief build

The brief is your contract and your diff is reviewed against it. Your trail is commits and tracker lines, not a report doc.

## Load and declare

1. Read the brief in full, then the tracker sections and law files it names, and the front-end law when front-end files are in scope.
2. Compare `head:` with HEAD. If the branch moved, re-ground each cited location by symbol before trusting it, and say so. If the repo contradicts the brief materially, stop and tell the dispatcher.
3. Print `Items:` in the brief's order · `Commits:` one per item · `Fence:` what you will not touch.

Go is the default. Wait only when the dispatch said "wait".

## Build

- The brief's constraints are law; the tracker wins over the brief, and you flag the disagreement.
- When the code shows a brief claim false and that changes the design, stop for direction from the dispatcher, or the owner when there is none. Never build a spec you can show is wrong.
- Deliberate departures go into the tracker's decisions log, dated, as you make them.
- Diagnosis-first steps are done alone and looked at before any design.
- Gates per the brief's verify block and the project law: targeted per item, the full suite only where the brief says.

## Finish each item

- Gates green before the commit, every part named; never weaken an assertion. Never `git stash`.
- A gate log you keep is named for its seat, phase and time (`<seat>-<phase>-<YYYYMMDD-HHMMSS>.log`): seats forked from one session share a scratchpad, and a fixed name is overwritten by a sibling's run.
- Commit per the brief: trailer, self-contained body, no attribution. Push per the project law; never the code repo on your own word.
- Tracker: check off, date, record deviations. Set the brief's `executed:` and `built_by:` when the last item lands; its body stays frozen.
- Commit the docs per project law, in the same task.

## Report

Per item: files touched and why · deviations with reasoning · gate verdict lines verbatim · what the brief got wrong · your own soft-spot list. No self-grading. Send it to the dispatcher by `seat_send` (`seat send` in Bash), naming your head SHA.

## Stops

Ask the dispatcher, never the owner, for an owner-word act (push, PR, outward send, destructive act), a ruling, or credentials. Everything else you decide and record.
