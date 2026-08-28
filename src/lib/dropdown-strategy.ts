  import type { DropdownOptionMapper } from '@ntp-lms-ui/lib'

export const DROPDOWN_PRELOAD_LIMIT = 15

export type DropdownMode = 'preload' | 'async'

export function getDropdownMode(totalCount: number): DropdownMode {
  return totalCount <= DROPDOWN_PRELOAD_LIMIT ? 'preload' : 'async'
}

export const defaultOptionMapper: DropdownOptionMapper = (item) => ({
  value: item.id ?? item.slug ?? '',
  label: item.title ?? item.label ?? String(item.id ?? item.slug ?? ''),
  disabled: item.disabled,
})