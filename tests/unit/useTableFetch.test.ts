import { describe, it, expect, vi } from 'vitest'
import { defineComponent, ref, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useTableFetch } from '../../src/components/NtpTable/composables/useTableFetch'
import type {
    ColumnFilter,
    LoadRowsParams,
    PaginatedResult,
    SortState,
    TableRow,
} from '@ntp-lms-ui/lib/types'
import { makeResult } from './helpers/table'

function makeLoader(
    responses: Record<number, PaginatedResult<TableRow> | Error>,
): { loader: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>; calls: LoadRowsParams[] } {
    const calls: LoadRowsParams[] = []
    let callIndex = 0

    const loader = async (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
        calls.push(params)
        const response = responses[callIndex++]
        if (response instanceof Error) throw response
        if (!response) throw new Error(`No response configured for call ${callIndex}`)
        return response
    }

    return { loader, calls }
}

function mountFetch(options: {
    loadRows?: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>
    initialPage?: number
    initialPageSize?: number
    initialSort?: { key: string, order: 'asc' | 'desc' } | null
    initialFilters?: Array<{ field: string, mode: 'exact' | 'icontains' | 'gte' | 'lte' | 'gt' | 'lt' | 'in', value: string | number | string[] }>
}) {
    const pageProp = ref(options.initialPage ?? 1)
    const pageSizeProp = ref(options.initialPageSize ?? 20)
    const sortProp = ref(options.initialSort ?? null)
    const filtersProp = ref(options.initialFilters ?? [])

    const emit = vi.fn((event: string, value: unknown) => {
        if (event === 'update:page') pageProp.value = value as number
        else if (event === 'update:pageSize') pageSizeProp.value = value as number
        else if (event === 'update:sort') sortProp.value = value as SortState | null
        else if (event === 'update:filters') filtersProp.value = value as ColumnFilter[]
    })

    let result: ReturnType<typeof useTableFetch> | undefined

    mount(defineComponent({
        setup() {
            result = useTableFetch({
                loadRows: options.loadRows,
                initialPage: pageProp.value,
                initialPageSize: pageSizeProp.value,
                initialSort: sortProp.value,
                initialFilters: filtersProp.value,
                emit,
                pageProp,
                pageSizeProp,
                sortProp,
                filtersProp,
            })
            return {}
        },
        template: '<div />',
    }))

    return { result: result!, emit, pageProp, pageSizeProp, sortProp, filtersProp }
}

