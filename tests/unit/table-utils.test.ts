import { describe, it, expect, vi } from 'vitest'
import { applySortRequest, applyFilterRequest } from '../../src/lib/utils'
import type { ColumnFilter, LoadRowsParams, TableColumn } from '@ntp-lms-ui/lib/types'

function makeParams(overrides: Partial<LoadRowsParams> = {}): LoadRowsParams {
    return {
        page: 1,
        pageSize: 20,
        sort: null,
        filters: [],
        ...overrides,
    }
}

function makeColumn(key: string, overrides: Partial<TableColumn> = {}): TableColumn {
    return { key, label: key, ...overrides }
}

describe('applySortRequest', () => {
    it('returns params unchanged when sort is null', () => {
        const params = makeParams()
        expect(applySortRequest(params, [])).toBe(params)
    })

    it('returns params unchanged when the sort column has no sortRequest', () => {
        const params = makeParams({ sort: { key: 'title', order: 'asc' } })
        const columns = [makeColumn('title')]
        expect(applySortRequest(params, columns)).toBe(params)
    })

    it('returns params unchanged when the sort column is not found', () => {
        const params = makeParams({ sort: { key: 'unknown', order: 'asc' } })
        const columns = [makeColumn('title')]
        expect(applySortRequest(params, columns)).toBe(params)
    })

    it('invokes sortRequest with the column, order, and params', () => {
        const sortRequest = vi.fn((_col, _order, params) => params)
        const params = makeParams({ sort: { key: 'status', order: 'asc' } })
        const columns = [makeColumn('status', { sortRequest })]

        applySortRequest(params, columns)

        expect(sortRequest).toHaveBeenCalledWith(columns[0], 'asc', params)
    })

    it('returns the result of sortRequest', () => {
        const modified = makeParams({ sort: { key: 'status__label', order: 'asc' } })
        const sortRequest = vi.fn(() => modified)
        const params = makeParams({ sort: { key: 'status', order: 'asc' } })
        const columns = [makeColumn('status', { sortRequest })]

        expect(applySortRequest(params, columns)).toBe(modified)
    })
})

describe('applyFilterRequest', () => {
    it('returns params unchanged when no filters', () => {
        const params = makeParams()
        expect(applyFilterRequest(params, [])).toBe(params)
    })

    it('returns params unchanged when no column has filterRequest', () => {
        const params = makeParams({
            filters: [{ field: 'title', mode: 'icontains', value: 'x' }],
        })
        const columns = [makeColumn('title')]
        expect(applyFilterRequest(params, columns)).toBe(params)
    })

    it('invokes filterRequest with the column, filter, and params', () => {
        const filterRequest = vi.fn((_col, _filter, params) => params)
        const filter: ColumnFilter = { field: 'status', mode: 'exact', value: 'ACTIVE' }
        const params = makeParams({ filters: [filter] })
        const columns = [makeColumn('status', { filterRequest })]

        applyFilterRequest(params, columns)

        expect(filterRequest).toHaveBeenCalledWith(columns[0], filter, params)
    })

    it('accumulates modifications across multiple filterRequests', () => {
        const firstRequest = vi.fn((_col, _filter, params: LoadRowsParams) => ({
            ...params,
            filters: [...params.filters, { field: 'extra1', mode: 'exact' as const, value: 'a' }],
        }))
        const secondRequest = vi.fn((_col, _filter, params: LoadRowsParams) => ({
            ...params,
            filters: [...params.filters, { field: 'extra2', mode: 'exact' as const, value: 'b' }],
        }))

        const params = makeParams({
            filters: [
                { field: 'status', mode: 'exact', value: 'ACTIVE' },
                { field: 'course', mode: 'exact', value: 'c1' },
            ],
        })
        const columns = [
            makeColumn('status', { filterRequest: firstRequest }),
            makeColumn('course', { filterRequest: secondRequest }),
        ]

        const result = applyFilterRequest(params, columns)

        expect(result.filters.some((f) => f.field === 'extra1')).toBe(true)
        expect(result.filters.some((f) => f.field === 'extra2')).toBe(true)

        // Second request saw the accumulated params
        expect(secondRequest).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.objectContaining({
                filters: expect.arrayContaining([
                    expect.objectContaining({ field: 'extra1' }),
                ]),
            }),
        )
    })

    it('skips filters for columns without filterRequest', () => {
        const filterRequest = vi.fn((_col, _filter, params) => params)
        const params = makeParams({
            filters: [
                { field: 'title', mode: 'icontains', value: 'x' },
                { field: 'status', mode: 'exact', value: 'ACTIVE' },
            ],
        })
        const columns = [
            makeColumn('title'),
            makeColumn('status', { filterRequest }),
        ]

        applyFilterRequest(params, columns)

        expect(filterRequest).toHaveBeenCalledTimes(1)
        expect(filterRequest).toHaveBeenCalledWith(
            columns[1],
            expect.objectContaining({ field: 'status' }),
            expect.anything(),
        )
    })
})