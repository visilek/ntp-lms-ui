import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTableSort } from '../../src/components/NtpTable/composables/useTableSort'
import type { SortState, TableColumn } from '@ntp-lms-ui/lib/types'

function makeColumn(key: string, sortable = true): TableColumn {
  return { key, label: key, sortable }
}

describe('useTableSort', () => {
  describe('switchSort', () => {
    it('does nothing for non-sortable columns', () => {
      const sort = ref<SortState | null>(null)
      const setSort = vi.fn()
      const { switchSort } = useTableSort({ sort, setSort })

      switchSort(makeColumn('title', false))

      expect(setSort).not.toHaveBeenCalled()
    })

    it('cycles null → asc on a new column', () => {
      const sort = ref<SortState | null>(null)
      const setSort = vi.fn()
      const { switchSort } = useTableSort({ sort, setSort })

      switchSort(makeColumn('title'))

      expect(setSort).toHaveBeenCalledWith({ key: 'title', order: 'asc' })
    })

    it('cycles asc → desc on the same column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'asc' })
      const setSort = vi.fn()
      const { switchSort } = useTableSort({ sort, setSort })

      switchSort(makeColumn('title'))

      expect(setSort).toHaveBeenCalledWith({ key: 'title', order: 'desc' })
    })

    it('cycles desc → null on the same column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'desc' })
      const setSort = vi.fn()
      const { switchSort } = useTableSort({ sort, setSort })

      switchSort(makeColumn('title'))

      expect(setSort).toHaveBeenCalledWith(null)
    })

    it('resets to asc when clicking a different column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'desc' })
      const setSort = vi.fn()
      const { switchSort } = useTableSort({ sort, setSort })

      switchSort(makeColumn('status'))

      expect(setSort).toHaveBeenCalledWith({ key: 'status', order: 'asc' })
    })
  })

  describe('ariaSortFor', () => {
    it('returns undefined for the inactive column', () => {
      const sort = ref<SortState | null>(null)
      const setSort = vi.fn()
      const { ariaSortFor } = useTableSort({ sort, setSort })

      expect(ariaSortFor(makeColumn('title'))).toBeUndefined()
    })

    it('returns undefined for a column that is not the active sort', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'asc' })
      const setSort = vi.fn()
      const { ariaSortFor } = useTableSort({ sort, setSort })

      expect(ariaSortFor(makeColumn('status'))).toBeUndefined()
    })

    it('returns "ascending" for the active column in asc order', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'asc' })
      const setSort = vi.fn()
      const { ariaSortFor } = useTableSort({ sort, setSort })

      expect(ariaSortFor(makeColumn('title'))).toBe('ascending')
    })

    it('returns "descending" for the active column in desc order', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'desc' })
      const setSort = vi.fn()
      const { ariaSortFor } = useTableSort({ sort, setSort })

      expect(ariaSortFor(makeColumn('title'))).toBe('descending')
    })
  })

  describe('stateFor', () => {
    it('returns "none" when no sort is active', () => {
      const sort = ref<SortState | null>(null)
      const setSort = vi.fn()
      const { stateFor } = useTableSort({ sort, setSort })

      expect(stateFor(makeColumn('title'))).toBe('none')
    })

    it('returns "none" for a non-active column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'asc' })
      const setSort = vi.fn()
      const { stateFor } = useTableSort({ sort, setSort })

      expect(stateFor(makeColumn('status'))).toBe('none')
    })

    it('returns "asc" for the active ascending column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'asc' })
      const setSort = vi.fn()
      const { stateFor } = useTableSort({ sort, setSort })

      expect(stateFor(makeColumn('title'))).toBe('asc')
    })

    it('returns "desc" for the active descending column', () => {
      const sort = ref<SortState | null>({ key: 'title', order: 'desc' })
      const setSort = vi.fn()
      const { stateFor } = useTableSort({ sort, setSort })

      expect(stateFor(makeColumn('title'))).toBe('desc')
    })
  })
})