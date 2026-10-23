# Filtering Modes

## Principle

The table's filter modes are a **subset of the backend's lookups** — chosen
for relevance to table filtering. The frontend does not invent modes the
backend cannot honor, and does not omit modes the backend provides.

## Rationale

- **Parity between complete and partial mode.** Every mode must work both
  locally (complete mode) and server-side (partial mode). The only way to
  guarantee this is if the backend supports it.
- **Single source of truth.** The backend defines what filtering means in
  the domain. Duplicating or extending this in the frontend creates drift.
- **Verifiability.** Any mode in `FILTER_MODES` should map to a backend
  lookup. Any backend lookup we want to expose should be in
  `FILTER_MODES`. Both directions are checkable.

## Implication

Adding a new mode requires:

1. The backend supporting the lookup.
2. The frontend's local matcher implementing the same semantics.
3. `FILTER_MODES` updated with the new value.

Three coordinated changes, not one.

## Current modes

`exact`, `icontains`, `gte`, `lte`, `gt`, `lt`, `in`.

These mirror the standard Django lookups currently exposed by the backend.
Additional lookups (`istartswith`, `range`, custom lookups, etc.) may be
added if the backend supports them and the LMS needs them for table
filtering.

## Open question

Django's standard lookups do not include an "all of these values" mode for
multi-value columns (`__in` means "any of"). Whether the backend supports
an "all of" lookup is unconfirmed. Until it is, only `in` is available for
multi-value columns.