# Dev Tooling

## Exports

Two utilities, both in `lib/utils/dev.ts`, exported via the `lib` barrel:

- **`isDev()`** — returns true in development builds.
- **`createDevWarn(scope)`** — returns a scoped warner. No-op in production.

## Usage

### Scoped warnings (preferred in kit code)

```ts
import { createDevWarn } from '@ntp-lms-ui/lib/utils'

const warn = createDevWarn('NtpTable/useColumnFilter')

warn('unhandled filter mode "gt"')
```

One `createDevWarn` call per file, at the top, assigned to a module-level
`warn` constant. Call sites use `warn('...')` directly — no `isDev()` guard
needed, because the warner is already a no-op in production.

### Guarded blocks (for expensive messages or dev-only logic)

```ts
import { isDev } from '@ntp-lms-ui/lib'

if (isDev()) {
  console.warn('[Scope]', expensiveMessage())
}
```

The `isDev()` guard wraps the **message construction**, not just the logging
call, so interpolated strings, `JSON.stringify`, and other message preparation
are eliminated from production bundles.

## Rationale

Vite replaces `import.meta.env.DEV` with a literal boolean at build time, and
its dead-code elimination removes statically-false branches.

For cheap messages (a few interpolated values), the cost of constructing the
message in production is negligible, so `createDevWarn` handles everything.

For expensive messages, the guard must move to the call site so the message
isn't built at all in production.

## Scope naming

The scope identifies where the warning originates.

| Location | Scope |
|---|---|
| `src/lib/composables/useX.ts` | `'composables/useX'` |
| `src/lib/utils/x.ts` | `'utils/x'` |
| `src/lib/constants/x.ts` | `'constants/x'` |
| `src/lib/domain-specific/<d>/x.ts` | `'domain-specific/<d>/x'` |
| `src/components/NtpX/NtpX.vue` | `'NtpX'` |
| `src/components/NtpX/useX.ts` | `'NtpX/useX'` |

The `lib/` prefix is omitted: it's the only directory containing kind-based
subfolders, so its presence is implied. Components are identified by their
name alone (they carry the `Ntp` prefix and are uniquely named); helpers
inside a component folder use the component name as their prefix.

## What not to do

```ts
// ❌ Message construction happens even in production
console.warn(`[Scope] ${expensiveMessage()}`)

// ❌ No scope prefix — hard to trace in a busy console
console.warn('something happened')
```

Use `createDevWarn` for cheap scoped warnings, and `isDev()` + `console.warn`
for expensive ones.