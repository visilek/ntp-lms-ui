# ADR-001: Enum props over boolean flags for variant/color/size

**Date:** 2026-08-12
**Status:** Accepted

**Context:**
We considered using boolean flags for mutually exclusive visual options (e.g., `filled`, `primary`, `size-sm` as separate boolean props) versus enum string props (e.g., `variant="filled"`).

**Decision:**
Use enum string props for mutually exclusive options. Use boolean props only for additive/independent states (`disabled`, `loading`, `block`, `iconOnly`).

**Rationale:**
- TypeScript union types enforce exactly one value at compile time without complex discriminated unions.
- Fewer props in DevTools and templates.
- Matches industry practice (Quasar, Vuetify, PrimeVue).
- Boolean flags cannot prevent invalid combinations like `<NtpButton filled outlined>` without complex types.

**Consequences:**
- Templates are slightly more verbose (`variant="filled"` vs `filled`).
- Dynamic prop binding from objects is cleaner with enum props.