function makeEchoLoader(totalCount = 100) {
    return (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> =>
        Promise.resolve({
            items: [],
            totalCount,
            page: params.page,
            pageSize: params.pageSize,
        })
}

describe('useTableFetch', () => {
    describe('fixed mode (no loader)', () => {
        it('does not fetch on mount', async () => {
            const { result } = mountFetch({ loadRows: undefined })

            await flushPromises()

            expect(result.isLoading.value).toBe(false)
        })

        it('refetch is a no-op', async () => {
            const { result } = mountFetch({ loadRows: undefined })

            await result.refetch()

            expect(result.isLoading.value).toBe(false)
        })
    })

    describe('initial fetch', () => {
        it('calls loadRows on mount', async () => {
            const { loader, calls } = makeLoader({ 0: makeResult([{ id: 1 }], 1) })
            mountFetch({ loadRows: loader })

            await flushPromises()

            expect(calls).toHaveLength(1)
            expect(calls[0]).toEqual({
                page: 1,
                pageSize: 20,
                sort: null,
                filters: [],
            })
        })

        it('emits update:rows with the response items', async () => {
            const { loader } = makeLoader({ 0: makeResult([{ id: 1 }, { id: 2 }], 2) })
            const { emit } = mountFetch({ loadRows: loader })

            await flushPromises()

            expect(emit).toHaveBeenCalledWith('update:rows', [{ id: 1 }, { id: 2 }])
        })

        it('updates totalCount from the response', async () => {
            const { loader } = makeLoader({ 0: makeResult([{ id: 1 }], 42) })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            expect(result.totalCount.value).toBe(42)
        })

        it('syncs internalPage from the response (server clamping)', async () => {
            const calls: LoadRowsParams[] = []
            const loader = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
                calls.push(params)
                // Server clamps page 99 to page 1 (out-of-range).
                const clampedPage = params.page > 1 ? 1 : params.page
                return Promise.resolve({
                    items: [{ id: 1 }],
                    totalCount: 5,
                    page: clampedPage,
                    pageSize: params.pageSize,
                })
            }

            const { result, emit, pageProp } = mountFetch({
                loadRows: loader,
                initialPage: 99,
            })

            await flushPromises()

            expect(result.page.value).toBe(1)
            expect(pageProp.value).toBe(1)
            expect(emit).toHaveBeenCalledWith('update:page', 1)
        })

        it('syncs internalPageSize from the response', async () => {
            const loader = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> =>
                Promise.resolve({
                    items: [{ id: 1 }],
                    totalCount: 100,
                    page: params.page,
                    pageSize: 50,  // Server returns 50 regardless of request
                })

            const { result, emit, pageSizeProp } = mountFetch({
                loadRows: loader,
                initialPageSize: 20,
            })

            await flushPromises()

            expect(result.pageSize.value).toBe(50)
            expect(pageSizeProp.value).toBe(50)
            expect(emit).toHaveBeenCalledWith('update:pageSize', 50)
        })
    })

    describe('error handling', () => {
        it('sets lastLoadError on loader rejection', async () => {
            const error = new Error('network error')
            const { loader } = makeLoader({ 0: error })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            expect(result.lastLoadError.value).toBe(error)
        })

        it('emits load-error on loader rejection', async () => {
            const error = new Error('network error')
            const { loader } = makeLoader({ 0: error })
            const { emit } = mountFetch({ loadRows: loader })

            await flushPromises()

            expect(emit).toHaveBeenCalledWith('load-error', error)
        })

        it('clears lastLoadError on subsequent success', async () => {
            const error = new Error('fail')
            const { loader } = makeLoader({ 0: error, 1: makeResult([{ id: 1 }], 1) })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()
            expect(result.lastLoadError.value).toBe(error)

            await result.refetch()
            await flushPromises()

            expect(result.lastLoadError.value).toBeNull()
        })
    })

    describe('refetch', () => {
        it('re-invokes loader with current params', async () => {
            const { loader, calls } = makeLoader({
                0: makeResult([{ id: 1 }], 1),
                1: makeResult([{ id: 2 }], 1),
            })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()
            expect(calls).toHaveLength(1)

            await result.refetch()
            await flushPromises()

            expect(calls).toHaveLength(2)
            expect(calls[1]).toEqual(calls[0])
        })
    })

    describe('setters', () => {
        it('setPage triggers a fetch with the new page', async () => {
            const { loader, calls } = makeLoader({
                0: makeResult([{ id: 1 }], 100, 1, 20),
                1: makeResult([{ id: 21 }], 100, 2, 20),
            })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            result.setPage(2)
            await nextTick()
            await flushPromises()

            expect(calls).toHaveLength(2)
            expect(calls[1].page).toBe(2)
        })

        it('setPageSize resets page to 1 and fetches', async () => {
            const calls: LoadRowsParams[] = []
            const loader = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
                calls.push({ ...params })
                return Promise.resolve({
                    items: [],
                    totalCount: 100,
                    page: params.page,
                    pageSize: params.pageSize,
                })
            }

            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            result.setPage(3)
            await nextTick()
            await flushPromises()

            result.setPageSize(50)
            await nextTick()
            await flushPromises()

            const lastCall = calls[calls.length - 1]
            expect(lastCall.page).toBe(1)
            expect(lastCall.pageSize).toBe(50)
        })

        it('setSort resets page to 1 and fetches', async () => {
            const { loader, calls } = makeLoader({
                0: makeResult([], 100, 3, 20),
                1: makeResult([], 100, 3, 20),
                2: makeResult([], 100, 1, 20),
            })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            result.setPage(3)
            await nextTick()
            await flushPromises()

            result.setSort({ key: 'title', order: 'asc' })
            await nextTick()
            await flushPromises()

            const lastCall = calls[calls.length - 1]
            expect(lastCall.page).toBe(1)
            expect(lastCall.sort).toEqual({ key: 'title', order: 'asc' })
        })

        it('setFilters resets page to 1 and fetches', async () => {
            const { loader, calls } = makeLoader({
                0: makeResult([], 100, 3, 20),
                1: makeResult([], 100, 3, 20),
                2: makeResult([], 100, 1, 20),
            })
            const { result } = mountFetch({ loadRows: loader })

            await flushPromises()

            result.setPage(3)
            await nextTick()
            await flushPromises()

            result.setFilters([{ field: 'title', mode: 'icontains', value: 'test' }])
            await nextTick()
            await flushPromises()

            const lastCall = calls[calls.length - 1]
            expect(lastCall.page).toBe(1)
            expect(lastCall.filters).toEqual([{ field: 'title', mode: 'icontains', value: 'test' }])
        })
    })

    describe('concurrency', () => {
        it('ignores stale responses when multiple fetches race', async () => {
            let resolveFirst: (value: PaginatedResult<TableRow>) => void
            let resolveSecond: (value: PaginatedResult<TableRow>) => void

            const firstPromise = new Promise<PaginatedResult<TableRow>>((r) => { resolveFirst = r })
            const secondPromise = new Promise<PaginatedResult<TableRow>>((r) => { resolveSecond = r })

            const calls: number[] = []
            const loader = (params: LoadRowsParams): Promise<PaginatedResult<TableRow>> => {
                calls.push(params.page)
                return calls.length === 1 ? firstPromise : secondPromise
            }

            const { result, emit } = mountFetch({ loadRows: loader })

            // Mount triggers first fetch (page 1, in flight).
            // Trigger a second fetch by changing the page.
            await nextTick()
            result.setPage(2)
            await nextTick()

            // Resolve the second (newer) fetch first.
            resolveSecond!({ items: [{ id: 2 }], totalCount: 100, page: 2, pageSize: 20 })
            await flushPromises()

            // Then resolve the first (stale) fetch.
            resolveFirst!({ items: [{ id: 1 }], totalCount: 100, page: 1, pageSize: 20 })
            await flushPromises()

            // The stale response should be ignored.
            const rowsCalls = emit.mock.calls.filter(([event]) => event === 'update:rows')
            expect(rowsCalls).toHaveLength(1)
            expect(rowsCalls[0][1]).toEqual([{ id: 2 }])
        })
    })
})

