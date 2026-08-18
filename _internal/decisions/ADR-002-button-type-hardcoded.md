# ADR-002: Button type hardcoded to "button"

**Date:** 2026-08-12
**Status:** Accepted

**Context:**
Native `<button>` elements have a `type` attribute with values `submit`, `reset`, and `button`. In server-rendered multi-page apps, `type="submit"` triggers form submission and page reload. Vue SPAs handle form submission programmatically via JavaScript.

**Decision:**
Hardcode `type="button"` in `NtpButton`. Do not expose a `type` prop.

**Rationale:**
- `type="submit"` causes unwanted page reloads in SPAs.
- `type="reset"` is virtually unused in modern applications.
- All major Vue UI kits (Quasar, Vuetify, PrimeVue) default to `type="button"`.

**Consequences:**
- One less prop to document and maintain.
- Prevents accidental page reloads.
- If a native form with browser validation is ever needed, the prop can be added later.