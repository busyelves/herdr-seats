# seats

Run a fleet of Claude Code sessions in [Herdr](https://herdr.dev) panes: a **Lead** that dispatches and reviews, **orchestrators** that brief, build and fold phases, and implementer subagents that build one brief each. The sessions talk to each other through seat tools, and the Lead hears when an orchestrator's context grows past 350k and 450k so it can hand the work to a fresh seat without losing its judgment.

## Install

The easy way: tell Claude Code *"Install seats from https://github.com/busyelves/herdr-seats; follow INSTALL.md."* It checks the prerequisites, installs, sets up your repository and runs a round-trip test.

By hand, at a Claude Code prompt:

```
/plugin install seats --marketplace busyelves/herdr-seats
```

Answer `y` to add the marketplace, then pick a scope. From a shell: `claude plugin install seats --marketplace busyelves/herdr-seats`. In the desktop app: + next to the prompt box, Plugins, Add marketplace `busyelves/herdr-seats`, then Add plugin. Then follow [INSTALL.md](INSTALL.md) from step 2: link `bin/seat` onto your PATH and run `/seats:seats-init` in your repository.

Needs macOS, Herdr (app or TUI), Python 3.9+ and Claude Code. Every skill is namespaced: `/seats:lead`.

## What is in it

| Part | What it does |
|---|---|
| Seat tools | `seat_open`, `seat_name`, `seat_send`, `seat_list`, `seat_handover`, `seat_close`, registered only inside a Herdr pane |
| Context watch | after every turn, labels the pane with its context size; tells the Lead once at 350k and 450k, and you at 500k. Spends no model tokens |
| `bin/seat` | the command behind the tools: names (`<repo>-cc-lead`, `<repo>-cc-orch-<word>`), message headers, opening panes beside the caller, handover order. It refuses to type into a pane sitting at an approval prompt or holding your unsent text |
| Skills | `/seats:lead`, `/seats:run-phases`, `/seats:brief-write`, `/seats:brief-build`, `/seats:brief-review`, `/seats:seat-handover`, `/seats:checkpoint`, `/seats:away`, `/seats:tracker-new`, `/seats:seats-init` |

## How a run goes

1. Discuss the work in a pane, then `/seats:lead`. The Lead names itself, writes your rulings down, and opens orchestrators beside it, at most four.
2. Each orchestrator runs `/seats:run-phases`: freezes a brief, builds through subagents, reviews the diff, folds the result into the tracker. Add `fast` to have it build in its own pane where you can watch and steer.
3. Reports come back to the Lead, which reviews each range cold and decides inside the grants in `docs/away.md`. You hear three things: a phase landed, a blocker, a ruling that is yours.
4. Past 350k context an orchestrator runs `/seats:seat-handover`: its judgment goes into a seat doc, and a successor opens beside it and takes its name.

## Names

A seat has two names. The Herdr name (`app-cc-lead`) is its address and moves to its successor, so peers always reach whoever holds the role. The title (`app-cc-lead-1211-0930`, the time it opened) is the session's own and never moves.

## Development

`claude plugin validate .` and `claude plugin test .` (15 tests; Herdr and the seat command are mocked).
