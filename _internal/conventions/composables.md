# Composables

- Internal composables: colocated with their component, not exported from the kit.
- Shared composables: placed in `lib/`, exported.
- Naming: `use` prefix, camelCase.

## State owner and pure operations

Emerging pattern (currently `NtpTable`): split a component's composables into:

- **One state owner** (`useTable`) — owns all state, derives reactive values (`mode`, `displayedRows`), and exposes setters/operations.
- **Pure operation helpers** (`useTableSort`, `useTableSelection`) — no state, no lifecycle hooks, receive current state as arguments and return new values.

The state owner calls the helpers with the current state and updates its own state with the results. The helpers are trivially testable in isolation.

**When to apply:** when a component has non-trivial state (multiple related refs, derived computeds, coordinated lifecycle). For simple components, a single composable is fine.

**Why not let each concern own its state:** this leads to "courier" components — the component passes state between sibling composables that each close over it. State becomes distributed and change-tracking is scattered. One owner, many helpers avoids this.

**Promotion:** this is not yet a generic convention (currently one component). When a second component adopts the same pattern, promote to this file as a formal rule.