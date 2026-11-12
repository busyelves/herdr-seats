---
name: seats-init
description: Set up a repository for seats, once: the docs/ tree the rituals read and write (trackers, briefs, seat docs, away.md, roadmap), the doc templates, and a Seats section in the project's AGENTS.md or CLAUDE.md with the owner's words and gate commands. Use for "set up seats", "/seats:seats-init", or when /seats:lead finds no docs/ tree. Argument: none, or `check` to repair a partial setup.
---

# Seats init

The `templates/` folder beside this SKILL.md holds everything this ritual copies. Run it at the root of the repository the seats will work in.

## Check first

Print what exists: `docs/`, `docs/handoff/`, `docs/outdated/`, `docs/away.md`, `roadmap.md`, each `docs/_template-*.md`, `docs/_conventions.md`, and a `## Seats` section in `AGENTS.md` (else `CLAUDE.md`). Never overwrite a file that exists; `check` only adds what is missing. Check `git config user.email` too: with none, ask the owner for a name and email and set them for this repository only (`git config user.name`, `git config user.email`), never `--global`.

## Ask the owner, in one message

1. **Owner words:** the acts a seat must stop for. Offer the default: push of a code repo, PR, merge, deploy, outward send, destructive act, money, product ruling.
2. **Gate commands:** typecheck and lint, and the full test suite. Read `package.json`, `Makefile`, `pyproject.toml` or the CI config first and propose them. With none yet, write `none yet` in place of the command.
3. **Doc pushes:** may agents push commits that touch only `docs/` and `roadmap.md`? Yes becomes "agents push after reading the outgoing range"; no becomes "agents commit, the owner pushes".

## Write

1. `docs/`, `docs/handoff/`, `docs/outdated/`, each empty folder with a `.gitkeep` so git keeps it.
2. Copy `_conventions.md`, `_template-tracker.md`, `_template-epic.md`, `_template-brief.md`, `_template-seat.md` into `docs/`.
3. `roadmap.md` at the root from `templates/roadmap.md`, with the project's name filled in; its other `<…>` lines stay as written until the first tracker.
4. `docs/away.md`:
   ```
   since: none
   until: none
   deciding seat: none
   grants: []
   never: [prod deploys, outward sends, destructive acts, money]
   decisions: []
   waiting: []
   ```
5. Append `templates/seats-law.md` to `AGENTS.md` (else `CLAUDE.md`; create `AGENTS.md` when neither exists), with the owner's answers in place of the UPPERCASE placeholders (`<OWNER_WORDS>`, `<DOC_PUSH>`, `<LINT>`, `<TESTS>`). Lowercase `<…>` there, such as `<type>/<feature>`, is a format and stays.
6. Commit those paths only: `docs: set up seats`. Push nothing.

## End

Print the files written, then the start: open a Herdr pane in this repository, run `claude`, and type `/seats:lead` with what to build. The Lead names itself, births the tracker through an orchestrator and runs from there.
