import { describe, it, expect } from 'vitest'
import { useTableSort } from '../../src/components/NtpTable/composables/useTableSort'
import type { SortState, TableColumn } from '@ntp-lms-ui/lib/types'

function makeColumn(key: string, sortable = true): TableColumn {
  return { key, label: key, sortable }
}

describe('useTableSort', () => {
  const { switchSort, ariaSortFor, stateFor } = useTableSort()

  describe('switchSort', () => {
    it('returns the current sort unchanged for non-sortable columns', () => {
      expect(switchSort(makeColumn('title', false), null)).toBeNull()

      const current: SortState = { key: 'status', order: 'asc' }
      expect(switchSort(makeColumn('title', false), current)).toBe(current)
    })

    it('cycles null → asc on a new column', () => {
      expect(switchSort(makeColumn('title'), null)).toEqual({ key: 'title', order: 'asc' })
    })

    it('cycles asc → desc on the same column', () => {
      const current: SortState = { key: 'title', order: 'asc' }
      expect(switchSort(makeColumn('title'), current)).toEqual({ key: 'title', order: 'desc' })
    })

    it('cycles desc → null on the same column', () => {
      const current: SortState = { key: 'title', order: 'desc' }
      expect(switchSort(makeColumn('title'), current)).toBeNull()
    })

    it('resets to asc when switching columns', () => {
      const current: SortState = { key: 'title', order: 'desc' }
      expect(switchSort(makeColumn('status'), current)).toEqual({ key: 'status', order: 'asc' })
    })
  })

  describe('ariaSortFor', () => {
    it('returns "none" for non-sortable columns', () => {
      expect(ariaSortFor(makeColumn('title', false), null)).toBe('none')

      const current: SortState = { key: 'title', order: 'asc' }
      expect(ariaSortFor(makeColumn('title', false), current)).toBe('none')
    })

    it('returns "none" when sort is null', () => {
      expect(ariaSortFor(makeColumn('title'), null)).toBe('none')
    })

    it('returns "none" for a non-active column', () => {
      const current: SortState = { key: 'title', order: 'asc' }
      expect(ariaSortFor(makeColumn('status'), current)).toBe('none')
    })

    it('returns "ascending" for the active ascending column', () => {
      const current: SortState = { key: 'title', order: 'asc' }
      expect(ariaSortFor(makeColumn('title'), current)).toBe('ascending')
    })

    it('returns "descending" for the active descending column', () => {
      const current: SortState = { key: 'title', order: 'desc' }
      expect(ariaSortFor(makeColumn('title'), current)).toBe('descending')
    })
  })

  describe('stateFor', () => {
    it('returns "none" when no sort is active', () => {
      expect(stateFor(makeColumn('title'), null)).toBe('none')
    })

    it('returns "none" for a non-active column', () => {
      const current: SortState = { key: 'title', order: 'asc' }
      expect(stateFor(makeColumn('status'), current)).toBe('none')
    })

    it('returns "asc" for the active ascending column', () => {
      const current: SortState = { key: 'title', order: 'asc' }
      expect(stateFor(makeColumn('title'), current)).toBe('asc')
    })

    it('returns "desc" for the active descending column', () => {
      const current: SortState = { key: 'title', order: 'desc' }
      expect(stateFor(makeColumn('title'), current)).toBe('desc')
    })
  })
})