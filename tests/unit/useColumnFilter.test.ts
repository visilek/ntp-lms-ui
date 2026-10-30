import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useColumnFilter } from '../../src/lib/composables/useColumnFilter'
import type { ColumnFilter, TableColumn, TableRow } from '@ntp-lms-ui/lib/types'

function makeColumn(
  key: string,
  overrides: Partial<TableColumn> = {},
): TableColumn {
  return { key, label: key, ...overrides }
}

function makeRow(data: Record<string, any>): TableRow {
  return data
}

describe('useColumnFilter', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
  })

  describe('matches', () => {
    it('uses filterLocally when provided', () => {
      const filterLocally = vi.fn(() => true)
      const column = makeColumn('title', { filterLocally })
      const filter: ColumnFilter = { field: 'title', mode: 'icontains', value: 'mech' }
      const row = makeRow({ title: 'Mechanics' })

      const { matches } = useColumnFilter()
      const result = matches('Mechanics', filter, column, row)

      expect(result).toBe(true)
      expect(filterLocally).toHaveBeenCalledWith('Mechanics', filter, row)
    })

    it('passes the raw cell value to filterLocally', () => {
      const filterLocally = vi.fn((cell) => cell.label === 'Active')
      const column = makeColumn('status', { filterLocally })
      const filter: ColumnFilter = { field: 'status', mode: 'exact', value: 'ACTIVE' }
      const cell = { value: 'ACTIVE', label: 'Active' }
      const row = makeRow({ status: cell })

      const { matches } = useColumnFilter()
      matches(cell, filter, column, row)

      expect(filterLocally).toHaveBeenCalledWith(cell, filter, row)
    })

    it('falls back to default matcher when no filterLocally', () => {
      const column = makeColumn('title')
      const filter: ColumnFilter = { field: 'title', mode: 'icontains', value: 'mech' }
      const row = makeRow({ title: 'Mechanics' })

      const { matches } = useColumnFilter()
      const result = matches('Mechanics', filter, column, row)

      expect(result).toBe(true)
    })

    it('catches exceptions thrown by filterLocally and returns true (fail-open)', () => {
      const filterLocally = vi.fn(() => { throw new Error('boom') })
      const column = makeColumn('title', { filterLocally })
      const filter: ColumnFilter = { field: 'title', mode: 'icontains', value: 'mech' }
      const row = makeRow({ title: 'Mechanics' })

      const { matches } = useColumnFilter()
      const result = matches('Mechanics', filter, column, row)

      expect(result).toBe(true)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('filterLocally for column "title" threw'),
      )
    })
  })

  describe('matchesAll', () => {
    it('returns true when no filters are provided', () => {
      const { matchesAll } = useColumnFilter()
      const row = makeRow({ title: 'Mechanics' })
      const result = matchesAll(row, [], [makeColumn('title')])

      expect(result).toBe(true)
    })

    it('AND-composes across multiple filters', () => {
      const columns = [makeColumn('title'), makeColumn('status')]
      const filters: ColumnFilter[] = [
        { field: 'title', mode: 'icontains', value: 'mech' },
        { field: 'status', mode: 'exact', value: 'ACTIVE' },
      ]
      const matchingRow = makeRow({ title: 'Mechanics', status: 'ACTIVE' })
      const nonMatchingRow = makeRow({ title: 'Mechanics', status: 'DRAFT' })

      const { matchesAll } = useColumnFilter()

      expect(matchesAll(matchingRow, filters, columns)).toBe(true)
      expect(matchesAll(nonMatchingRow, filters, columns)).toBe(false)
    })

    it('warns and ignores filters that reference unknown columns', () => {
      const columns = [makeColumn('title')]
      const filters: ColumnFilter[] = [
        { field: 'unknownField', mode: 'exact', value: 'x' },
      ]
      const row = makeRow({ title: 'Mechanics' })

      const { matchesAll } = useColumnFilter()
      const result = matchesAll(row, filters, columns)

      expect(result).toBe(true)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('filter references unknown column "unknownField"'),
      )
    })

    it('passes the row to filterLocally', () => {
      const filterLocally = vi.fn(() => true)
      const columns = [makeColumn('title', { filterLocally })]
      const filters: ColumnFilter[] = [
        { field: 'title', mode: 'icontains', value: 'mech' },
      ]
      const row = makeRow({ title: 'Mechanics' })

      const { matchesAll } = useColumnFilter()
      matchesAll(row, filters, columns)

      expect(filterLocally).toHaveBeenCalledWith('Mechanics', filters[0], row)
    })
  })

  describe('apply', () => {
    describe('scalar cells', () => {
      it('returns the input array when no filters are provided', () => {
        const { apply } = useColumnFilter()
        const rows = [makeRow({ title: 'A' }), makeRow({ title: 'B' })]
        const result = apply(rows, [], [makeColumn('title')])

        expect(result).toBe(rows)
      })

      it('filters rows using the default matcher', () => {
        const columns = [makeColumn('title')]
        const rows = [
          makeRow({ title: 'Mechanics' }),
          makeRow({ title: 'Optics' }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'title', mode: 'icontains', value: 'mech' },
        ]

        const { apply } = useColumnFilter()
        const result = apply(rows, filters, columns)

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('Mechanics')
      })

      it('does not emit any warning for scalar cells', () => {
        const columns = [makeColumn('title')]
        const rows = [makeRow({ title: 'Mechanics' })]
        const filters: ColumnFilter[] = [
          { field: 'title', mode: 'icontains', value: 'mech' },
        ]

        const { apply } = useColumnFilter()
        apply(rows, filters, columns)

        expect(consoleWarnSpy).not.toHaveBeenCalled()
      })
    })

    describe('complex cells', () => {
      it('uses filterLocally for object cells when provided', () => {
        const filterLocally = vi.fn((cell) => cell.label === 'Active')
        const columns = [makeColumn('status', { filterLocally })]
        const rows = [
          makeRow({ status: { value: 'ACTIVE', label: 'Active' } }),
          makeRow({ status: { value: 'DRAFT', label: 'Draft' } }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'status', mode: 'exact', value: 'Active' },
        ]

        const { apply } = useColumnFilter()
        const result = apply(rows, filters, columns)

        expect(result).toHaveLength(1)
        expect(result[0].status.label).toBe('Active')
      })

      it('fails open and warns once when object cells lack filterLocally', () => {
        const columns = [makeColumn('status')]
        const rows = [
          makeRow({ status: { value: 'ACTIVE', label: 'Active' } }),
          makeRow({ status: { value: 'DRAFT', label: 'Draft' } }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'status', mode: 'exact', value: 'ACTIVE' },
        ]

        const { apply } = useColumnFilter()
        const result = apply(rows, filters, columns)

        expect(result).toHaveLength(2)  // fail-open — all rows pass
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringMatching(/Column\(s\) "status".*no filterLocally callback/),
        )
      })

      it('fails open and warns for array cells without filterLocally', () => {
        const columns = [makeColumn('tags')]
        const rows = [
          makeRow({ tags: ['A', 'B'] }),
          makeRow({ tags: ['C'] }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'tags', mode: 'in', value: ['A'] },
        ]

        const { apply } = useColumnFilter()
        const result = apply(rows, filters, columns)

        expect(result).toHaveLength(2)
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringMatching(/Column\(s\) "tags".*no filterLocally callback/),
        )
      })

      it('aggregates multiple failed columns into one warning', () => {
        const columns = [makeColumn('status'), makeColumn('course')]
        const rows = [
          makeRow({
            status: { value: 'ACTIVE', label: 'Active' },
            course: { id: 'c1', title: 'Physics' },
          }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'status', mode: 'exact', value: 'ACTIVE' },
          { field: 'course', mode: 'exact', value: 'c1' },
        ]

        const { apply } = useColumnFilter()
        apply(rows, filters, columns)

        expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringMatching(/"status".*"course"|"course".*"status"/),
        )
      })

      it('does not warn for object cells when filterLocally is provided', () => {
        const columns = [
          makeColumn('status', { filterLocally: () => true }),
        ]
        const rows = [
          makeRow({ status: { value: 'ACTIVE', label: 'Active' } }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'status', mode: 'exact', value: 'ACTIVE' },
        ]

        const { apply } = useColumnFilter()
        apply(rows, filters, columns)

        expect(consoleWarnSpy).not.toHaveBeenCalled()
      })
    })

    describe('mixed scalar and complex cells', () => {
      it('handles a mix of scalar and complex columns without leaking warnings', () => {
        const filterLocally = vi.fn((cell) => cell.label === 'Active')
        const columns = [
          makeColumn('title'),
          makeColumn('status', { filterLocally }),
        ]
        const rows = [
          makeRow({ title: 'Mechanics', status: { value: 'ACTIVE', label: 'Active' } }),
          makeRow({ title: 'Optics', status: { value: 'DRAFT', label: 'Draft' } }),
        ]
        const filters: ColumnFilter[] = [
          { field: 'title', mode: 'icontains', value: 'mech' },
          { field: 'status', mode: 'exact', value: 'Active' },
        ]

        const { apply } = useColumnFilter()
        const result = apply(rows, filters, columns)

        expect(result).toHaveLength(1)
        expect(result[0].title).toBe('Mechanics')
        expect(consoleWarnSpy).not.toHaveBeenCalled()
      })
    })
  })
})