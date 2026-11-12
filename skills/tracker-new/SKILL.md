---
name: tracker-new
description: Birth a feature tracker completely, or finish an interrupted birth. The doc from the template, its roadmap line or epic row, the commit, and, only when the argument says "issue", the GitHub skeleton issue with labels and type. Argument describes the work in plain words; the ritual picks the name. "under epic-<name>" places it, "bug" makes a defect tracker, "issue" files the GitHub issue. Other rituals call this instead of restating it.
---

# Tracker new

The one birth door. Every applicable step in the same task; a blocked GitHub step leaves an explicitly incomplete birth, never a silent half.

## Declare and check

Pick the name from the words: two to four kebab-case words naming the outcome, not the task (`plan-email-templates`, not `plan-fix-stuff`), matching the project's existing tracker names. Print `Birth: plan-<name> (Feature | Bug)<, under epic-<name>><, with issue>`; the owner corrects the name in a word. Grep `docs/` and `docs/outdated/` for the name and the goal. A retired twin is reopened only on the owner's word; an active twin is extended. Recovering an incomplete birth reuses what exists and reconciles provider state before retrying an issue create.

## Doc

1. Copy `docs/_template-tracker.md` to `docs/plan-<name>.md`: `feature`, `started` today, `status: active`, `tags:` from the project's tag vocabulary, only fields the tracker does real work in. `issue:` stays blank until confirmed.
2. Context from what the owner said: the gap, the goal in one sentence, locked rulings, contracts, out-of-scope with destinations. Phases as a Status table, all todo. Nothing speculative.
3. `roadmap.md`: one line at the right rank, `[[plan-<name>]]`. Under an epic: a row in its run table and a line in its decisions log instead.

## Issue, only when the argument says `issue`

Without the word, no issue is filed and the tracker says so (`issue:` blank). `/seats:tracker-new <name> issue` on an existing tracker files it later; the project's law may require the word for every tracker.

1. Body, write-once and structural: goal, locked ruling, contracts, out-of-scope, open owner calls. No status, no wikilinks, no client names or real values.
2. `gh issue create --title "<title>" --body-file <tmp> --assignee @me --label area:<tag> …`, one label per tag from `gh label list`.
3. Stamp `issue: "#<n>"` in the tracker at once, before any further GitHub write.
4. Type, immutable: `gh api -X PATCH repos/<o>/<r>/issues/<n> -f type=Feature` (or `Bug`).
5. Under an epic: attach as a sub-issue (fetch both node ids with `gh api graphql`, then the `addSubIssue` mutation).

After birth the issue is hands-off until `/seats:checkpoint` retires the tracker.

## Commit and end

Commit the tracker and roadmap per project law: `plan-<name>: tracker born (#<n>)`, or `plan-<name>: birth incomplete — <step>` with the remaining steps recorded in the tracker's Status and decisions log. Print: the tracker path · the issue URL or "no issue" · the next act, usually `/seats:brief-write P1`.
