# Commit Messages

Use Conventional Commits.

## Format

```
<type>(<scope>): <description>
```

Scope is optional. Use only when it adds clarity.

## Types

| Type | Used For |
|---|---|
| `feat` | New component or feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance — config, dependencies, build |
| `refactor` | Code restructuring — no behavior change |
| `test` | Tests |
| `style` | Formatting, no logic change |
| `perf` | Performance improvement |

## Scope

| Situation | Scope |
|---|---|
| Single component | `feat(NtpButton): ...` |
| Multiple components | No scope: `feat: add NtpButton, NtpSpinner` |
| Cross-cutting | No scope: `docs: ...`, `chore: ...` |

When in doubt, omit scope.

## Examples

```bash
feat(NtpButton): add filled variant
feat: add NtpButton, NtpSpinner, NtpChip
fix(NtpChip): dismiss button hover color
docs: update component-api conventions
chore: configure Storybook
```

## Rule

Before committing, ensure all component updates are complete:
- Code
- Tests
- Consumer docs
- Internal docs
- Stories