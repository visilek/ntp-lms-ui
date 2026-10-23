# Types and Interfaces

## Interface vs Type

| Use `interface` | Use `type` |
|---|---|
| Object shape | Union, tuple, primitive alias |
| May be extended by consumers | Composition (`Pick`, `Omit`, `&`) |
| Public API contract | Function types |
| | Mapped/conditional types |

When both work — **prefer `interface`** for clearer error messages.

## Type Hierarchy

Types reflect domain hierarchy:
- Lower-level primitives (`MenuItemValue`) defined first.
- Higher-level types alias or compose them (`DropdownValue`).

Enforce subset relationships with `Pick` or `satisfies`-style guards.

## Naming

- Reused types must be named — no inline `string | number` in multiple places.
- Prefer semantic names: `DropdownValue`, not `Value`.
- Types live in `lib/types/`, organized by domain.

## Compile-Time Guards

When a type must satisfy a constraint, add a guard:

```ts
type Assert<T extends true> = T
type _Check = Assert<MyType extends OtherType ? true : false>
```

# Type Strictness Policy

## Principle

Types are as strict as the contract requires and as permissive as the consumer needs.

## Rule

Distinguish between **row/data values** and **component contracts**.

| Category | Strictness | Example |
|---|---|---|
| Raw data values (rows, cell values) | `any` | `rows: Record<string, any>[]` |
| Comparator / matcher params (consumer-written) | `any` | `(a: any, b: any) => number` |
| Component contracts (filters, sort state, params) | Precise | `ColumnFilter`, `SortState`, `LoadRowsParams` |
| Generic defaults | `unknown` | `PaginatedResult<T = Record<string, unknown>>` |

## Rationale

- Row data is inherently untyped at the component level — the consumer  knows its shape, the component does not. `any` avoids forcing casts the consumer already knows are safe.
- Component contracts are defined by the component and by the backend contract. Precision here catches real errors at the boundary.
- Generic defaults are `unknown` (safe default for new call sites), instantiated to `any` where permissive ergonomics are desired.

## Trade-off

Choosing `any` for row data means the table cannot autocomplete row properties and cannot catch type errors in comparators. This is
intentional: the small team and code review process catch these faster than the type system would, and the ergonomic cost of `unknown` is real and recurring.
Tightening later (changing `any` to `unknown`) is a major-version change.

