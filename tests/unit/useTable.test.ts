import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, ref, nextTick } from 'vue'
import type { Ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useTable } from '../../src/components/NtpTable/composables'
import type {
    ColumnFilter,
    LoadRowsParams,
    PaginatedResult,
    SortState,
    TableColumn,
    TableRow,
    TableRowKey,
} from '@ntp-lms-ui/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeResult(
    items: TableRow[] = [],
    totalCount = items.length,
    page = 1,
    pageSize = 20,
): PaginatedResult<TableRow> {
    return { items, totalCount, page, pageSize }
}

function makeRow(id: number, extra: Record<string, any> = {}): TableRow {
    return { id, ...extra }
}

function makeColumn(key: string, sortable = false, filterable = false): TableColumn {
    return { key, label: key, sortable, filterable }
}

interface MountTableOptions {
    loadRows?: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>
    columns?: TableColumn[]
    rowKey?: string
    initialPage?: number
    initialPageSize?: number
    initialSort?: SortState | null
    initialFilters?: ColumnFilter[]
    initialSelectedKeys?: TableRowKey[]
    initialRows?: TableRow[]
}

function mountTable(options: MountTableOptions = {}) {
    const rowKey = options.rowKey ?? 'id'

    const rowsProp = ref<TableRow[] | undefined>(options.initialRows)
    const pageProp = ref<number | undefined>(options.initialPage)
    const pageSizeProp = ref<number | undefined>(options.initialPageSize)
    const sortProp = ref<SortState | null | undefined>(options.initialSort)
    const filtersProp = ref<ColumnFilter[] | undefined>(options.initialFilters)
    const selectedKeysProp = ref<TableRowKey[] | undefined>(options.initialSelectedKeys)

    const emit = vi.fn((event: string, value: unknown) => {
        if (event === 'update:rows') rowsProp.value = value as TableRow[]
        if (event === 'update:page') pageProp.value = value as number
        if (event === 'update:pageSize') pageSizeProp.value = value as number
        if (event === 'update:sort') sortProp.value = value as SortState | null
        if (event === 'update:filters') filtersProp.value = value as ColumnFilter[]
        if (event === 'update:selectedKeys') selectedKeysProp.value = value as TableRowKey[]
    })

    let result: ReturnType<typeof useTable> | undefined

    const wrapper = mount(defineComponent({
        setup() {
            result = useTable({
                loadRows: options.loadRows,
                columns: options.columns ?? [],
                rowKey,
                initialRows: rowsProp.value ?? [],
                initialPage: pageProp.value ?? 1,
                initialPageSize: pageSizeProp.value ?? 20,
                initialSort: sortProp.value ?? null,
                initialFilters: filtersProp.value ?? [],
                initialSelectedKeys: selectedKeysProp.value ?? [],
                rowsProp,
                pageProp,
                pageSizeProp,
                sortProp,
                filtersProp,
                selectedKeysProp,
                emit,
            })
            return {}
        },
        template: '<div />',
    }))

    return {
        wrapper,
        result: result!,
        emit,
        rowsProp,
        pageProp,
        pageSizeProp,
        sortProp,
        filtersProp,
        selectedKeysProp,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('useTable', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
    })

    afterEach(() => {
        consoleWarnSpy.mockRestore()
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Mode derivation
    // ───────────────────────────────────────────────────────────────────────────

    describe('mode derivation', () => {
        it('returns "fixed" when no loader is provided', () => {
            const { result } = mountTable()
            expect(result.mode.value).toBe('fixed')
        })

        it('returns "fixed" regardless of total count and page size when no loader', () => {
            const { result } = mountTable({
                initialRows: Array.from({ length: 100 }, (_, i) => makeRow(i)),
                initialPageSize: 20,
            })
            expect(result.mode.value).toBe('fixed')
        })

        it('returns "complete" when total count fits within page size', () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 10, 1, 20)),
            })
            expect(result.mode.value).toBe('complete')
        })

        it('returns "partial" when total count exceeds page size', async () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 100, 1, 20)),
            })
            await flushPromises()
            expect(result.mode.value).toBe('partial')
        })

        it('returns "complete" when total count equals page size', async () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 20, 1, 20)),
            })
            await flushPromises()
            expect(result.mode.value).toBe('complete')
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Initial mount
    // ───────────────────────────────────────────────────────────────────────────

    describe('initial mount', () => {
        it('does not fetch on mount when no loader is provided', async () => {
            const { result } = mountTable()
            await flushPromises()
            expect(result.isLoading.value).toBe(false)
        })

        it('fetches on mount when a loader is provided', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([makeRow(1)], 1))
            mountTable({ loadRows })
            await flushPromises()
            expect(loadRows).toHaveBeenCalledTimes(1)
        })

        it('calls the loader with default params on mount', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 0, 1, 20))
            mountTable({ loadRows })
            await flushPromises()
            expect(loadRows).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                sort: null,
                filters: [],
            })
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Response sync
    // ───────────────────────────────────────────────────────────────────────────

    describe('response sync', () => {
        it('updates totalCount from the response', async () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 42, 1, 20)),
            })
            await flushPromises()
            expect(result.totalCount.value).toBe(42)
        })

        it('syncs page from the response (server clamping)', async () => {
            const { result, pageProp } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 5, 1, 20)),
                initialPage: 99,
            })
            await flushPromises()
            expect(result.page.value).toBe(1)
            expect(pageProp.value).toBe(1)
        })

        it('syncs pageSize from the response', async () => {
            const { result, pageSizeProp } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 100, 1, 50)),
                initialPageSize: 20,
            })
            await flushPromises()
            expect(result.pageSize.value).toBe(50)
            expect(pageSizeProp.value).toBe(50)
        })

        it('emits update:rows with the response items', async () => {
            const items = [makeRow(1), makeRow(2)]
            const { emit } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult(items, 2)),
            })
            await flushPromises()
            expect(emit).toHaveBeenCalledWith('update:rows', items)
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Prop → internal sync
    // ───────────────────────────────────────────────────────────────────────────

    describe('prop sync', () => {
        it('absorbs external page changes', async () => {
            const { result, pageProp } = mountTable()
            pageProp.value = 5
            await nextTick()
            expect(result.page.value).toBe(5)
        })

        it('absorbs external pageSize changes', async () => {
            const { result, pageSizeProp } = mountTable()
            pageSizeProp.value = 50
            await nextTick()
            expect(result.pageSize.value).toBe(50)
        })

        it('absorbs external sort changes', async () => {
            const { result, sortProp } = mountTable()
            sortProp.value = { key: 'title', order: 'asc' }
            await nextTick()
            expect(result.sort.value).toEqual({ key: 'title', order: 'asc' })
        })

        it('absorbs external filter changes', async () => {
            const { result, filtersProp } = mountTable()
            filtersProp.value = [{ field: 'title', mode: 'icontains', value: 'x' }]
            await nextTick()
            expect(result.filters.value).toEqual([{ field: 'title', mode: 'icontains', value: 'x' }])
        })

        it('absorbs external selectedKeys changes', async () => {
            const { result, selectedKeysProp } = mountTable()
            selectedKeysProp.value = [1, 2]
            await nextTick()
            expect(result.selectedKeys.value).toEqual([1, 2])
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Setters
    // ───────────────────────────────────────────────────────────────────────────

    describe('setters', () => {
        it('setPage updates page', async () => {
            const { result } = mountTable()
            result.setPage(3)
            await nextTick()
            expect(result.page.value).toBe(3)
        })

        it('setPageSize updates pageSize and resets page', async () => {
            const { result } = mountTable({ initialPage: 5 })
            result.setPageSize(50)
            await nextTick()
            expect(result.pageSize.value).toBe(50)
            expect(result.page.value).toBe(1)
        })

        it('setPageSize is a no-op when pageSize is unchanged', async () => {
            const { result } = mountTable({ initialPage: 5, initialPageSize: 20 })
            result.setPageSize(20)
            await nextTick()
            expect(result.page.value).toBe(5)
        })

        it('setSort updates sort and resets page', async () => {
            const { result } = mountTable({ initialPage: 5 })
            result.setSort({ key: 'title', order: 'asc' })
            await nextTick()
            expect(result.sort.value).toEqual({ key: 'title', order: 'asc' })
            expect(result.page.value).toBe(1)
        })

        it('setFilters updates filters and resets page', async () => {
            const { result } = mountTable({ initialPage: 5 })
            result.setFilters([{ field: 'title', mode: 'icontains', value: 'x' }])
            await nextTick()
            expect(result.filters.value).toHaveLength(1)
            expect(result.page.value).toBe(1)
        })

        it('setSelectedKeys updates selectedKeys', async () => {
            const { result } = mountTable()
            result.setSelectedKeys([1, 2, 3])
            await nextTick()
            expect(result.selectedKeys.value).toEqual([1, 2, 3])
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Fetch trigger
    // ───────────────────────────────────────────────────────────────────────────

    describe('fetch trigger', () => {
        it('page change triggers fetch', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 100, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setPage(2)
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBeGreaterThan(callsBefore)
        })

        it('pageSize change triggers fetch', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 100, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setPageSize(50)
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBeGreaterThan(callsBefore)
        })

        it('sort change triggers fetch in partial mode', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 100, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setSort({ key: 'title', order: 'asc' })
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBeGreaterThan(callsBefore)
        })

        it('filter change triggers fetch in partial mode', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 100, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setFilters([{ field: 'title', mode: 'icontains', value: 'x' }])
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBeGreaterThan(callsBefore)
        })

        it('sort change does NOT trigger fetch in complete mode', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 5, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setSort({ key: 'title', order: 'asc' })
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBe(callsBefore)
        })

        it('filter change does NOT trigger fetch in complete mode', async () => {
            const loadRows = vi.fn().mockResolvedValue(makeResult([], 5, 1, 20))
            const { result } = mountTable({ loadRows })
            await flushPromises()

            const callsBefore = loadRows.mock.calls.length
            result.setFilters([{ field: 'title', mode: 'icontains', value: 'x' }])
            await nextTick()
            await flushPromises()

            expect(loadRows.mock.calls.length).toBe(callsBefore)
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Concurrency
    // ───────────────────────────────────────────────────────────────────────────

    describe('concurrency', () => {
        it('ignores stale responses when multiple fetches race', async () => {
            let resolveFirst: (v: PaginatedResult<TableRow>) => void
            let resolveSecond: (v: PaginatedResult<TableRow>) => void

            const firstPromise = new Promise<PaginatedResult<TableRow>>((r) => { resolveFirst = r })
            const secondPromise = new Promise<PaginatedResult<TableRow>>((r) => { resolveSecond = r })

            const calls: number[] = []
            const loadRows = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
                calls.push(params.page)
                return calls.length === 1 ? firstPromise : secondPromise
            }

            const { result, emit } = mountTable({ loadRows })

            await nextTick()
            result.setPage(2)
            await nextTick()

            // Keep totalCount stable across fetches (avoid mode transition).
            resolveSecond!({ items: [makeRow(2)], totalCount: 5, page: 2, pageSize: 20 })
            await flushPromises()

            resolveFirst!({ items: [makeRow(1)], totalCount: 5, page: 1, pageSize: 20 })
            await flushPromises()

            const rowsCalls = emit.mock.calls.filter(([event]) => event === 'update:rows')
            expect(rowsCalls).toHaveLength(1)
            expect(rowsCalls[0][1]).toEqual([makeRow(2)])
        })

        it('ignores stale errors when a newer fetch succeeds', async () => {
            let rejectFirst: (e: Error) => void
            const firstPromise = new Promise<PaginatedResult<TableRow>>((_, r) => { rejectFirst = r })
            const secondPromise = Promise.resolve(makeResult([makeRow(2)], 5, 2, 20))

            const calls: number[] = []
            const loadRows = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
                calls.push(params.page)
                return calls.length === 1 ? firstPromise : secondPromise
            }

            const { result, emit } = mountTable({ loadRows })

            await nextTick()
            result.setPage(2)
            await nextTick()

            await flushPromises()  // second fetch completes
            rejectFirst!(new Error('stale'))
            await flushPromises()

            const errorCalls = emit.mock.calls.filter(([event]) => event === 'load-error')
            expect(errorCalls).toHaveLength(0)
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Operations
    // ───────────────────────────────────────────────────────────────────────────

    describe('operations', () => {
        it('switchSort cycles null → asc', async () => {
            const { result } = mountTable()
            result.switchSort(makeColumn('title', true))
            await nextTick()
            expect(result.sort.value).toEqual({ key: 'title', order: 'asc' })
        })

        it('toggleRow adds a key', async () => {
            const { result } = mountTable({ initialRows: [makeRow(1), makeRow(2)] })
            result.toggleRow(1)
            await nextTick()
            expect(result.selectedKeys.value).toEqual([1])
        })

        it('selectAllVisible adds all visible keys', async () => {
            const { result } = mountTable({ initialRows: [makeRow(1), makeRow(2)] })
            result.selectAllVisible()
            await nextTick()
            expect(result.selectedKeys.value).toHaveLength(2)
        })

        it('deselectAllVisible removes visible keys', async () => {
            const { result } = mountTable({
                initialRows: [makeRow(1), makeRow(2)],
                initialSelectedKeys: [1, 2, 99],
            })
            result.deselectAllVisible()
            await nextTick()
            expect(result.selectedKeys.value).toEqual([99])
        })

        it('handleHeaderCheckbox(true) selects all visible', async () => {
            const { result } = mountTable({ initialRows: [makeRow(1), makeRow(2)] })
            result.handleHeaderCheckbox(true)
            await nextTick()
            expect(result.selectedKeys.value).toHaveLength(2)
        })

        it('handleHeaderCheckbox(false) deselects all visible', async () => {
            const { result } = mountTable({
                initialRows: [makeRow(1), makeRow(2)],
                initialSelectedKeys: [1, 2],
            })
            result.handleHeaderCheckbox(false)
            await nextTick()
            expect(result.selectedKeys.value).toEqual([])
        })

        it('clearFilter removes filters for the column', async () => {
            const { result } = mountTable({
                initialFilters: [
                    { field: 'title', mode: 'icontains', value: 'x' },
                    { field: 'status', mode: 'exact', value: 'ACTIVE' },
                ],
            })
            result.clearFilter(makeColumn('title'))
            await nextTick()
            expect(result.filters.value).toEqual([
                { field: 'status', mode: 'exact', value: 'ACTIVE' },
            ])
        })

        it('clearFilter preserves filters for other columns', async () => {
            const { result } = mountTable({
                initialFilters: [
                    { field: 'title', mode: 'icontains', value: 'x' },
                    { field: 'status', mode: 'exact', value: 'ACTIVE' },
                ],
            })
            result.clearFilter(makeColumn('unknown'))
            await nextTick()
            expect(result.filters.value).toHaveLength(2)
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // State-bound template helpers
    // ───────────────────────────────────────────────────────────────────────────

    describe('state-bound template helpers', () => {
        it('stateForColumn reflects the current sort', async () => {
            const { result } = mountTable({ initialSort: { key: 'title', order: 'asc' } })
            expect(result.stateForColumn(makeColumn('title', true))).toBe('asc')
            expect(result.stateForColumn(makeColumn('status', true))).toBe('none')
        })

        it('ariaSortForColumn reflects the current sort', async () => {
            const { result } = mountTable({ initialSort: { key: 'title', order: 'desc' } })
            expect(result.ariaSortForColumn(makeColumn('title', true))).toBe('descending')
            expect(result.ariaSortForColumn(makeColumn('status', true))).toBe('none')
        })

        it('isRowSelected reflects the current selection', async () => {
            const { result } = mountTable({ initialSelectedKeys: [1, 2] })
            expect(result.isRowSelected(1)).toBe(true)
            expect(result.isRowSelected(3)).toBe(false)
        })

        it('headerState reflects the visible selection state', async () => {
            const { result } = mountTable({
                initialRows: [makeRow(1), makeRow(2)],
                initialSelectedKeys: [],
            })
            expect(result.headerState.value).toBe('unchecked')

            result.setSelectedKeys([1])
            await nextTick()
            expect(result.headerState.value).toBe('indeterminate')

            result.setSelectedKeys([1, 2])
            await nextTick()
            expect(result.headerState.value).toBe('checked')
        })

        it('showSelectionWarning is true only in partial mode', async () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 100, 1, 20)),
            })
            await flushPromises()
            expect(result.showSelectionWarning.value).toBe(true)
        })

        it('showSelectionWarning is false in complete mode', async () => {
            const { result } = mountTable({
                loadRows: vi.fn().mockResolvedValue(makeResult([], 5, 1, 20)),
            })
            await flushPromises()
            expect(result.showSelectionWarning.value).toBe(false)
        })
    })
})