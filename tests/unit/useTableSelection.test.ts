import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useTableSelection } from '../../src/components/NtpTable/composables/useTableSelection'

function setup(options?: {
  rows?: Array<Record<string, any>>
  selectedKeys?: Array<string | number>
  mode?: 'fixed' | 'complete' | 'partial'
}) {
  const rows = ref(options?.rows ?? [])
  const selectedKeys = ref(options?.selectedKeys ?? [])
  const mode = ref(options?.mode ?? 'complete')
  const emit = vi.fn()

  const selection = useTableSelection({
    rows,
    rowKey: 'id',
    selectedKeys,
    mode,
    emit,
  })

  return { rows, selectedKeys, mode, emit, selection }
}

describe('useTableSelection', () => {
  describe('headerCheckboxState', () => {
    it('returns "unchecked" when no rows', () => {
      const { selection } = setup()
      expect(selection.headerCheckboxState.value).toBe('unchecked')
    })

    it('returns "unchecked" when no rows are selected', () => {
      const { selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
      })
      expect(selection.headerCheckboxState.value).toBe('unchecked')
    })

    it('returns "checked" when all visible rows are selected', () => {
      const { selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
        selectedKeys: [1, 2],
      })
      expect(selection.headerCheckboxState.value).toBe('checked')
    })

    it('returns "indeterminate" when some visible rows are selected', () => {
      const { selection } = setup({
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
        selectedKeys: [1],
      })
      expect(selection.headerCheckboxState.value).toBe('indeterminate')
    })

    it('ignores selected keys that are not in the visible rows', () => {
      const { selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
        selectedKeys: [1, 2, 99],
      })
      expect(selection.headerCheckboxState.value).toBe('checked')
    })
  })

  describe('showWarning', () => {
    it('is false in fixed mode', () => {
      const { selection } = setup({ mode: 'fixed' })
      expect(selection.showWarning.value).toBe(false)
    })

    it('is false in complete mode', () => {
      const { selection } = setup({ mode: 'complete' })
      expect(selection.showWarning.value).toBe(false)
    })

    it('is true in partial mode', () => {
      const { selection } = setup({ mode: 'partial' })
      expect(selection.showWarning.value).toBe(true)
    })

    it('reacts to mode changes', () => {
      const { mode, selection } = setup({ mode: 'complete' })
      expect(selection.showWarning.value).toBe(false)

      mode.value = 'partial'
      expect(selection.showWarning.value).toBe(true)
    })
  })

  describe('isSelected', () => {
    it('returns true for a selected key', () => {
      const { selection } = setup({ selectedKeys: [1, 2] })
      expect(selection.isSelected(1)).toBe(true)
    })

    it('returns false for an unselected key', () => {
      const { selection } = setup({ selectedKeys: [1] })
      expect(selection.isSelected(2)).toBe(false)
    })
  })

  describe('toggleRow', () => {
    it('adds a key to selection when not present', () => {
      const { emit, selection } = setup({ selectedKeys: [] })

      selection.toggleRow(1)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [1])
    })

    it('removes a key from selection when present', () => {
      const { emit, selection } = setup({ selectedKeys: [1, 2] })

      selection.toggleRow(1)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [2])
    })

    it('does not mutate the input array', () => {
      const selectedKeys = [1, 2]
      const { selection } = setup({ selectedKeys })

      selection.toggleRow(1)

      expect(selectedKeys).toEqual([1, 2])
    })
  })

  describe('toggleAll', () => {
    it('adds all visible keys when checked is true', () => {
      const { emit, selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
        selectedKeys: [],
      })

      selection.toggleAll(true)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [1, 2])
    })

    it('merges with existing selection on check', () => {
      const { emit, selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
        selectedKeys: [99],
      })

      selection.toggleAll(true)

      const call = emit.mock.calls.find(([event]) => event === 'update:selectedKeys')
      expect(call).toBeDefined()
      const payload = call![1] as Array<string | number>
      expect(payload).toHaveLength(3)
      expect(payload).toEqual(expect.arrayContaining([1, 2, 99]))
    })

    it('removes visible keys when checked is false', () => {
      const { emit, selection } = setup({
        rows: [{ id: 1 }, { id: 2 }],
        selectedKeys: [1, 2, 99],
      })

      selection.toggleAll(false)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [99])
    })

    it('preserves keys outside the visible set on uncheck', () => {
      const { emit, selection } = setup({
        rows: [{ id: 1 }],
        selectedKeys: [1, 2, 3],
      })

      selection.toggleAll(false)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [2, 3])
    })

    it('does nothing to existing selection when no visible rows and checked is true', () => {
      const { emit, selection } = setup({
        rows: [],
        selectedKeys: [1],
      })

      selection.toggleAll(true)

      const call = emit.mock.calls.find(([event]) => event === 'update:selectedKeys')
      expect(call).toBeDefined()
      expect(call![1]).toEqual([1])
    })

    it('does nothing to existing selection when no visible rows and checked is false', () => {
      const { emit, selection } = setup({
        rows: [],
        selectedKeys: [1],
      })

      selection.toggleAll(false)

      expect(emit).toHaveBeenCalledWith('update:selectedKeys', [1])
    })
  })
})