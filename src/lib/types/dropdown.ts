export type DropdownRawOption = Record<string, any>

export type DropdownOption = {
  value: string | number
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