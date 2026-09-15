import { DROPDOWN_PRELOAD_LIMIT } from './constants'
import type { DropdownMode, DropdownOption, DropdownOptionMapper } from '@ntp-lms-ui/lib/types'


export function getDropdownMode(totalCount: number): DropdownMode {
  return totalCount <= DROPDOWN_PRELOAD_LIMIT ? 'preload' : 'async'
}

export const defaultOptionMapper: DropdownOptionMapper = (item) => ({
  value: item.id ?? item.slug ?? '',
  label: item.title ?? item.label ?? String(item.id ?? item.slug ?? ''),
  disabled: item.disabled,
})

export function mergeDropdownOptions(
  existing: DropdownOption[],
  incoming: DropdownOption[],
): DropdownOption[] {
  const existingValues = new Set(existing.map((o) => o.value))
  const newUnique = incoming.filter((o) => !existingValues.has(o.value))
  return existing.concat(newUnique)
}