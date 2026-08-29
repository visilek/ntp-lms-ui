# NtpSelect — Implementation Notes

## Load Pattern

Three functions follow same pattern: try/catch/finally, `load-error` emit, state preserved.

TODO(v2): Re-evaluate extraction.

## Modes

| Mode | Condition | Filtering |
|---|---|---|
| Preload | totalCount ≤ 15 | Local |
| Async | totalCount > 15 | Debounced API |

## Selected Label

Resolution order: cachedOption → loaded options → `#value`.

## initialOption

Provides label for programmatic values. Watch syncs cache + emits.

## Debounce

300ms. Shared `debounce` from lib.