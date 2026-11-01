import { describe, it, expect } from 'vitest'
import { useTableSelection } from '../../src/components/NtpTable/composables/useTableSelection'

describe('useTableSelection', () => {
  const {
    selectAll,
    deselectAll,
    toggleRow,
    isSelected,
    headerStateFor,
    showWarningFor,
  } = useTableSelection()

  // ───────────────────────────────────────────────────────────────────────────
  // selectAll
  // ───────────────────────────────────────────────────────────────────────────

  describe('selectAll', () => {
    it('returns visible keys when current selection is empty', () => {
      expect(selectAll([1, 2, 3], [])).toEqual([1, 2, 3])
    })

    it('merges visible keys into the current selection', () => {
      const result = selectAll([1, 2, 3], [99])
      expect(result).toHaveLength(4)
      expect(result).toEqual(expect.arrayContaining([1, 2, 3, 99]))
    })

    it('does not duplicate already-selected visible keys', () => {
      const result = selectAll([1, 2, 3], [1, 2])
      expect(result).toHaveLength(3)
      expect(result).toEqual(expect.arrayContaining([1, 2, 3]))
    })

    it('does not mutate the input arrays', () => {
      const visibleKeys = [1, 2, 3]
      const currentSelectedKeys = [99]
      selectAll(visibleKeys, currentSelectedKeys)
      expect(visibleKeys).toEqual([1, 2, 3])
      expect(currentSelectedKeys).toEqual([99])
    })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // deselectAll
  // ───────────────────────────────────────────────────────────────────────────

  describe('deselectAll', () => {
    it('removes visible keys from the selection', () => {
      expect(deselectAll([1, 2, 3], [1, 2, 3])).toEqual([])
    })

    it('preserves keys not in the visible set', () => {
      expect(deselectAll([1, 2], [1, 2, 99])).toEqual([99])
    })

    it('returns the current selection unchanged when no visible keys are selected', () => {
      expect(deselectAll([1, 2], [99])).toEqual([99])
    })

    it('does not mutate the input arrays', () => {
      const visibleKeys = [1, 2]
      const currentSelectedKeys = [1, 2, 99]
      deselectAll(visibleKeys, currentSelectedKeys)
      expect(visibleKeys).toEqual([1, 2])
      expect(currentSelectedKeys).toEqual([1, 2, 99])
    })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // toggleRow
  // ───────────────────────────────────────────────────────────────────────────

  describe('toggleRow', () => {
    it('adds the key when not present', () => {
      expect(toggleRow(1, [])).toEqual([1])
    })

    it('removes the key when present', () => {
      expect(toggleRow(1, [1, 2])).toEqual([2])
    })

    it('does not mutate the input array', () => {
      const input = [1, 2]
      toggleRow(1, input)
      expect(input).toEqual([1, 2])
    })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // isSelected
  // ───────────────────────────────────────────────────────────────────────────

  describe('isSelected', () => {
    it('returns true when the key is selected', () => {
      expect(isSelected(1, [1, 2])).toBe(true)
    })

    it('returns false when the key is not selected', () => {
      expect(isSelected(3, [1, 2])).toBe(false)
    })

    it('returns false for an empty selection', () => {
      expect(isSelected(1, [])).toBe(false)
    })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // headerStateFor
  // ───────────────────────────────────────────────────────────────────────────

  describe('headerStateFor', () => {
    it('returns "unchecked" when no visible keys', () => {
      expect(headerStateFor([], [1, 2])).toBe('unchecked')
    })

    it('returns "unchecked" when none are selected', () => {
      expect(headerStateFor([1, 2], [])).toBe('unchecked')
    })

    it('returns "unchecked" when no visible keys are selected', () => {
      expect(headerStateFor([1, 2], [3, 4])).toBe('unchecked')
    })

    it('returns "checked" when all visible keys are selected', () => {
      expect(headerStateFor([1, 2, 3], [1, 2, 3])).toBe('checked')
    })

    it('returns "checked" even with extra off-page selections', () => {
      expect(headerStateFor([1, 2], [1, 2, 99])).toBe('checked')
    })

    it('returns "indeterminate" when some visible keys are selected', () => {
      expect(headerStateFor([1, 2, 3], [1])).toBe('indeterminate')
    })

    it('returns "indeterminate" when some but not all are selected plus off-page', () => {
      expect(headerStateFor([1, 2, 3], [1, 99])).toBe('indeterminate')
    })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // showWarningFor
  // ───────────────────────────────────────────────────────────────────────────

  describe('showWarningFor', () => {
    it('returns false for fixed mode', () => {
      expect(showWarningFor('fixed')).toBe(false)
    })

    it('returns false for complete mode', () => {
      expect(showWarningFor('complete')).toBe(false)
    })

    it('returns true for partial mode', () => {
      expect(showWarningFor('partial')).toBe(true)
    })
  })
})