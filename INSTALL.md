# Installing seats (for the agent doing it)

You are installing this plugin for a person on their Mac. Follow the steps in order, run each check, and stop to tell the person when one fails. Never start the Herdr app from your own shell: a Herdr launched from a Claude Code shell inherits `CLAUDE_CODE_*` variables and its agents stop saving transcripts. Ask the person to open it.

## 1. Prerequisites

Check each and report one line per item:

| Need | Check | If missing |
|---|---|---|
| macOS | `uname` is `Darwin` | stop: seats is macOS only |
| Herdr (app or TUI) | `ls /Applications/Herdr.app ~/Applications/Herdr.app` or `command -v herdr` | ask the person to install Herdr from herdr.dev |
| `hc` (Herdr app) | `~/.local/bin/hc` runs `--help` | link it: `ln -s "<Herdr.app>/Contents/MacOS/herdr-core" ~/.local/bin/hc` if that binary exists, else the path the Herdr docs give |
| `herdr-app` (Herdr app) | `command -v herdr-app` or `~/.local/bin/herdr-app` | `ln -s "<Herdr.app>/Contents/MacOS/Herdr" ~/.local/bin/herdr-app` |
| Python 3.9+ | `python3 --version` (the macOS one is fine) | `xcode-select --install` |
| Claude Code | `claude --version` | stop: the person installs it |
| alerter (optional) | `~/.local/bin/alerter` | without it, alerts use a plain macOS notification |

The Herdr TUI needs only `herdr` on PATH; the app needs `hc` and `herdr-app`. Either is enough.

**First Herdr run.** A Herdr that has never run shows a welcome screen, then **agent integrations**. Install the `claude` integration there: seats reads a seat's state (working, done, at a prompt) from it. Ask the person before installing any other integration it lists.

**Claude Code signed in.** `claude auth status` shows `loggedIn: true`. If it fails to save the login with "Couldn't save your login" or a "Keychain Not Found" dialog, the macOS user has no login keychain (an account never logged into through the GUI): tell the person, and have them log into that account once from the login window.

## 2. Install the plugin

```
claude plugin install seats --marketplace busyelves/herdr-seats
```

Then put the seat command on PATH so the skills can run it from Bash. The plugin lives in a versioned folder; read it from `claude plugin list --json` (the `installPath` of `seats@<marketplace>`):

```
ln -sf "<installPath>/bin/seat" ~/.local/bin/seat
```

If `~/.local/bin/seat` already exists and points somewhere else, stop and ask the person: it is another seat setup, and overwriting it breaks that one.

After every `claude plugin update seats`, link it again: the path changes with the version.

Check: `seat --help` prints the usage.

## 3. Set up the person's repository

Ask which repository the seats will work in. In a Herdr pane at its root, start `claude` and run `/seats:seats-init`. Every skill of this plugin is namespaced: `/seats:lead`, `/seats:run-phases`, and so on. It asks the person three things (owner words, gate commands, doc pushes) and writes `docs/`, the templates, `docs/away.md`, `roadmap.md` and a Seats section in `AGENTS.md`.

## 4. Verify the round trip

Inside a Claude session in a Herdr pane, in that repository:

1. `seat_list` answers (an empty list is fine). If the tool is missing, the session is not in a Herdr pane, or the plugin did not load: check `claude plugin list`.
2. `seat_name` with role `lead`: the pane is now `<repo>-cc-lead`.
3. `seat_open` with role `orch`, word `smoke`, brief `Reply "ok" to the lead with seat_send, then stop.`: a pane opens beside it.
4. The reply lands in the Lead's pane as its next input, headed `<repo> · … · from <repo>-cc-orch-smoke` (in the Herdr app, wrapped in `<hc from="t…">`). To receive it, end the turn after step 3 and wait; never poll in a loop.
5. `seat_close` with target `smoke`.

Tell the person the install is done only when all five pass. Report what failed otherwise.

## 5. Tell the person how to use it

- Discuss the work in a pane, then type `/seats:lead`: the Lead opens orchestrators, dispatches, reviews and keeps going.
- `/seats:lead status?` style questions get five lines. `/seats:away until 18:00, merge green PRs` lets the fleet decide inside grants while they are away.
- The Lead hears when an orchestrator passes 350k and 450k context and hands it over to a fresh seat.
