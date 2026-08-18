# UI Kit — Internal Documentation

Developer-facing documentation for maintaining and extending the NTP LMS UI Kit.

## Contents

- [`decisions`](./decisions/) — Architecture Decision Records
- [`conventions.md`](./conventions.md) — Coding and API design conventions
- [`components/`](./components/) — Per-component implementation notes

## Quick Reference

### Adding a new component

1. Propose API in a planning discussion.
2. Document API in `docs/components/Ntp*.md` after approval.
3. Create component folder in the appropriate category under `shared/ui/`.
4. Export from the category's `index.ts` and the root `index.ts`.
5. Add implementation notes in `_internal/components/Ntp*.md`.
6. Write the component.