import type { Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import type {
  ColumnFilter, LoadRowsParams, PaginatedResult,
  SortState, SortIndicatorState, SortAriaValue,
  TableColumn, TableMode, TableRow, TableRowKey, MasterCheckboxState,
} from '@ntp-lms-ui/lib/types'
import { useColumnFilter, useColumnSort } from '@ntp-lms-ui/lib/composables'
import { applyFilterRequest, applySortRequest } from '@ntp-lms-ui/lib/utils'
import { useTableSort } from './useTableSort'
import { useTableSelection } from './useTableSelection'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface UseTableOptions {
  // ── Data source ────────────────────────────────────────────────────────────

  /** Loader callback. Absent → fixed mode (Initial rows only, no fetching). */
  loadRows?: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>
  columns: TableColumn[]
  rowKey: string

  // ── Initial state (from props) ─────────────────────────────────────────────
  initialRows: TableRow[]
  initialPage: number
  initialPageSize: number
  initialSort: SortState | null
  initialFilters: ColumnFilter[]
  initialSelectedKeys: TableRowKey[]

  // ── Prop refs (for two-way sync) ───────────────────────────────────────────
  rowsProp: Ref<TableRow[] | undefined>
  pageProp: Ref<number | undefined>
  pageSizeProp: Ref<number | undefined>
  sortProp: Ref<SortState | null | undefined>
  filtersProp: Ref<ColumnFilter[] | undefined>
  selectedKeysProp: Ref<TableRowKey[] | undefined>

  // ── Emitters ───────────────────────────────────────────────────────────────
  emit: {
    (event: 'update:rows', rows: TableRow[]): void
    (event: 'update:page', page: number): void
    (event: 'update:pageSize', pageSize: number): void
    (event: 'update:sort', sort: SortState | null): void
    (event: 'update:filters', filters: ColumnFilter[]): void
    (event: 'update:selectedKeys', keys: TableRowKey[]): void
    (event: 'load-error', error: Error): void
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function filtersEqual(a: ColumnFilter[], b: ColumnFilter[]): boolean {
  if (a.length !== b.length) return false
  return a.every((filterA, i) => {
    const filterB = b[i]
    if (filterA.field !== filterB.field) return false
    if (filterA.mode !== filterB.mode) return false

    const valA = filterA.value
    const valB = filterB.value

    if (Array.isArray(valA) && Array.isArray(valB)) {
      if (valA.length !== valB.length) return false
      return valA.every((v, j) => v === valB[j])
    }
    return valA === valB
  })
}

function sortEqual(a: SortState | null, b: SortState | null): boolean {
  if (a === null && b === null) return true
  if (a === null || b === null) return false
  return a.key === b.key && a.order === b.order
}


// ─────────────────────────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────────────────────────

export function useTable(options: UseTableOptions) {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Internal state
  // ───────────────────────────────────────────────────────────────────────────

  const page = ref(options.initialPage)
  const pageSize = ref(options.initialPageSize)
  const sort = ref<SortState | null>(options.initialSort)
  const filters = ref<ColumnFilter[]>(options.initialFilters)
  const selectedKeys = ref<TableRowKey[]>(options.initialSelectedKeys)
  const totalCount = ref(options.initialRows.length)
  const isLoading = ref(false)
  const lastError = ref<Error | null>(null)

  let requestId = 0

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Derived: mode
  // ───────────────────────────────────────────────────────────────────────────

  const mode = computed<TableMode>(() => {
    if (!options.loadRows) return 'fixed'
    return totalCount.value <= pageSize.value ? 'complete' : 'partial'
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Composed helpers (pure)
  // ───────────────────────────────────────────────────────────────────────────

  const columnFilter = useColumnFilter()
  const columnSort = useColumnSort()
  const tableSort = useTableSort()
  const tableSelection = useTableSelection()

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Display pipeline
  //
  // Composes pure operations into the display value. In partial mode, the
  // rows come back already filtered/sorted by the server, so the local
  // operations are skipped. In complete/fixed mode, the local operations
  // produce the display order.
  // ───────────────────────────────────────────────────────────────────────────

  const displayedRows = computed<TableRow[]>(() => {
    let result = options.rowsProp.value ?? options.initialRows

    if (mode.value !== 'partial') {
      result = columnFilter.apply(result, filters.value, options.columns)
      if (sort.value) {
        result = columnSort.apply(result, sort.value, options.columns)
      }
    }

    // Concern 9: reorder stage will insert here.

    return result
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Prop → internal sync
  //
  // Absorbs external writes to v-model props. Echo guard: if the internal
  // state already matches, the prop change is our own echo — ignore it.
  // ───────────────────────────────────────────────────────────────────────────

  watch(options.pageProp, (v) => {
    if (v === undefined) return
    page.value = v
  })

  watch(options.pageSizeProp, (v) => {
    if (v === undefined) return
    pageSize.value = v
  })

  watch(options.sortProp, (v) => {
    if (v === undefined) return
    if (sortEqual(v, sort.value)) return
    sort.value = v
  })

  watch(options.filtersProp, (v) => {
    if (v === undefined) return
    if (filtersEqual(v, filters.value)) return
    filters.value = v
  })

  watch(options.selectedKeysProp, (v) => {
    if (v === undefined) return
    selectedKeys.value = v
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Internal → prop emit
  //
  // Emits v-model updates when internal state changes. Echo guard: if the
  // prop already matches the internal value, no emit needed.
  // ───────────────────────────────────────────────────────────────────────────

  watch(page, (v) => {
    if (v === options.pageProp.value) return
    options.emit('update:page', v)
  })

  watch(pageSize, (v) => {
    if (v === options.pageSizeProp.value) return
    options.emit('update:pageSize', v)
  })

  watch(sort, (v) => {
    if (v === options.sortProp.value) return
    options.emit('update:sort', v)
  })

  watch(filters, (v) => {
    if (v === options.filtersProp.value) return
    options.emit('update:filters', v)
  })

  watch(selectedKeys, (v) => {
    if (v === options.selectedKeysProp.value) return
    options.emit('update:selectedKeys', v)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Fetch trigger
  //
  // A composite key of the state fields that determine what gets fetched.
  // When this key changes, the fetch watch fires.
  //
  // In partial mode, the key includes sort and filters (server-side).
  // In complete/fixed mode, it does NOT (local pipeline handles those
  // without refetching). The object shapes differ by mode, which naturally
  // makes the key change on mode transitions.
  //
  // Analogous to TanStack Query's `queryKey`: a fingerprint of the request's
  // triggering state.
  // ───────────────────────────────────────────────────────────────────────────

  const fetchKey = computed(() => {
    if (mode.value === 'partial') {
      return {
        page: page.value,
        pageSize: pageSize.value,
        sort: sort.value,
        filters: filters.value,
      }
    }
    return {
      page: page.value,
      pageSize: pageSize.value,
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Fetch lifecycle
  // ───────────────────────────────────────────────────────────────────────────

  async function performFetch(): Promise<void> {
    const loader = options.loadRows
    if (!loader) return

    const id = ++requestId
    isLoading.value = true

    const baseParams: LoadRowsParams = {
      page: page.value,
      pageSize: pageSize.value,
      sort: mode.value === 'partial' ? sort.value : null,
      filters: mode.value === 'partial' ? filters.value : [],
    }

    const finalParams = applySortRequest(
      applyFilterRequest(baseParams, options.columns),
      options.columns,
    )

    try {
      const response = await loader(finalParams)
      if (id !== requestId) return

      lastError.value = null
      totalCount.value = response.totalCount

      if (response.page !== page.value) {
        page.value = response.page
      }
      if (response.pageSize !== pageSize.value) {
        pageSize.value = response.pageSize
      }

      options.emit('update:rows', response.items)
    } catch (error) {
      if (id !== requestId) return

      lastError.value = error as Error
      options.emit('load-error', error as Error)
    } finally {
      if (id === requestId) {
        isLoading.value = false
      }
    }
  }

  watch(fetchKey, () => {
    performFetch()
  })

  onMounted(() => {
    if (options.loadRows) {
      performFetch()
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Setters
  //
  // Direct state mutations. Used by the table component's event handlers and
  // internally by high-level operations.
  // ───────────────────────────────────────────────────────────────────────────

  function setPage(newPage: number): void {
    page.value = newPage
  }

  function setPageSize(newPageSize: number): void {
    if (newPageSize === pageSize.value) return
    pageSize.value = newPageSize
    page.value = 1
  }

  function setSort(newSort: SortState | null): void {
    if (newSort?.key === sort.value?.key && newSort?.order === sort.value?.order) return
    sort.value = newSort
    page.value = 1
  }

  function setFilters(newFilters: ColumnFilter[]): void {
    filters.value = newFilters
    page.value = 1
  }

  function setSelectedKeys(keys: TableRowKey[]): void {
    selectedKeys.value = keys
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. High-level operations
  //
  // Composed from pure helpers. These are what the template calls.
  // ───────────────────────────────────────────────────────────────────────────

  function switchSort(column: TableColumn): void {
    const next = tableSort.switchSort(column, sort.value)
    setSort(next)
  }

  function toggleRow(key: TableRowKey): void {
    const next = tableSelection.toggleRow(key, selectedKeys.value)
    setSelectedKeys(next)
  }

  function selectAllVisible(): void {
    const visibleKeys = displayedRows.value.map(
      (row) => row[options.rowKey] as TableRowKey,
    )
    setSelectedKeys(tableSelection.selectAll(visibleKeys, selectedKeys.value))
  }

  function deselectAllVisible(): void {
    const visibleKeys = displayedRows.value.map(
      (row) => row[options.rowKey] as TableRowKey,
    )
    setSelectedKeys(tableSelection.deselectAll(visibleKeys, selectedKeys.value))
  }

  function handleHeaderCheckbox(checked: boolean): void {
    if (checked) selectAllVisible()
    else deselectAllVisible()
  }

  function clearFilter(column: TableColumn): void {
    const next = filters.value.filter((f) => f.field !== column.key)
    setFilters(next)
  }

  async function refetch(): Promise<void> {
    await performFetch()
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. State-bound helpers for template use
  //
  // Thin wrappers that bind the current state to the pure helpers, so the
  // template can call them without threading state manually.
  // ───────────────────────────────────────────────────────────────────────────

  function stateForColumn(column: TableColumn): SortIndicatorState {
    return tableSort.stateFor(column, sort.value)
  }

  function ariaSortForColumn(column: TableColumn): SortAriaValue {
    return tableSort.ariaSortFor(column, sort.value)
  }

  function isRowSelected(key: TableRowKey): boolean {
    return tableSelection.isSelected(key, selectedKeys.value)
  }

  const headerState = computed<MasterCheckboxState>(() => {
    const visibleKeys = displayedRows.value.map(
      (row) => row[options.rowKey] as TableRowKey,
    )
    return tableSelection.headerStateFor(visibleKeys, selectedKeys.value)
  })

  const showSelectionWarning = computed<boolean>(() =>
    tableSelection.showWarningFor(mode.value),
  )

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Public API
  // ───────────────────────────────────────────────────────────────────────────

  return {
    // State
    page,
    pageSize,
    sort,
    filters,
    selectedKeys,
    totalCount,
    isLoading,
    lastError,

    // Derived
    mode,
    displayedRows,

    // Setters
    setPage,
    setPageSize,
    setSort,
    setFilters,
    setSelectedKeys,

    // Operations
    switchSort,
    toggleRow,
    selectAllVisible,
    deselectAllVisible,
    handleHeaderCheckbox,
    clearFilter,

    // State-bound template helpers
    stateForColumn,
    ariaSortForColumn,
    isRowSelected,
    headerState,
    showSelectionWarning,

    // Imperative
    refetch,
  }
}