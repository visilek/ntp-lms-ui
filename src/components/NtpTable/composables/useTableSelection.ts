import type {
  MasterCheckboxState,
  TableMode,
  TableRowKey,
} from '@ntp-lms-ui/lib/types'

export function useTableSelection() {
  function selectAll(
    visibleKeys: TableRowKey[],
    currentSelectedKeys: TableRowKey[],
  ): TableRowKey[] {
    const merged = new Set([...currentSelectedKeys, ...visibleKeys])
    return Array.from(merged)
  }

  function deselectAll(
    visibleKeys: TableRowKey[],
    currentSelectedKeys: TableRowKey[],
  ): TableRowKey[] {
    return currentSelectedKeys.filter((k) => !visibleKeys.includes(k))
  }

  function toggleRow(
    key: TableRowKey,
    currentSelectedKeys: TableRowKey[],
  ): TableRowKey[] {
    return currentSelectedKeys.includes(key)
      ? currentSelectedKeys.filter((k) => k !== key)
      : [...currentSelectedKeys, key]
  }

  function isSelected(
    key: TableRowKey,
    currentSelectedKeys: TableRowKey[],
  ): boolean {
    return currentSelectedKeys.includes(key)
  }

  function headerStateFor(
    visibleKeys: TableRowKey[],
    currentSelectedKeys: TableRowKey[],
  ): MasterCheckboxState {
    if (visibleKeys.length === 0) return 'unchecked'
    const selectedCount = visibleKeys.filter((k) =>
      currentSelectedKeys.includes(k),
    ).length
    if (selectedCount === 0) return 'unchecked'
    if (selectedCount === visibleKeys.length) return 'checked'
    return 'indeterminate'
  }

  function showWarningFor(mode: TableMode): boolean {
    return mode === 'partial'
  }

  return {
    selectAll,
    deselectAll,
    toggleRow,
    isSelected,
    headerStateFor,
    showWarningFor,
  }
}