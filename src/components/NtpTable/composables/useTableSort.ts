import type { SortState, SortOrder, SortIndicatorState, SortAriaValue, TableColumn } from '@ntp-lms-ui/lib/types'
import { SORT_INDICATOR_STATES } from '@ntp-lms-ui/lib/types'

export function useTableSort() {
  function isColumnSortable(column: TableColumn): boolean {
    return column.sortable === true
  }

  function getActiveOrder(
    column: TableColumn,
    currentSort: SortState | null,
  ): SortOrder | null {
    if (!currentSort) return null
    if (currentSort.key !== column.key) return null
    return currentSort.order
  }

  function circularSwitch<T>(values: readonly T[], current: T): T {
    const index = values.indexOf(current)
    return values[(index + 1) % values.length]
  }

  function switchSort(
    column: TableColumn,
    currentSort: SortState | null,
  ): SortState | null {
    if (!isColumnSortable(column)) return currentSort

    const current = getActiveOrder(column, currentSort) ?? 'none'
    const next = circularSwitch(SORT_INDICATOR_STATES, current)

    return next === 'none' ? null : { key: column.key, order: next }
  }

  function ariaSortFor(
    column: TableColumn,
    currentSort: SortState | null,
  ): SortAriaValue {
    if (!isColumnSortable(column)) return 'none'

    const order = getActiveOrder(column, currentSort)
    if (order === null) return 'none'
    return order === 'asc' ? 'ascending' : 'descending'
  }

  function stateFor(
    column: TableColumn,
    currentSort: SortState | null,
  ): SortIndicatorState {
    return getActiveOrder(column, currentSort) ?? 'none'
  }

  return { switchSort, ariaSortFor, stateFor }
}