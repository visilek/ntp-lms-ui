<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'
import type {
  ColumnFilter,
  LoadRowsParams,
  PaginatedResult,
  SortState,
  TableColumn,
  TableRow,
  TableRowKey,
} from '@ntp-lms-ui/lib/types'
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  useColumnFilter,
  useColumnSort,
} from '@ntp-lms-ui/lib'
import { NtpCheckbox, NtpPagination, NtpTooltip } from '@ntp-lms-ui/components'
import {
  DEFAULT_EMPTY_TEXT,
  DEFAULT_FILTERS,
  DEFAULT_ROWS,
  DEFAULT_SELECTED_KEYS,
  SELECTION_COLUMN_WIDTH,
  SELECTION_COLUMN_WIDTH_WITH_WARNING,
} from './constants'
import { useTableFetch, useTableMode, useTableSelection, useTableSort } from './composables'
import NtpSortSwitcher from './NtpSortSwitcher.vue'

// 2. Local type aliases
// (none yet)

// 3. Props interface
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

// 4. Props — static vs reactive
const props = defineProps<Props>()

// Destructured: effectively static after mount.
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

// Refs: may change via v-model or external writes.
// All are `computed` — read-only observers with defaults applied. Writes to
// v-model props flow through emits, not through these refs.
const rowsRef = computed(() => props.rows ?? DEFAULT_ROWS)
const selectedKeysRef = computed(() => props.selectedKeys ?? DEFAULT_SELECTED_KEYS)
const pageRef = computed(() => props.page ?? DEFAULT_PAGE)
const pageSizeRef = computed(() => props.pageSize ?? DEFAULT_PAGE_SIZE)
const sortRef = computed(() => props.sort ?? null)
const filtersRef = computed(() => props.filters ?? DEFAULT_FILTERS)

// 5. Emits
const emit = defineEmits<{
  'update:rows': [rows: TableRow[]]
  'update:selectedKeys': [keys: TableRowKey[]]
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  'update:sort': [sort: SortState | null]
  'update:filters': [filters: ColumnFilter[]]
  'rowClick': [payload: { row: TableRow, key: TableRowKey }]
  'load-error': [error: Error]
}>()

// 6. Fetch subsystem
const tableFetch = useTableFetch({
  loadRows,
  initialPage: pageRef.value,
  initialPageSize: pageSizeRef.value,
  initialSort: sortRef.value,
  initialFilters: filtersRef.value,
  emit,
  pageProp: pageRef,
  pageSizeProp: pageSizeRef,
  sortProp: sortRef,
  filtersProp: filtersRef,
})

// 7. Mode
const { mode } = useTableMode({
  hasLoader: computed(() => loadRows !== undefined),
  totalCount: tableFetch.totalCount,
  pageSize: tableFetch.pageSize,
})

// 8. Column transforms (library composables)
const columnFilter = useColumnFilter()
const columnSort = useColumnSort()

// 9. Display pipeline
const displayedRows = computed<TableRow[]>(() => {
  let result = rowsRef.value

  if (mode.value !== 'partial') {
    result = columnFilter.apply(result, tableFetch.filters.value, columns)
  }

  if (mode.value !== 'partial' && tableFetch.sort.value) {
    result = columnSort.apply(result, tableFetch.sort.value, columns)
  }

  // Concern 9: reorder stage will insert here.
  return result
})

function cellDisplayValue(row: TableRow, column: TableColumn): unknown {
  const cell = row[column.key]
  if (column.displayMapper) {
    return column.displayMapper(cell, row)
  }
  return cell
}

// 10. Selection
const tableSelection = useTableSelection({
  rows: displayedRows,
  rowKey,
  selectedKeys: selectedKeysRef,
  mode,
  emit,
})

const selectionColumnWidth = computed(() =>
  tableSelection.showWarning.value
    ? SELECTION_COLUMN_WIDTH_WITH_WARNING
    : SELECTION_COLUMN_WIDTH,
)

// 11. Sorting
const tableSort = useTableSort({
  sort: tableFetch.sort,
  setSort: tableFetch.setSort,
})

// 12. Pagination visibility
const showPagination = computed(() => loadRows !== undefined)

// 13. Exposed methods
defineExpose({
  refetch: tableFetch.refetch,
})
</script>

<template>
  <div class="ntp-table">
    <table class="ntp-table__table" role="table">
      <thead class="ntp-table__head" :class="{ 'ntp-table__head--sticky': stickyHeader }">
        <tr class="ntp-table__row ntp-table__row--header">
          <th v-if="selectable" class="ntp-table__header-cell ntp-table__header-cell--selection"
            :style="{ width: selectionColumnWidth }" scope="col">
            <NtpCheckbox :model-value="tableSelection.headerCheckboxState.value === 'checked'"
              :indeterminate="tableSelection.headerCheckboxState.value === 'indeterminate'"
              :disabled="displayedRows.length === 0" aria-label="Select all rows on this page"
              @update:model-value="tableSelection.toggleAll" />
            <NtpTooltip v-if="tableSelection.showWarning.value" text="&quot;Select all&quot; affects visible rows only">
              <span class="ntp-table__selection-warning" aria-label='"Select all" affects visible rows only'>
                ⚠
              </span>
            </NtpTooltip>
          </th>

          <th v-for="column in columns" :key="column.key" class="ntp-table__header-cell"
            :class="column.align ? `ntp-table__header-cell--${column.align}` : undefined"
            :style="column.width ? { width: column.width } : undefined" :aria-sort="tableSort.ariaSortFor(column)"
            scope="col">
            <NtpSortSwitcher v-if="column.sortable" :state="tableSort.stateFor(column)"
              @click="tableSort.switchSort(column)">
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
            <NtpCheckbox :model-value="tableSelection.isSelected(row[rowKey])" :aria-label="`Select row ${row[rowKey]}`"
              @update:model-value="() => tableSelection.toggleRow(row[rowKey])" />
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
      <NtpPagination :page="tableFetch.page.value" :page-size="tableFetch.pageSize.value"
        :total-count="tableFetch.totalCount.value" :page-size-options="pageSizeOptions"
        @update:page="tableFetch.setPage" @update:page-size="tableFetch.setPageSize" />
    </div>
  </div>
</template>

<style scoped src="./NtpTable.css"></style>