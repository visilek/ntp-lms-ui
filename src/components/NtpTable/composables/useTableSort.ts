import type { Ref } from 'vue'
import type { SortState, TableColumn } from '@ntp-lms-ui/lib/types'

type SortSwitcherState = 'none' | 'asc' | 'desc'

interface UseTableSortOptions {
  sort: Ref<SortState | null>
  setSort: (sort: SortState | null) => void
}

interface UseTableSortReturn {
  switchSort: (column: TableColumn) => void
  ariaSortFor: (column: TableColumn) => 'ascending' | 'descending' | undefined
  stateFor: (column: TableColumn) => SortSwitcherState
}

export function useTableSort(options: UseTableSortOptions): UseTableSortReturn {
  function switchSort(column: TableColumn): void {
    if (!column.sortable) return

    const current = options.sort.value
    let next: SortState | null

    if (!current || current.key !== column.key) {
      next = { key: column.key, order: 'asc' }
    } else if (current.order === 'asc') {
      next = { key: column.key, order: 'desc' }
    } else {
      next = null
    }

    options.setSort(next)
  }

  function ariaSortFor(column: TableColumn): 'ascending' | 'descending' | undefined {
    const current = options.sort.value
    if (!current || current.key !== column.key) return undefined
    return current.order === 'asc' ? 'ascending' : 'descending'
  }

  function stateFor(column: TableColumn): SortSwitcherState {
    const current = options.sort.value
    if (!current || current.key !== column.key) return 'none'
    return current.order
  }

  return { switchSort, ariaSortFor, stateFor }
}