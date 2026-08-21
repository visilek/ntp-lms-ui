/** Sort state — used by Table. */
export interface SortState {
  key: string
  order: 'asc' | 'desc'
}

/** Table column definition. */
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'start' | 'center' | 'end'
}