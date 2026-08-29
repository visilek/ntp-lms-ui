
### Selection

| Token | Purpose |
|---|---|
| `--ntp-color-selected-container` | Selected item background |
| `--ntp-color-selected-container-hover` | Selected item hover background |

### `_internal/conventions/file-structure.md`

```md
## Shared Utilities

- Pure utilities in `lib/` (e.g., `positioning.ts`, `debounce.ts`).
- Shared types in `lib/types/` (e.g., `positioning.ts`).
```

### `_internal/conventions/component-api.md`

```md
## Event Payloads

- Emit domain objects directly — not wrapper payloads.
- Example: `select: [item: MenuItem]`, not `{ value, item }`.
```
