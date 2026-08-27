## File Structure

- One folder per component or component family.
- Family folders named after the base component: `NtpRadio/` contains `NtpRadio.vue` + `NtpRadioGroup.vue`.
- Families with a barrel use `export *` in root index.
- Standalone components use `export { default as NtpX }`.
- Internal sub-components (e.g., `NtpRadio`) are not exported from the family barrel.
- Shared styles go in `src/styles/`.

## Documentation Structure

Docs mirror code structure:
- Standalone component → `docs/components/NtpX.md`.
- Family → `docs/components/NtpFamily/NtpX.md`.

## Imports

| Context | Import Style |
|---|---|
| Component-to-component (siblings within a family) | Direct file path — `./NtpCheckbox.vue` |
| Stories | Alias barrel — `@ntp-lms-ui/components` |
| Tests | Alias barrel — `@ntp-lms-ui/lib` |
| Consumer app code | Package root — `ntp-lms-ui` |

Rationale:
- Sibling direct imports avoid circular dependency issues.
- Stories and tests exercise the public API — use the barrel.