describe('prop sync', () => {
    it('absorbs external page prop changes and refetches', async () => {
        const { loader, calls } = makeLoader({
            0: makeResult([], 100, 1, 20),
            1: makeResult([], 100, 2, 20),
        })
        const { result, pageProp } = mountFetch({ loadRows: loader })

        await flushPromises()

        pageProp.value = 2
        await nextTick()
        await flushPromises()

        expect(result.page.value).toBe(2)
        expect(calls[calls.length - 1].page).toBe(2)
    })

    it('absorbs external pageSize prop changes and refetches', async () => {
        const { loader, calls } = makeLoader({
            0: makeResult([], 100, 1, 20),
            1: makeResult([], 100, 1, 50),
        })
        const { result, pageSizeProp } = mountFetch({ loadRows: loader })

        await flushPromises()

        pageSizeProp.value = 50
        await nextTick()
        await flushPromises()

        expect(result.pageSize.value).toBe(50)
        expect(calls[calls.length - 1].pageSize).toBe(50)
    })

    it('absorbs external sort prop changes and refetches', async () => {
        const { loader, calls } = makeLoader({
            0: makeResult([], 100, 1, 20),
            1: makeResult([], 100, 1, 20),
        })
        const { result, sortProp } = mountFetch({ loadRows: loader })

        await flushPromises()

        sortProp.value = { key: 'title', order: 'asc' }
        await nextTick()
        await flushPromises()

        expect(result.sort.value).toEqual({ key: 'title', order: 'asc' })
        expect(calls[calls.length - 1].sort).toEqual({ key: 'title', order: 'asc' })
    })

    it('absorbs external filters prop changes and refetches', async () => {
        const { loader, calls } = makeLoader({
            0: makeResult([], 100, 1, 20),
            1: makeResult([], 100, 1, 20),
        })
        const { result, filtersProp } = mountFetch({ loadRows: loader })

        await flushPromises()

        const nextFilters = [{ field: 'title', mode: 'icontains' as const, value: 'test' }]
        filtersProp.value = nextFilters
        await nextTick()
        await flushPromises()

        expect(result.filters.value).toEqual(nextFilters)
        expect(calls[calls.length - 1].filters).toEqual(nextFilters)
    })
})