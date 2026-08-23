# Implementation patterns

## Loading State Width Preservation

When a loading state replaces content:

- Keep content in DOM with `visibility: hidden`.
- Overlay spinner absolutely positioned and centered.
- Component width remains stable — no layout shift.