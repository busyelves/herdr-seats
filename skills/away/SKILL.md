---
name: away
description: Record that the owner is away and what agents may decide meanwhile, so the fleet keeps moving; "/seats:away back" ends it with a digest. Argument in plain words, until when, what is granted, what is not ("until 18:00, merge green PRs, no deploys"). Run in the Lead pane, or in any seat when no Lead is live.
---

# Away

While the owner is away, seats do not wait on them. The deciding seat decides inside the grants; everything else parks.

## `/seats:away <words>`

1. Write `docs/away.md`: `since`, `until`, the deciding seat (this one), `grants` (acts the owner pre-authorised, verbatim), `never` (prod deploys, outward sends, destructive acts, money, unless a grant names one), `decisions` (empty), `waiting` (empty). Commit it.
2. Tell every live seat once, by `seat_send` (`seat_list` names them): the owner is away until <until>, questions go to <seat>, grants are <list>.
3. In the Lead seat, run the `/seats:lead` loop.

## Grants given in chat

A permission the owner types in chat counts as a grant without `/seats:away`: the Lead records it here the same way (verbatim, dated, committed, seats told once); with no Lead live, the seat that heard it does. The file's `since` and `until` stay as they are until the owner says they are away.

## While away

- A seat's stop comes to the deciding seat. Inside the grants: decide, act, append the reason to `decisions`. Outside: append to `waiting` with what and why, and keep every unblocked tracker moving.
- A tool permission prompt is never answered by an agent.
- The owner is messaged only for an emergency: production down, data at risk.

## `/seats:away back`

Print the digest from `docs/away.md`: done · decided for you and why · waiting for you, oldest first, one line each. Then reset the file to `since: none` and commit.
