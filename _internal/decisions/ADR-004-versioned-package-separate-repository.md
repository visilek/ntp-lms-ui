# ADR-004: UI kit as a versioned package in a separate repository

**Date:** 2026-08-12
**Status:** Accepted

## Context

The NTP LMS platform consists of a Django backend and two Vue 3 frontend applications (Teacher and Student). The core team has already decided on the repository structure (see core team ADR-0023 in `ntp-lms-backend`).

## Decision

The UI kit (`ntp-lms-ui`) lives in its own repository. It is a versioned package consumed by both frontends as a dependency.

```
ntp-lms-ui/
├── src/
├── docs/
├── _internal/
└── package.json
```

## Rationale

- Core team ADR-0023 establishes three repositories with a shared UI kit package.
- Both frontends need the same components with identical behavior and styling.
- A separate package enforces semantic versioning and deliberate release cycles.

## Consequences

- Semantic versioning required (major/minor/patch discipline).
- Publish step needed (private npm registry or git-based install).
- Local development requires linking (`npm link`, `file:` protocol, or local registry).
- Breaking changes require coordination with both frontend teams.