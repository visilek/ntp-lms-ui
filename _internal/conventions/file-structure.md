## File Structure

- One folder per component or component family.
- Family folders contain multiple `.vue` + `.css` couples directly — no subfolders.
- Standalone components: one couple per folder.
- Family components: several couples in one folder, named consistently.
- Barrel `index.ts` exports from the folder.

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