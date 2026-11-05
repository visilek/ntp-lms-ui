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

Every folder has an `index.ts`. Sub-barrels exist for each `lib/` subfolder (`lib/types`, `lib/utils`, `lib/constants`, `lib/composables`, `lib/domain-specific/*`).

**Barrel scope:** a barrel exports what its consumer(s) need — not a folder manifest. A folder's barrel may export a subset of the folder's files (e.g., `NtpTable/composables/index.ts` exports only `useTable`, while `useTableSort` and `useTableSelection` are internal).

**Consumers import via barrels:**
- Public consumers of the kit: `@ntp-lms-ui/components`, `@ntp-lms-ui/lib/types`, `@ntp-lms-ui/lib/utils`, etc.
- Component-internal imports from subfolders: `from './composables'` (the subfolder barrel).

**Internal sibling imports use direct relative paths**, not the barrel — to avoid circular dependencies when the barrel re-exports the importing file.

**Tests and stories use relative paths** (they can use barrels when the needed item is exported there; direct file imports otherwise).

**The sub-barrel-first policy (new code):**
- Values → `@ntp-lms-ui/lib/utils`, `/constants`, `/composables`, or `/domain-specific/*`.
- Types → `@ntp-lms-ui/lib/types`.
- The root `@ntp-lms-ui/lib` barrel is to be removed in a future import-policy migration commit (see `_internal/todo/import-policy-full-migration.md`). New code should not import from it.

## Documentation Structure

Docs mirror code structure:
- Standalone component → `docs/components/NtpX.md`.
- Family → `docs/components/NtpFamily/NtpX.md`.

## Imports

- **Values** from sub-barrels: `@ntp-lms-ui/lib/utils`, `/constants`, `/composables`, `/domain-specific/*`; or `@ntp-lms-ui/components` for components.
- **Types** from `@ntp-lms-ui/lib/types`.
- Never import from deep file paths (`components/NtpX/NtpX.vue`) except for sibling imports within the same family.
- Internal kit code (inside `lib/` or `components/<Name>/`) imports across boundaries via sub-barrels, never via the root `@ntp-lms-ui/lib` barrel — to avoid circular dependencies.
- Within a folder, sibling files import each other via direct relative paths, not via the folder's own barrel.

Rationale: sub-barrels avoid cycles (the root barrel is not re-importable during its own evaluation), and precise paths communicate the kind of import (types vs. values).