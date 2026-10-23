import type { MenuItemValue } from '@ntp-lms-ui/lib/types'

export type DropdownMode = 'preload' | 'async'

export type DropdownValue = string | number

// Compile-time guard: DropdownValue must remain assignable to MenuItemValue
type Assert<T extends true> = T
type _DropdownValueCheck = Assert<DropdownValue extends MenuItemValue ? true : false>

export type DropdownRawOption = Record<string, any>

export interface DropdownOption {
  value: DropdownValue
  label: string
  disabled?: boolean
}

export type DropdownOptionMapper = (item: DropdownRawOption) => DropdownOption

export type DropdownOptionLoader = (
  query: string,
  page: number,
  pageSize: number,
) => Promise<{
  items: DropdownRawOption[]
  totalCount: number
}>