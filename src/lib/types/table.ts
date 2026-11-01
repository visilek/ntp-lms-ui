import type { PaginatedResult } from './pagination'

// ─────────────────────────────────────────────────────────────────────────────
// Row
// ─────────────────────────────────────────────────────────────────────────────

/** A single row of table data. Values are untyped at the table level. */
export type TableRow = Record<string, any>

/** A row's unique identifier (the value of the field named by `rowKey`). */
export type TableRowKey = string | number

// ─────────────────────────────────────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────────────────────────────────────

export const COLUMN_TYPES = ['text', 'enum', 'date', 'number'] as const

export type ColumnType = (typeof COLUMN_TYPES)[number]

export const FILTER_MODES = [
  'exact',
  'icontains',
  'gte',
  'lte',
  'gt',
  'lt',
  'in',
] as const

export type FilterMode = (typeof FILTER_MODES)[number]

export type ColumnAlign = 'start' | 'center' | 'end'

export interface ColumnFilter {
  field: string
  mode: FilterMode
  value: string | number | string[]
}

export interface TableColumn {
  key: string
  label: string
  type?: ColumnType
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: ColumnAlign
  sortLocally?: (a: any, b: any, rowA: TableRow, rowB: TableRow) => number
  sortRequest?: (column: TableColumn, order: SortOrder, params: LoadRowsParams) => LoadRowsParams
  filterLocally?: (cell: any, filter: ColumnFilter, row: TableRow) => boolean
  filterRequest?: (column: TableColumn, filter: ColumnFilter, params: LoadRowsParams) => LoadRowsParams
  displayMapper?: (cell: any, row: TableRow) => string | number | null | undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort
// ─────────────────────────────────────────────────────────────────────────────

export const SORT_ORDERS = ['asc', 'desc'] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

export const SORT_INDICATOR_STATES = ['none', 'asc', 'desc'] as const
export type SortIndicatorState = (typeof SORT_INDICATOR_STATES)[number]

export type SortAriaValue = 'ascending' | 'descending' | 'none'

export interface SortState {
  key: string
  order: SortOrder
}

// ─────────────────────────────────────────────────────────────────────────────
// Data loading
// ─────────────────────────────────────────────────────────────────────────────

export interface LoadRowsParams {
  page: number
  pageSize: number
  sort: SortState | null
  filters: ColumnFilter[]
}

export type LoadRows = (
  params: LoadRowsParams,
) => Promise<PaginatedResult<TableRow>>

// ─────────────────────────────────────────────────────────────────────────────
// Mode
// ─────────────────────────────────────────────────────────────────────────────

export type TableMode = 'fixed' | 'complete' | 'partial'