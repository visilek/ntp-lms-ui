| Token | Value |
|---|---|
| Primary | `hsl(193, 44%, 40%)` |
| Secondary | `hsl(48, 11%, 40%)` |
| Tertiary | `hsl(345, 44%, 40%)` |
| Error | `hsl(0, 66%, 40%)` |


| Token | Derivation | Verdict |
|---|---|
| `on-primary`, `on-secondary`, `on-tertiary`, `on-error` | White | Agreed |
| `primary-container`, etc. | `color-mix()` — 10-12% of base + surface | We shouldn't use surface for mixing, since it has it's own hue. Mix with white |
| `on-*-container` | Dark text or darkened base | Darkened Base |
| `surface` | Your `hsl(47, 10%, 90%)`? | `hsl(48, 10%, 90%)` for consistency with secondary |
| `on-surface` | Dark text — what value? | Choose the optimal color preserving hue=48 (make sure it can be displayed correctly in the browser.) |
| `on-surface-variant` | Muted text | Choose the optimal color preserving hue=48 (make sure it can be displayed correctly in the browser.) |
| `outline` | Border color | I need 
| `surface-container-*` | Elevated surface variants |

---

## Questions

1. **Surface** — keep your `hsl(47, 10%, 90%)` as the base surface? Or adjust?

2. **On-surface (body text)** — dark warm gray? Something like `hsl(47, 10%, 15%)`? Or pure near-black?

3. **On-surface-variant (muted text)** — lighter gray, like `hsl(47, 8%, 40%)`?

4. **Outline** — `hsl(47, 8%, 75%)`?

5. **Container tints** — use `color-mix()` dynamically, or hardcode values?

What are your preferences?