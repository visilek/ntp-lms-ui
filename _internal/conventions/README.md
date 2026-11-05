# Conventions

This folder contains the kit's **generic conventions** — cross-cutting rules that apply to all or most components, organized by topic.

> Component-specific conventions live at the top of each component's implementation notes: 
> `_internal/components/<ComponentName>.md`

## Structure

| File | Concern |
|---|---|
| `commit-messages.md` | Conventional Commits format and rules |
| `component-api.md` | Props, events, slots, Vue 3.5 destructured props |
| `composables.md` | useX naming |
| `data-fetching.md` | Display vs interactive components |
| `dependencies.md` | Deps classification |
| `file-structure.md` | Folder organization |
| `implementation-patterns.md` | Internal implementation patterns (loading states, etc.) |
| `naming.md` | Ntp prefix, camelCase, kebab-case |
| `styling.md` | Tokens, CSS patterns |
| `types.md` | Type and interface conventions |

## Kinds of documentation in the kit

| Kind | Purpose | Location |
|---|---|---|
| **Generic conventions** | Cross-cutting rules, apply to 2+ components | This folder, by topic |
| **Component conventions** | Rules specific to one component, or refinements of generic rules as applied there | Top of `_internal/components/<Name>.md` |
| **Implementation notes** | How a component is built | `_internal/components/<Name>.md` (after the conventions) |
| **Consumer docs** | How to use a component | `docs/components/<Name>.md` |
| **Decisions** | Context + rationale for a choice | `_internal/adr/` |
| **Deferred items** | Pending work / decisions | `_internal/todo/` |

## The promotion rule

A component-specific convention that becomes relevant to 2+ components is promoted to this folder:

1. Move the convention from `_internal/components/<Name>.md` to the appropriate `_internal/conventions/<topic>.md`.
2. Update any cross-references.
3. Leave a brief pointer in the component's impl notes if the promotion is worth noting (optional).

## Adding a convention

1. **Is it generic?** → Write it in the appropriate topic file here.
2. **Is it component-specific?** → Write it at the top of that component's impl notes.
3. **Is it a refinement of a generic rule as applied to one component?** → Write it in the component's impl notes, cross-reference the generic rule.
4. **Is it a durable decision?** → Write an ADR too. Conventions are the applied form; ADRs are the record.

## Reviewing conventions

Conventions are reviewed as part of the code they describe. If a component's implementation diverges from its conventions, that's a signal to update either the code or the convention — not to let them drift.