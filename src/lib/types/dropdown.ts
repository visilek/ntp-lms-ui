/** Dropdown option — generic value type. */
export interface DropdownOption<T extends string | number = string> {
  value: T
  label: string
  disabled?: boolean
}

/** Dropdown loader contract. */
export type DropdownLoader<T extends string | number = string> = (
  query: string,
  page: number,
  pageSize: number,
) => Promise<{
  items: DropdownOption<T>[]
  totalCount: number
}>