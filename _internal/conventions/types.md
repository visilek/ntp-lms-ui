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