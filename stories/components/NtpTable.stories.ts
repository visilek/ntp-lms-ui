import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { NtpTable } from '@ntp-lms-ui/components'
import type {
  TableColumn,
  TableRow,
  LoadRowsParams,
  PaginatedResult,
} from '@ntp-lms-ui/lib/types'

const meta = {
  title: 'Components/NtpTable',
  component: NtpTable,
} satisfies Meta<typeof NtpTable>

export default meta

type Story = StoryObj<typeof meta>

const columns: TableColumn[] = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created', type: 'date' },
]

const rows: TableRow[] = [
  { id: 1, title: 'Mechanics', status: 'ACTIVE', createdAt: '2026-01-15' },
  { id: 2, title: 'Molecular Physics', status: 'ACTIVE', createdAt: '2026-01-18' },
  { id: 3, title: 'Thermodynamics', status: 'DRAFT', createdAt: '2026-01-22' },
  { id: 4, title: 'Electromagnetism', status: 'ACTIVE', createdAt: '2026-02-01' },
  { id: 5, title: 'Optics', status: 'DRAFT', createdAt: '2026-02-05' },
]

function makeRow(id: number): TableRow {
  return {
    id,
    title: `Row ${id}`,
    status: id % 3 === 0 ? 'DRAFT' : 'ACTIVE',
    createdAt: `2026-0${(id % 9) + 1}-15`,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mockLoadRows(params: LoadRowsParams): Promise<PaginatedResult<TableRow>> {
  const totalCount = 47
  const allItems: TableRow[] = []
  for (let i = 1; i <= totalCount; i++) {
    allItems.push(makeRow(i))
  }

  let sorted = allItems
  if (params.sort) {
    const { key, order } = params.sort
    const sortedArr = [...allItems].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av === bv) return 0
      return av < bv ? -1 : 1
    })
    sorted = order === 'desc' ? sortedArr.reverse() : sortedArr
  }

  const start = (params.page - 1) * params.pageSize
  const end = Math.min(start + params.pageSize, totalCount)
  const items = sorted.slice(start, end)

  await delay(800)

  return {
    items,
    totalCount,
    page: params.page,
    pageSize: params.pageSize,
  }
}

function mockLoadRowsSmall(params: LoadRowsParams): Promise<PaginatedResult<TableRow>> {
  const items = rows.slice(0, 5)
  return Promise.resolve({
    items,
    totalCount: items.length,
    page: params.page,
    pageSize: params.pageSize,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Fixed dataset (no loader)
// ─────────────────────────────────────────────────────────────────────────────

export const Fixed: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => ({ columns, rows }),
    template: `
      <div style="padding: 16px;">
        <NtpTable :columns="columns" :rows="rows" row-key="id" />
      </div>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Loader mode with pagination
// ─────────────────────────────────────────────────────────────────────────────

export const WithPagination: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const data = ref<TableRow[]>([])
      return { columns, data, mockLoadRows }
    },
    template: `
      <div style="padding: 16px;">
        <NtpTable
          :columns="columns"
          v-model:rows="data"
          :load-rows="mockLoadRows"
          row-key="id"
        />
      </div>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Selection (complete mode — no warning)
// ─────────────────────────────────────────────────────────────────────────────

export const WithSelection: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const data = ref<TableRow[]>([])
      const selected = ref<Array<string | number>>([])
      return { columns, data, selected, mockLoadRowsSmall }
    },
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          Selected: {{ selected.length }} ({{ selected.join(', ') || 'none' }})
        </div>
        <NtpTable
          :columns="columns"
          v-model:rows="data"
          v-model:selected-keys="selected"
          :load-rows="mockLoadRowsSmall"
          row-key="id"
          selectable
        />
      </div>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Selection (partial mode — warning shown)
// ─────────────────────────────────────────────────────────────────────────────

export const WithSelectionPartial: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const data = ref<TableRow[]>([])
      const selected = ref<Array<string | number>>([])
      return { columns, data, selected, mockLoadRows }
    },
    template: `
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          Selected: {{ selected.length }} ({{ selected.join(', ') || 'none' }})
        </div>
        <NtpTable
          :columns="columns"
          v-model:rows="data"
          v-model:selected-keys="selected"
          :load-rows="mockLoadRows"
          row-key="id"
          selectable
        />
      </div>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Sortable
// ─────────────────────────────────────────────────────────────────────────────

const sortableColumns: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
]

export const Sortable: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const data = ref<TableRow[]>([])
      return { columns: sortableColumns, data, mockLoadRowsSmall }
    },
    template: `
      <div style="padding: 16px;">
        <NtpTable
          :columns="columns"
          v-model:rows="data"
          :load-rows="mockLoadRowsSmall"
          row-key="id"
        />
      </div>
    `,
  }),
}

export const SortablePartial: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const data = ref<TableRow[]>([])
      return { columns: sortableColumns, data, mockLoadRows }
    },
    template: `
      <div style="padding: 16px;">
        <NtpTable
          :columns="columns"
          v-model:rows="data"
          :load-rows="mockLoadRows"
          row-key="id"
        />
      </div>
    `,
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Empty state
// ─────────────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => ({ columns }),
    template: `
      <div style="padding: 16px;">
        <NtpTable :columns="columns" :rows="[]" row-key="id" />
      </div>
    `,
  }),
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. Fixed dataset with complex columns
// ─────────────────────────────────────────────────────────────────────────────
export const ComplexColumns: Story = {
  render: () => ({
    components: { NtpTable },
    setup: () => {
      const columns: TableColumn[] = [
        { key: 'title', label: 'Title' },
        {
          key: 'status',
          label: 'Status',
          filterable: true,
          displayMapper: (cell) => cell.label,
          filterLocally: (cell, filter) => {
            if (filter.mode === 'icontains') {
              return String(cell.label).toLowerCase().includes(String(filter.value).toLowerCase())
            }
            if (filter.mode === 'exact') {
              return cell.value === filter.value
            }
            return false
          },
        }
      ]
      const rows: TableRow[] = [
        { id: 1, title: 'Mechanics', status: { value: 'ACTIVE', label: 'Active' } },
        { id: 2, title: 'Optics', status: { value: 'DRAFT', label: 'Draft' } },
        { id: 3, title: 'Thermodynamics', status: { value: 'ARCHIVED', label: 'Archived' } },
      ]
      return { columns, rows }
    },
    template: `
      <div style="padding: 16px;">
        <NtpTable :columns="columns" :rows="rows" row-key="id" />
      </div>
    `,
  }),
}