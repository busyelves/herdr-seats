---
type: brief
tracker: plan-<feature>     # the doc that wins on any disagreement
phases: <P5, P6>
branch: <branch>            # <type>/<feature>, type in feat | fix | ci | docs
head: <sha>                 # HEAD at writing; line numbers are valid only here
issue:                      # the tracker's issue, when it has one
written: YYYY-MM-DD
executed:                   # date + outcome word when the phase ships; the body stays frozen
built_by:                   # <platform> · <seat>, diagnostics only
reviewed_by:                # same shape, the seat that reviewed
tags:
  - <tag>
---

# Brief — <phases>: <one-line title naming the outcome>

> Frozen brief for a seat starting with zero context, YYYY-MM-DD. Authoritative doc: [[plan-<feature>]], its <phase> section(s) first. Branch `<branch>` at `<head sha>`. Where this brief and the tracker disagree, the tracker wins and this brief is stale. Conventions: [[_conventions]].

**Ordering:** <which items are independent, which must land first; one commit each>

---

# <Pn> — <item title, phrased as the outcome>

**Observed:** <the dated evidence that opened this item; an unverified claim is marked as diagnosis and verified first>

## The one design constraint that matters

<the load-bearing decision, stated once>

- [ ] <step: imperative, checkable, ordered; diagnosis steps first>
- [ ] <step>
- [ ] Tests: <the behaviours that must have tests, named>

---

## Laws you must not break

<3 to 6, one sentence each, from the project law and the seam's law file>

- <law>

## Verify

```
<the project's gates for the touched areas, copied verbatim from its law>
```

## Out of scope

- <thing> — filed in <where>

## Commit

One commit per item on `<branch>`, trailer `Tracker: plan-<feature>`, self-contained body, no attribution. Push and doc commits per the project law.

**Risk read:** <"mechanical, medium is fine" | "touches <seam>, run it hot">
