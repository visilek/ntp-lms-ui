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

- Always import from public barrels: `@ntp-lms-ui/components`, `@ntp-lms-ui/lib`.
- Never import from deep paths (`components/NtpX/NtpX.vue`).
- Exception: sibling imports within the same family — direct path allowed.

Rationale: internal folder refactors only update barrels, not every consumer.