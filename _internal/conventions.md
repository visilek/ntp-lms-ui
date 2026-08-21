# Component API Design

## Dependencies

### Classification

| Category | Install As | Examples |
|---|---|---|
| Runtime libraries imported by kit code | `dependencies` | markdown-it, katex, milkdown |
| Build/test/type tools | `devDependencies` | typescript, vite, vitest, @types/* |
| Libraries the consumer already has | `peerDependencies` | vue, vue-router |

### Rule

Before adding any package, ask: **"Does the published artifact need this at runtime, or is it only for our development?"**

- Runtime → `dependencies`
- Development only → `devDependencies`
- Consumer-owned → `peerDependencies`

## Props for mutually exclusive options → enum strings

```html
<!-- ✅ Correct -->
<NtpButton variant="filled" color="primary" size="medium" />

<!-- ❌ Wrong -->
<NtpButton filled primary size-md />
```

## Props for additive/independent states → booleans

```html
<NtpButton disabled loading block iconOnly />
```

## Never expose native attributes that conflict with SPA patterns

Example: `type` on `<button>` is hardcoded to `"button"`. No prop.

## Scoped slots for logic/presentation separation

Component owns logic (state, accessibility, keyboard). Consumer owns rendering via scoped slots.

# Data Fetching Responsibilities

**Display components never fetch data.**
`NtpTable`, `NtpPagination`, `NtpCard` family, `NtpBreadcrumb` receive data via props and emit events. Pure presentational. No knowledge of APIs or endpoints.

**Interactive components with internal data needs may load data via injected loader.**
`NtpSelect`, `NtpMultiSelect` receive a loader function via prop. The component defines the contract (TypeScript type). The consumer provides the implementation (factory-bound to an endpoint). Component owns *when* to call. Consumer owns *how* it's fetched.

**No component knows about API endpoints, HTTP clients, or auth.**
Dependency injection is the only mechanism for data access.

# Styling

- All values reference tokens from `tokens/` via SCSS variables.
- No magic numbers (`padding: 12px` → `padding: $spacing-md`).
- Elevation, spacing, typography follow Material Design 3 scale.
- Component CSS is scoped. No global styles except in `base/`.

# Composables

- Internal composables: colocated with their component, not exported from the kit.
- Shared composables: placed in `lib/`, exported.
- Naming: `use` prefix, camelCase.

# File Structure

- One component per folder.
- Folder name matches component name.
- Barrel `index.ts` per category, re-exported from root `index.ts`.
- Component families (e.g., NtpCard + subcomponents) share one folder.

# Naming

- All components prefixed with `Ntp`.
- Props: camelCase in JS, kebab-case in templates.
- Events: kebab-case.
- CSS classes: `ntp-{component}` namespace.