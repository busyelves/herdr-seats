---
name: brief-review
description: Review what a seat built against its brief and tracker, as the orchestrator. Argument names the phases ("P5 and P6"). Diff before summary, every claim grounded in code; findings fixed inside the phase or carried forward, one round.
---

# Brief review

A finding breaks a law, a contract, the brief's promise or the product. Style, refactors and hardening the brief did not ask for are not findings. One round per phase; an empty list is a legitimate verdict, and "ship" is the normal outcome.

## Read in this order

Print `Reviewing: <phases> against <brief> — commits <range>`.

1. The brief: checklist, laws, fence.
2. The tracker's phase section, including what the builder wrote there.
3. The full diff of the range, before any prose about it. A report is the pointer; the diff is the evidence. Then the builder's soft-spot list.

## Checks

- Ground every decision-shaping claim in the code yourself, including your own earlier spec claims.
- Migrations, nullability, join polarity: can a row now drop silently? Was an applied migration edited in place?
- The second call site: grep for the pattern, not the line.
- The fence: untouched? Adjacent code quietly improved?
- Doc drift: Status rows, Known issues, a tracker promise the diff makes false or true.
- Tests: a shipped test rewritten or deleted only with a recorded ruling; new tests assert the expensive half.
- Gate claims name every part; an unnamed part counts as unrun.

This is a read ritual: run no gates. When a verdict matters and is not evidenced, name the command for a fresh run.

## Close

Findings ranked, each with code evidence, in three lanes: fix inside this phase (spec-preserving, cheap) · next brief as "(+fixes)" · needs an owner ruling. Say which claims you verified and which you relay.

Routing in a chain: lane 1 now, lane 2 carried, lane 3 to the Lead if live, else parked. Outside a chain the owner picks.

Fold three places: the phase's own Status row (`✅ <date> <sha>, + review fixes`), a dated decisions-log line with `[[brief-…]]`, the brief's `executed:` and `reviewed_by:`. A correction to your own earlier claim goes into the seat doc. Commit the docs per project law.
