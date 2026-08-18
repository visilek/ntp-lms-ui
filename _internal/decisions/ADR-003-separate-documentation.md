# ADR-003: Separate consumer and internal documentation

**Date:** 2026-08-12
**Status:** Accepted

**Context:**
Documentation serves two audiences: consumers (developers using the kit) and maintainers (us). Mixing them clutters consumer docs with implementation details and leaves maintainers without a space for rationale.

**Decision:**
- `docs/` — Consumer-facing. API reference, usage examples, accessibility notes.
- `_internal/` — Developer-facing. ADRs, conventions, per-component implementation notes, future considerations.

**Consequences:**
- Two documentation trees to maintain.
- Clear separation of concerns. Consumer docs stay clean and actionable.
- Institutional memory preserved for design decisions.