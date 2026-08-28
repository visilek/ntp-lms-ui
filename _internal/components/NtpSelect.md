# NtpSelect — Implementation Notes

## Load Pattern

Three load functions follow the same pattern:
- try/catch/finally
- catch emits `load-error`
- state preserved on error

TODO(v2): Re-evaluate extraction once core app usage patterns are known.

## Modes

| Mode | Condition | Filtering |
|---|---|---|
| Preload | totalCount ≤ 15 | Client-side |
| Async | totalCount > 15 | Debounced (300ms) API |

## Selected Label

Resolution order:
1. `cachedOption` (user selection or `initialOption`)
2. Loaded options
3. `#value` fallback

## initialOption

- Provides label for programmatic values.
- Watch: sets cache + emits `update:modelValue` if different.
- `modelValue` watch: clears cache on mismatch.

## Footer

- "Load more" button → spinner while loading.
- Content centered via `.ntp-select__footer-content`.

## Min Width

Menu min-width matches input width via `computeMinWidth()` on open.