# NtpSelect — Implementation Notes

## Load Pattern

Functions follow try/catch/finally, `load-error` emit, state preserved.

## Modes

| Mode | Condition | Filtering |
|---|---|---|
| Preload | totalCount ≤ 15 | Local |
| Async | totalCount > 15 | Debounced API |

## Label Resolution

1. Loaded options.
2. Preloaded options.
3. API load (pageSize 100).
4. `#value` fallback.

## preloadedOptions

Merged into loaded when value not found in loaded. No API call if preloaded covers.