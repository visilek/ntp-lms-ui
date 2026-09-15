## File Structure

- One folder per component or component family.
- Family folders named after the base component: `NtpRadio/` contains `NtpRadio.vue` + `NtpRadioGroup.vue`.
- Families with a barrel use `export *` in root index.
- Standalone components use `export { default as NtpX }`.
- Internal sub-components (e.g., `NtpRadio`) are not exported from the family barrel.
- Shared styles go in `src/styles/`.

## lib/ Structure

The `lib/` folder contains shared logic, organized by kind with domain-specific overrides.

### Top-Level Folders

| Folder | Contents |
|---|---|
| `types/` | **All** TypeScript types and interfaces — always centralized here |
| `composables/` | Non-domain Vue composables |
| `utils/` | Non-domain pure functions |
| `constants/` | Non-domain constants |
| `domain-specific/` | Cohesive domains containing logic (not types) |

### Domain-Specific Folders

A domain folder is created when **2+ cohesive modules** share a domain concern (e.g., dropdowns, latex).

Inside a domain folder, files are grouped by **kind**:

```
domain-specific/dropdown/
├── constants.ts
├── utils.ts
└── index.ts
```

Rules:
- Files are named by kind (`constants.ts`, `utils.ts`, `directives.ts`).
- Only create a file if there's content for it. No empty files.
- Types **never** go here — they live in `lib/types/`.
- Each domain has an `index.ts` barrel.

### Decision Rule

**Default:** new logic goes to a kind folder (`composables/`, `utils/`, `constants/`).

**Promote:** move to `domain-specific/<name>/` when 2+ cohesive modules share a domain concern.

**Types:** always `lib/types/`, organized by domain inside that folder.

### Barrel Imports

Every folder has an `index.ts`. The root `lib/index.ts` re-exports all of them.

Consumers import from `@ntp-lms-ui/lib` (public) or `@ntp-lms-ui/lib/types` (types only).

Barrel imports ensure that refactoring internal structure doesn't affect consumers.

## Documentation Structure

Docs mirror code structure:
- Standalone component → `docs/components/NtpX.md`.
- Family → `docs/components/NtpFamily/NtpX.md`.

## Imports

- Always import from public barrels: `@ntp-lms-ui/components`, `@ntp-lms-ui/lib`.
- Never import from deep paths (`components/NtpX/NtpX.vue`).
- Exceptions:
	- sibling imports within the same family — direct path allowed.
	- `@ntp-lms-ui/lib/types`

Rationale: internal folder refactors only update barrels, not every consumer.