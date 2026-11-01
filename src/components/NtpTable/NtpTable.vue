<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'
import type { ColumnFilter, LoadRowsParams, PaginatedResult, SortState, TableColumn, TableRow, TableRowKey } from '@ntp-lms-ui/lib/types'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '@ntp-lms-ui/lib'
import { NtpCheckbox, NtpPagination, NtpTooltip } from '@ntp-lms-ui/components'
import { DEFAULT_EMPTY_TEXT, DEFAULT_FILTERS, DEFAULT_ROWS, DEFAULT_SELECTED_KEYS, SELECTION_COLUMN_WIDTH, SELECTION_COLUMN_WIDTH_WITH_WARNING } from './constants'
import NtpSortSwitcher from './NtpSortSwitcher.vue'
import { useTable } from './composables'

// 2. Props interface
interface Props {
  columns: TableColumn[]
  rowKey: string

  rows?: TableRow[]
  loadRows?: (params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>
  onSaveOrder?: (keys: TableRowKey[]) => Promise<void>

  selectable?: boolean
  selectedKeys?: TableRowKey[]

  sort?: SortState | null
  filters?: ColumnFilter[]

  page?: number
  pageSize?: number
  pageSizeOptions?: number[]

  emptyText?: string
  stickyHeader?: boolean
}

// 3. Props — static vs reactive
const props = defineProps<Props>()

const {
  columns,
  rowKey,
  loadRows,
  onSaveOrder,
  selectable = false,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  emptyText = DEFAULT_EMPTY_TEXT,
  stickyHeader = true,
} = props

const rowsRef = computed(() => props.rows ?? DEFAULT_ROWS)
const selectedKeysRef = computed(() => props.selectedKeys ?? DEFAULT_SELECTED_KEYS)
const pageRef = computed(() => props.page ?? DEFAULT_PAGE)
const pageSizeRef = computed(() => props.pageSize ?? DEFAULT_PAGE_SIZE)
const sortRef = computed(() => props.sort ?? null)
const filtersRef = computed(() => props.filters ?? DEFAULT_FILTERS)

// 4. Emits
const emit = defineEmits<{
  'update:rows': [rows: TableRow[]]
  'update:selectedKeys': [keys: TableRowKey[]]
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  'update:sort': [sort: SortState | null]
  'update:filters': [filters: ColumnFilter[]]
  'load-error': [error: Error]
}>()

// 5. Table state — all state and operations owned by useTable
const table = useTable({
  loadRows,
  columns,
  rowKey,
  initialRows: rowsRef.value,
  initialPage: pageRef.value,
  initialPageSize: pageSizeRef.value,
  initialSort: sortRef.value,
  initialFilters: filtersRef.value,
  initialSelectedKeys: selectedKeysRef.value,
  rowsProp: rowsRef,
  pageProp: pageRef,
  pageSizeProp: pageSizeRef,
  sortProp: sortRef,
  filtersProp: filtersRef,
  selectedKeysProp: selectedKeysRef,
  emit,
})

// 6. Destructure — only what the template and defineExpose use
const {
  // State
  page,
  pageSize,
  totalCount,

  // Derived
  displayedRows,

  // Setters
  setPage,
  setPageSize,

  // Operations
  switchSort,
  toggleRow,
  handleHeaderCheckbox,

  // State-bound template helpers
  stateForColumn,
  ariaSortForColumn,
  isRowSelected,
  headerState,
  showSelectionWarning,
} = table

// 7. Layout functions and computeds (component-specific)
const selectionColumnWidth = computed(() =>
  showSelectionWarning.value
    ? SELECTION_COLUMN_WIDTH_WITH_WARNING
    : SELECTION_COLUMN_WIDTH,
)

const showPagination = computed(() => loadRows !== undefined)

function cellDisplayValue(row: TableRow, column: TableColumn): unknown {
  const cell = row[column.key]
  if (column.displayMapper) {
    return column.displayMapper(cell, row)
  }
  return cell
}

// 8. Exposed methods
defineExpose({
  refetch: table.refetch,
})
</script>

<template>
  <div class="ntp-table">
    <table class="ntp-table__table" role="table">
      <thead class="ntp-table__head" :class="{ 'ntp-table__head--sticky': stickyHeader }">
        <tr class="ntp-table__row ntp-table__row--header">
          <th v-if="selectable" class="ntp-table__header-cell ntp-table__header-cell--selection"
            :style="{ width: selectionColumnWidth }" scope="col">
            <NtpCheckbox :model-value="headerState === 'checked'" :indeterminate="headerState === 'indeterminate'"
              :disabled="displayedRows.length === 0" aria-label="Select all rows on this page"
              @update:model-value="handleHeaderCheckbox" />
            <NtpTooltip v-if="showSelectionWarning" text='"Select all" affects visible rows only'>
              <span class="ntp-table__selection-warning" aria-label='"Select all" affects visible rows only'>
                ⚠
              </span>
            </NtpTooltip>
          </th>

          <th v-for="column in columns" :key="column.key" class="ntp-table__header-cell"
            :class="column.align ? `ntp-table__header-cell--${column.align}` : undefined"
            :style="column.width ? { width: column.width } : undefined"
            :aria-sort="column.sortable ? ariaSortForColumn(column) : undefined" scope="col">
            <NtpSortSwitcher v-if="column.sortable" :state="stateForColumn(column)" @click="switchSort(column)">
              <slot name="header" :column="column">
                {{ column.label }}
              </slot>
            </NtpSortSwitcher>
            <slot v-else name="header" :column="column">
              {{ column.label }}
            </slot>
          </th>
        </tr>
      </thead>

      <tbody class="ntp-table__body">
        <tr v-if="displayedRows.length === 0" class="ntp-table__row ntp-table__row--empty">
          <td class="ntp-table__cell ntp-table__cell--empty"
            :colspan="selectable ? columns.length + 1 : columns.length">
            <slot name="empty">
              {{ emptyText }}
            </slot>
          </td>
        </tr>

        <tr v-for="row in displayedRows" :key="row[rowKey]" class="ntp-table__row ntp-table__row--data">
          <td v-if="selectable" class="ntp-table__cell ntp-table__cell--selection">
            <NtpCheckbox :model-value="isRowSelected(row[rowKey])" :aria-label="`Select row ${row[rowKey]}`"
              @update:model-value="() => toggleRow(row[rowKey])" />
          </td>

          <td v-for="column in columns" :key="column.key" class="ntp-table__cell"
            :class="column.align ? `ntp-table__cell--${column.align}` : undefined">
            <slot name="cell" :column="column" :row="row" :value="row[column.key]">
              {{ cellDisplayValue(row, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showPagination" class="ntp-table__pagination">
      <NtpPagination :page="page" :page-size="pageSize" :total-count="totalCount" :page-size-options="pageSizeOptions"
        @update:page="setPage" @update:page-size="setPageSize" />
    </div>
  </div>
</template>

<style scoped src="./NtpTable.css"></style>