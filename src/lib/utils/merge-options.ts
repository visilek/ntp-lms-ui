import type { DropdownOption } from '@ntp-lms-ui/lib'

export function mergeOptions(
  existing: DropdownOption[],
  incoming: DropdownOption[],
): DropdownOption[] {
  const existingValues = new Set(existing.map((o) => o.value))
  const newUnique = incoming.filter((o) => !existingValues.has(o.value))
  return existing.concat(newUnique)
}