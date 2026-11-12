# Doc conventions

Read once; every template points here instead of repeating it.

## Genres and names

| Genre | File | Template | Born by | Retires |
|---|---|---|---|---|
| Tracker | `docs/plan-<feature>.md` | `_template-tracker.md` | `/seats:tracker-new` | at `/seats:checkpoint retire`, with its briefs and seat doc |
| Epic | `docs/epic-<name>.md` | `_template-epic.md` | `/seats:tracker-new` | when its sequencing job is done; open children are ejected to their own roadmap line |
| Brief | `docs/handoff/brief-<phase-or-topic>.md` | `_template-brief.md` | `/seats:brief-write` | with its tracker |
| Seat doc | `docs/handoff/seat-<feature>[-<pane>].md` | `_template-seat.md` | `/seats:seat-handover` | with its tracker; `seat-lead.md` is standing |

Older files keep their names (`handoff-<x>`, `handoff-orchestrator-<x>`); links resolve by basename.

## Rules every doc follows

- **Basenames never change.** Retire moves the file to `docs/outdated/` unrenamed.
- **Cross-reference by `[[basename]]`,** never by path, so a move breaks nothing and a typo shows as an unresolved link.
- **The tracker wins** over a brief, a seat doc or a message. A brief is frozen once its phase ships: `executed:` is set, the body stays.
- **Checklists are write-once:** `- [ ]` open, `- [x]` done, a dated resolution appended (`— fixed YYYY-MM-DD, \`sha\``), never pruned or reworded.
- **Status glyphs:** ✅ done · 🚧 in progress · 🔲 todo · 🟡 deferred. The Status table carries the commit SHA once shipped.
- **Decisions logs are append-only and dated.** A ruling made in chat is written the same session.
- **Law graduates by kind** before a doc retires: a seam invariant into that seam's law file, anything cross-cutting into the project law. A threshold or toggle is never law.
- **Seat docs are rewritten in place,** never appended; about 120 lines; instincts that keep earning graduate into the law or `brief-review`.
- **Commit trailers** carry `Tracker: plan-<child>`, never an epic's name. Commit and push rules are the project law's.
