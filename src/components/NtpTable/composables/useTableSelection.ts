import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  MasterCheckboxState,
  TableMode,
  TableRow,
  TableRowKey,
} from '@ntp-lms-ui/lib/types'

interface UseTableSelectionOptions {
  rows: Ref<TableRow[]>
  rowKey: string
  selectedKeys: Ref<TableRowKey[]>
  mode: Ref<TableMode>
  emit: {
    (event: 'update:selectedKeys', keys: TableRowKey[]): void
  }
}

interface UseTableSelectionReturn {
  headerCheckboxState: ComputedRef<MasterCheckboxState>
  showWarning: ComputedRef<boolean>
  isSelected: (key: TableRowKey) => boolean
  toggleRow: (key: TableRowKey) => void
  toggleAll: (checked: boolean) => void
}

export function useTableSelection(options: UseTableSelectionOptions): UseTableSelectionReturn {
  const visibleKeys = computed<TableRowKey[]>(() =>
    options.rows.value.map((row) => row[options.rowKey] as TableRowKey),
  )

  const headerCheckboxState = computed<MasterCheckboxState>(() => {
    const keys = visibleKeys.value
    if (keys.length === 0) return 'unchecked'

    const selectedCount = keys.filter((k) => options.selectedKeys.value.includes(k)).length
    if (selectedCount === 0) return 'unchecked'
    if (selectedCount === keys.length) return 'checked'
    return 'indeterminate'
  })

  const showWarning = computed(() => options.mode.value === 'partial')

  function isSelected(key: TableRowKey): boolean {
    return options.selectedKeys.value.includes(key)
  }

  function toggleRow(key: TableRowKey): void {
    const current = options.selectedKeys.value
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key]
    options.emit('update:selectedKeys', next)
  }

  function toggleAll(checked: boolean): void {
    const keys = visibleKeys.value
    if (checked) {
      const merged = new Set([...options.selectedKeys.value, ...keys])
      options.emit('update:selectedKeys', Array.from(merged))
    } else {
      const next = options.selectedKeys.value.filter((k) => !keys.includes(k))
      options.emit('update:selectedKeys', next)
    }
  }

  return {
    headerCheckboxState,
    showWarning,
    isSelected,
    toggleRow,
    toggleAll,
  }
}