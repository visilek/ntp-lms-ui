# ADR-005: Testing strategy for the UI kit

**Date:** 2026-08-13
**Status:** Accepted

## Context

The UI kit (`ntp-lms-ui`) is a versioned package consumed by two frontend applications. Components must be reliable, visually consistent, and accessible. We need a testing approach that catches regressions early without excessive overhead at this stage of the project.

## Decision

Use a layered testing strategy:

### Layer 1: Unit tests (Vitest + Vue Test Utils)

Test each component in isolation. Cover:
- Props → correct rendering (variant, color, size produce expected DOM).
- Events → emitted at the right time, with correct payloads.
- States → disabled, loading, error, empty produce correct DOM.
- Slots → default and named slots render in the right place.
- v-model → two-way binding works for form inputs.

### Layer 2: Storybook stories + visual regression

Each component gets stories for all variants, states, and sizes. Composite layout stories demonstrate realistic compositions (forms, tables, detail pages).

Visual regression via Chromatic (or Playwright screenshots later) catches unintended visual changes. Baselines are approved intentionally.

### Layer 3: Accessibility checks (axe-core)

Automated accessibility scanning via the Storybook axe addon. Catches missing aria labels, insufficient contrast, improper heading hierarchy. Not a substitute for manual testing, but catches low-hanging issues.

### Layer 4: Token consistency

Enforce via linting rules and code review. No magic numbers in component CSS. All values reference tokens from `src/tokens/`.

## Rationale

- Unit tests are fast, reliable, and essential for a shared package.
- Storybook serves double duty: visual development tool and documentation. Layout stories demonstrate real-world compositions without building a separate demo app.
- Visual regression catches the class of bug that unit tests miss: "everything works, but it looks wrong."
- Accessibility scanning is automated and free to integrate at this stage.

## Consequences

- Testing infrastructure (Vitest, Storybook, axe) must be set up in the UI kit repository.
- Every component PR requires unit tests and Storybook stories before merge.
- Visual regression baselines must be maintained and approved intentionally.
- Composite layout stories require design input on what realistic compositions look like.
