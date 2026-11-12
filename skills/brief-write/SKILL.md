---
name: brief-write
description: Freeze the brief a separate seat will build from, grounded at current HEAD. Argument names the phases ("P7 and P8") or an epic run ("Run 2"); phases that ship together share one brief. Ends with a risk read and the paste-ready /seats:brief-build starter.
---

# Brief write

Output: frozen briefs in `docs/handoff/`, named `brief-<phase-or-topic>.md`, from the project's `_template-brief.md`. The builder reads nothing but the brief and what it points at.

## Start

Print `Preparing: <briefs for P7+P8 of plan-X | Run 2 of epic-Y>`. An epic run points at the child trackers, cites them as authoritative, and updates the epic's run table in the same task.

## The brief

- **Grounded at HEAD, now.** Every file, symbol and line claim verified against the code; symbols rather than line numbers when the brief may sit. `head:` carries the SHA you verified.
- **Standing alone.** The three to six laws this work can break, one sentence each, and a pointer to the seam's law file.
- **The gate verbatim** from the project law for every touched area, plus the test selection.
- **A fence with destinations:** every adjacent temptation says where it is filed.
- **Diagnosis-shaped steps flagged:** "do this first, alone, and look", and whose environment the evidence needs.
- **Sized to land alone.** A wide slice splits so part 1 is independently green; the remainder gets its own brief and a fresh seat.
- **Assumptions recorded.** An open process question becomes an ASSUMPTION line in the brief and the tracker, built to and verified later. Real asks are credentials, outward acts and what only the owner rules.
- **The tracker's issue** in `issue:` when it has one; nothing filed. A tracker born here is born through `/seats:tracker-new`.
- **The risk read** last, one line: "mechanical, medium is fine" or "touches <seam>, run it hot".

## End

Commit the docs per project law; reference the brief in the tracker as `[[brief-…]]`. Print per brief: path · risk read · `/seats:brief-build <path>`. When the builder is a peer seat, hand it that starter as a self-contained message. This ritual runs no tests or builds.
