import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  ColumnFilter,
  LoadRowsParams,
  PaginatedResult,
  SortState,
  TableRow,
  TableRowKey,
} from '@ntp-lms-ui/lib/types'
import { createDevWarn } from '@ntp-lms-ui/lib'

const warn = createDevWarn('NtpTable/useTableFetch')

// ─────────────────────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────────────────────

interface UseTableFetchOptions {
  /** The loader. When absent, the composable does not fetch (fixed mode). */
  loadRows?: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>

  /** Initial values from props. The composable owns these thereafter. */
  initialPage: number
  initialPageSize: number
  initialSort: SortState | null
  initialFilters: ColumnFilter[]

  /** Emitters for two-way sync. */
  emit: {
    (event: 'update:rows', rows: TableRow[]): void
    (event: 'update:page', page: number): void
    (event: 'update:pageSize', pageSize: number): void
    (event: 'update:sort', sort: SortState | null): void
    (event: 'update:filters', filters: ColumnFilter[]): void
    (event: 'load-error', error: Error): void
  }

  /** Props exposed as refs for the sync watches (Option A). */
  pageProp: Ref<number>
  pageSizeProp: Ref<number>
  sortProp: Ref<SortState | null>
  filtersProp: Ref<ColumnFilter[]>
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────────────────────────

export function useTableFetch(options: UseTableFetchOptions) {
  // ───────────────────────────────────────────────────────────────────────────
  // Internal state
  // ───────────────────────────────────────────────────────────────────────────

  const internalPage = ref(options.initialPage)
  const internalPageSize = ref(options.initialPageSize)
  const internalSort = ref<SortState | null>(options.initialSort)
  const internalFilters = ref<ColumnFilter[]>(options.initialFilters)

  const internalTotalCount = ref(0)
  const isLoading = ref(false)
  const lastLoadError = ref<Error | null>(null)

  let requestId = 0

  // ───────────────────────────────────────────────────────────────────────────
  // Prop → internal sync (Option A: compare-on-watch, ignore echoes)
  // ───────────────────────────────────────────────────────────────────────────

  watch(options.pageProp, (newVal) => {
    if (newVal === internalPage.value) return
    internalPage.value = newVal
  })

  watch(options.pageSizeProp, (newVal) => {
    if (newVal === internalPageSize.value) return
    internalPageSize.value = newVal
  })

  watch(options.sortProp, (newVal) => {
    if (newVal === internalSort.value) return
    internalSort.value = newVal
  })

  watch(options.filtersProp, (newVal) => {
    if (newVal === internalFilters.value) return
    internalFilters.value = newVal
  })

  // ───────────────────────────────────────────────────────────────────────────
  // Internal change → prop sync (emit updates)
  // ───────────────────────────────────────────────────────────────────────────

  watch(internalPage, (newVal) => {
    if (newVal === options.pageProp.value) return
    options.emit('update:page', newVal)
  })

  watch(internalPageSize, (newVal) => {
    if (newVal === options.pageSizeProp.value) return
    options.emit('update:pageSize', newVal)
  })

  watch(internalSort, (newVal) => {
    if (newVal === options.sortProp.value) return
    options.emit('update:sort', newVal)
  })

  watch(internalFilters, (newVal) => {
    if (newVal === options.filtersProp.value) return
    options.emit('update:filters', newVal)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch key: a single trigger combining all request-affecting state
  // ───────────────────────────────────────────────────────────────────────────

  const fetchKey = computed(() => ({
    page: internalPage.value,
    pageSize: internalPageSize.value,
    sort: internalSort.value,
    filters: internalFilters.value,
  }))

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch
  // ───────────────────────────────────────────────────────────────────────────

  async function performFetch(): Promise<void> {
    const loader = options.loadRows
    if (!loader) return

    const id = ++requestId
    isLoading.value = true

    const params: LoadRowsParams = {
      page: internalPage.value,
      pageSize: internalPageSize.value,
      sort: internalSort.value,
      filters: internalFilters.value,
    }

    try {
      const response = await loader(params)

      if (id !== requestId) return  // stale response, ignore

      lastLoadError.value = null
      internalTotalCount.value = response.totalCount

      // Server-authoritative sync (handles out-of-range clamping).
      if (response.page !== internalPage.value) {
        internalPage.value = response.page
      }
      if (response.pageSize !== internalPageSize.value) {
        internalPageSize.value = response.pageSize
      }

      options.emit('update:rows', response.items)
    } catch (error) {
      if (id !== requestId) return  // stale error, ignore

      lastLoadError.value = error as Error
      options.emit('load-error', error as Error)
    } finally {
      if (id === requestId) {
        isLoading.value = false
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch trigger: watch the fetchKey (never `rows`)
  // ───────────────────────────────────────────────────────────────────────────

  watch(fetchKey, () => {
    performFetch()
  })

  // ───────────────────────────────────────────────────────────────────────────
  // Initial fetch
  // ───────────────────────────────────────────────────────────────────────────

  onMounted(() => {
    if (options.loadRows) {
      performFetch()
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // Public API
  // ───────────────────────────────────────────────────────────────────────────

  function setPage(page: number): void {
    internalPage.value = page
  }

  function setPageSize(pageSize: number): void {
    if (pageSize === internalPageSize.value) return
    internalPageSize.value = pageSize
    internalPage.value = 1  // reset in the same tick — batched by Vue
  }

  function setSort(sort: SortState | null): void {
    if (sort?.key === internalSort.value?.key && sort?.order === internalSort.value?.order) return
    internalSort.value = sort
    internalPage.value = 1  // reset — only matters in partial mode, but harmless otherwise
  }

  function setFilters(filters: ColumnFilter[]): void {
    internalFilters.value = filters
    internalPage.value = 1  // reset
  }

  async function refetch(): Promise<void> {
    await performFetch()
  }

  return {
    // State
    page: internalPage,
    pageSize: internalPageSize,
    sort: internalSort,
    filters: internalFilters,
    totalCount: internalTotalCount,
    isLoading,
    lastLoadError,

    // Setters
    setPage,
    setPageSize,
    setSort,
    setFilters,

    // Imperative
    refetch,
  }
}