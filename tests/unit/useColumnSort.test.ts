import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useColumnSort } from '../../src/lib/composables/useColumnSort'
import type { SortState, TableColumn, TableRow } from '@ntp-lms-ui/lib/types'

function makeColumn(
    key: string,
    overrides: Partial<TableColumn> = {},
): TableColumn {
    return { key, label: key, ...overrides }
}

function makeRow(data: Record<string, any>): TableRow {
    return data
}

describe('useColumnSort', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
    })

    afterEach(() => {
        consoleWarnSpy.mockRestore()
    })

    // ───────────────────────────────────────────────────────────────────────────
    // compare (default comparator only)
    // ───────────────────────────────────────────────────────────────────────────

    describe('compare', () => {
        it('compares text lexicographically', () => {
            const { compare } = useColumnSort()
            expect(compare('Alpha', 'Beta', makeColumn('title'))).toBeLessThan(0)
            expect(compare('Beta', 'Alpha', makeColumn('title'))).toBeGreaterThan(0)
            expect(compare('Alpha', 'Alpha', makeColumn('title'))).toBe(0)
        })

        it('compares numbers numerically', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('score', { type: 'number' })
            expect(compare(10, 5, column)).toBeGreaterThan(0)
            expect(compare(5, 10, column)).toBeLessThan(0)
            expect(compare(5, 5, column)).toBe(0)
        })

        it('coerces string numbers when comparing', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('score', { type: 'number' })
            expect(compare('10', '5', column)).toBeGreaterThan(0)
            expect(compare('5', '10', column)).toBeLessThan(0)
        })

        it('treats non-numeric strings as equal for number columns', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('score', { type: 'number' })
            expect(compare('abc', 'def', column)).toBe(0)
        })

        it('compares dates chronologically', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('createdAt', { type: 'date' })
            expect(compare('2026-01-15', '2026-02-01', column)).toBeLessThan(0)
            expect(compare('2026-02-01', '2026-01-15', column)).toBeGreaterThan(0)
            expect(compare('2026-01-15', '2026-01-15', column)).toBe(0)
        })

        it('treats unparseable dates as equal', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('createdAt', { type: 'date' })
            expect(compare('garbage', 'more garbage', column)).toBe(0)
        })

        it('compares enum values as text', () => {
            const { compare } = useColumnSort()
            const column = makeColumn('status', { type: 'enum' })
            expect(compare('ACTIVE', 'DRAFT', column)).toBeLessThan(0)
            expect(compare('DRAFT', 'ACTIVE', column)).toBeGreaterThan(0)
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // apply — scalar cells (existing behavior)
    // ───────────────────────────────────────────────────────────────────────────

    describe('apply — scalar cells', () => {
        it('returns the input array when sort is null', () => {
            const { apply } = useColumnSort()
            const rows = [makeRow({ title: 'B' }), makeRow({ title: 'A' })]
            const result = apply(rows, null, [makeColumn('title')])

            expect(result).toEqual(rows)
            expect(result).not.toBe(rows)  // new array
        })

        it('sorts rows ascending by default comparator', () => {
            const { apply } = useColumnSort()
            const rows = [
                makeRow({ id: 1, title: 'Beta' }),
                makeRow({ id: 2, title: 'Alpha' }),
                makeRow({ id: 3, title: 'Gamma' }),
            ]
            const sort: SortState = { key: 'title', order: 'asc' }
            const result = apply(rows, sort, [makeColumn('title')])

            expect(result.map((r) => r.title)).toEqual(['Alpha', 'Beta', 'Gamma'])
        })

        it('sorts rows descending', () => {
            const { apply } = useColumnSort()
            const rows = [
                makeRow({ id: 1, title: 'Alpha' }),
                makeRow({ id: 2, title: 'Beta' }),
            ]
            const sort: SortState = { key: 'title', order: 'desc' }
            const result = apply(rows, sort, [makeColumn('title')])

            expect(result.map((r) => r.title)).toEqual(['Beta', 'Alpha'])
        })

        it('does not mutate the input array', () => {
            const { apply } = useColumnSort()
            const rows = [makeRow({ title: 'B' }), makeRow({ title: 'A' })]
            const sort: SortState = { key: 'title', order: 'asc' }

            apply(rows, sort, [makeColumn('title')])

            expect(rows.map((r) => r.title)).toEqual(['B', 'A'])  // unchanged
        })

        it('returns unchanged (copy) when the sort column is unknown', () => {
            const { apply } = useColumnSort()
            const rows = [makeRow({ title: 'B' }), makeRow({ title: 'A' })]
            const sort: SortState = { key: 'unknown', order: 'asc' }

            const result = apply(rows, sort, [makeColumn('title')])

            expect(result).toEqual(rows)
            expect(result).not.toBe(rows)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('unknown column "unknown"'),
            )
        })

        it('does not emit a warning for scalar cells', () => {
            const { apply } = useColumnSort()
            const rows = [makeRow({ title: 'B' }), makeRow({ title: 'A' })]
            const sort: SortState = { key: 'title', order: 'asc' }

            apply(rows, sort, [makeColumn('title')])

            expect(consoleWarnSpy).not.toHaveBeenCalled()
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // apply — sortLocally
    // ───────────────────────────────────────────────────────────────────────────

    describe('apply — sortLocally', () => {
        it('uses sortLocally instead of the default comparator', () => {
            const sortLocally = vi.fn((a, b) => a.length - b.length)
            const rows = [
                makeRow({ id: 1, title: 'Beta' }),       // 4 chars
                makeRow({ id: 2, title: 'Alpha' }),      // 5 chars
                makeRow({ id: 3, title: 'Cat' }),        // 3 chars
            ]
            const sort: SortState = { key: 'title', order: 'asc' }
            const column = makeColumn('title', { sortLocally })

            const { apply } = useColumnSort()
            const result = apply(rows, sort, [column])

            // Sorted by length ascending: Cat (3), Beta (4), Alpha (5)
            expect(result.map((r) => r.title)).toEqual(['Cat', 'Beta', 'Alpha'])
        })

        it('passes raw cell values and rows to sortLocally', () => {
            const sortLocally = vi.fn((_a: any, _b: any, _rowA: TableRow, _rowB: TableRow) => 0)
            const rows = [
                makeRow({ id: 1, status: { value: 'ACTIVE', label: 'Active' } }),
                makeRow({ id: 2, status: { value: 'DRAFT', label: 'Draft' } }),
            ]
            const sort: SortState = { key: 'status', order: 'asc' }
            const column = makeColumn('status', { sortLocally })

            const { apply } = useColumnSort()
            apply(rows, sort, [column])

            expect(sortLocally).toHaveBeenCalled()

            // `.sort()` may call the comparator with arguments in any order.
            // Assert on the set of values passed, not on specific call positions.
            const calls = sortLocally.mock.calls
            const allCells = calls.flatMap((c) => [c[0], c[1]])
            const allRows = calls.flatMap((c) => [c[2], c[3]])

            expect(allCells).toContainEqual({ value: 'ACTIVE', label: 'Active' })
            expect(allCells).toContainEqual({ value: 'DRAFT', label: 'Draft' })
            expect(allRows).toContain(rows[0])
            expect(allRows).toContain(rows[1])
        })

        it('applies direction (desc) by negating the comparator result', () => {
            const sortLocally = (a: string, b: string) => a.localeCompare(b)
            const rows = [
                makeRow({ title: 'Alpha' }),
                makeRow({ title: 'Beta' }),
                makeRow({ title: 'Gamma' }),
            ]
            const ascSort: SortState = { key: 'title', order: 'asc' }
            const descSort: SortState = { key: 'title', order: 'desc' }
            const column = makeColumn('title', { sortLocally })

            const { apply } = useColumnSort()
            const asc = apply(rows, ascSort, [column])
            const desc = apply(rows, descSort, [column])

            expect(asc.map((r) => r.title)).toEqual(['Alpha', 'Beta', 'Gamma'])
            expect(desc.map((r) => r.title)).toEqual(['Gamma', 'Beta', 'Alpha'])
        })

        it('works with complex cells', () => {
            const sortLocally = (a: any, b: any) => a.label.localeCompare(b.label)
            const rows = [
                makeRow({ id: 1, status: { value: 'DRAFT', label: 'Draft' } }),
                makeRow({ id: 2, status: { value: 'ACTIVE', label: 'Active' } }),
            ]
            const sort: SortState = { key: 'status', order: 'asc' }
            const column = makeColumn('status', { sortLocally })

            const { apply } = useColumnSort()
            const result = apply(rows, sort, [column])

            expect(result.map((r) => r.status.label)).toEqual(['Active', 'Draft'])
        })

        it('does not warn for complex cells when sortLocally is provided', () => {
            const sortLocally = () => 0
            const rows = [
                makeRow({ status: { value: 'ACTIVE', label: 'Active' } }),
                makeRow({ status: { value: 'DRAFT', label: 'Draft' } }),
            ]
            const sort: SortState = { key: 'status', order: 'asc' }
            const column = makeColumn('status', { sortLocally })

            const { apply } = useColumnSort()
            apply(rows, sort, [column])

            expect(consoleWarnSpy).not.toHaveBeenCalled()
        })
    })

    // ───────────────────────────────────────────────────────────────────────────
    // apply — complex cells without sortLocally (fail-open policy)
    // ───────────────────────────────────────────────────────────────────────────

    describe('apply — complex cells without sortLocally', () => {
        it('treats object cells as equal and warns once', () => {
            const rows = [
                makeRow({ id: 1, status: { value: 'DRAFT', label: 'Draft' } }),
                makeRow({ id: 2, status: { value: 'ACTIVE', label: 'Active' } }),
            ]
            const sort: SortState = { key: 'status', order: 'asc' }
            const column = makeColumn('status')

            const { apply } = useColumnSort()
            const result = apply(rows, sort, [column])

            // Treated as equal → stable sort preserves input order
            expect(result.map((r) => r.id)).toEqual([1, 2])
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringMatching(/Column "status".*no sortLocally callback/),
            )
        })

        it('treats array cells as equal and warns once', () => {
            const rows = [
                makeRow({ id: 1, tags: ['A', 'B'] }),
                makeRow({ id: 2, tags: ['C'] }),
            ]
            const sort: SortState = { key: 'tags', order: 'asc' }
            const column = makeColumn('tags')

            const { apply } = useColumnSort()
            const result = apply(rows, sort, [column])

            expect(result.map((r) => r.id)).toEqual([1, 2])
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringMatching(/Column "tags".*no sortLocally callback/),
            )
        })

        it('warns once per apply even with many complex comparisons', () => {
            const rows = Array.from({ length: 10 }, (_, i) =>
                makeRow({ id: i, status: { value: `V${i}`, label: `Label ${i}` } }),
            )
            const sort: SortState = { key: 'status', order: 'asc' }
            const column = makeColumn('status')

            const { apply } = useColumnSort()
            apply(rows, sort, [column])

            expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
        })

        it('does not warn for scalar cells mixed with complex in other columns', () => {
            const rows = [
                makeRow({ title: 'Beta', status: { value: 'ACTIVE' } }),
                makeRow({ title: 'Alpha', status: { value: 'DRAFT' } }),
            ]
            const sort: SortState = { key: 'title', order: 'asc' }
            const columns = [makeColumn('title'), makeColumn('status')]

            const { apply } = useColumnSort()
            const result = apply(rows, sort, columns)

            expect(result.map((r) => r.title)).toEqual(['Alpha', 'Beta'])
            expect(consoleWarnSpy).not.toHaveBeenCalled()
        })
    })
})