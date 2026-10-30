import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import NtpTable from '../../src/components/NtpTable/NtpTable.vue'
import type { TableColumn, TableRow, LoadRowsParams, PaginatedResult } from '@ntp-lms-ui/lib/types'
import { makeResult } from './helpers/table'

function makeColumns(): TableColumn[] {
  return [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
  ]
}

function makeRows(): TableRow[] {
  return [
    { id: 1, title: 'Alpha', status: 'ACTIVE' },
    { id: 2, title: 'Beta', status: 'DRAFT' },
  ]
}

describe('NtpTable', () => {
  describe('shell rendering (fixed mode)', () => {
    it('renders column headers', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
      })

      expect(wrapper.text()).toContain('Title')
      expect(wrapper.text()).toContain('Status')
    })

    it('renders row data', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
      })

      expect(wrapper.text()).toContain('Alpha')
      expect(wrapper.text()).toContain('Beta')
      expect(wrapper.text()).toContain('ACTIVE')
    })

    it('renders empty state when no rows', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: [] },
      })

      expect(wrapper.text()).toContain('No data')
    })

    it('applies sticky header class when stickyHeader is true', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows(), stickyHeader: true },
      })

      expect(wrapper.find('.ntp-table__head--sticky').exists()).toBe(true)
    })

    it('does not apply sticky header class when stickyHeader is false', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows(), stickyHeader: false },
      })

      expect(wrapper.find('.ntp-table__head--sticky').exists()).toBe(false)
    })
  })

  describe('slots', () => {
    it('renders custom header slot content', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
        slots: {
          header: '<template #header="{ column }"><strong>H:{{ column.label }}</strong></template>',
        },
      })

      expect(wrapper.text()).toContain('H:Title')
      expect(wrapper.text()).toContain('H:Status')
    })

    it('renders custom cell slot content', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
        slots: {
          cell: '<template #cell="{ column, value }"><span class="custom-cell">{{ column.key }}={{ value }}</span></template>',
        },
      })

      expect(wrapper.findAll('.custom-cell')).toHaveLength(4)
      expect(wrapper.text()).toContain('title=Alpha')
    })

    it('renders custom empty slot content', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: [] },
        slots: {
          empty: '<div class="custom-empty">Nothing here</div>',
        },
      })

      expect(wrapper.find('.custom-empty').exists()).toBe(true)
    })
  })

  describe('pagination visibility', () => {
    it('hides pagination in fixed mode', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
      })

      expect(wrapper.find('.ntp-table__pagination').exists()).toBe(false)
    })

    it('shows pagination in loader mode', async () => {
      const loadRows = vi.fn().mockResolvedValue(makeResult(makeRows(), 2))

      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', loadRows },
      })

      await flushPromises()

      expect(wrapper.find('.ntp-table__pagination').exists()).toBe(true)
    })
  })

  describe('selection rendering', () => {
    it('does not render checkboxes when selectable is false', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows() },
      })

      expect(wrapper.findAll('.ntp-table__cell--selection')).toHaveLength(0)
    })

    it('renders header and row checkboxes when selectable is true', () => {
      const wrapper = mount(NtpTable, {
        props: { columns: makeColumns(), rowKey: 'id', rows: makeRows(), selectable: true },
      })

      expect(wrapper.findAll('.ntp-table__cell--selection')).toHaveLength(2)
      expect(wrapper.find('.ntp-table__header-cell--selection').exists()).toBe(true)
    })
  })

  describe('v-model:page wiring', () => {
    it('refetches when page prop changes externally', async () => {
      const loadRows = vi.fn((params: LoadRowsParams) =>
        Promise.resolve(makeResult(makeRows(), 100, params.page, params.pageSize))
      )

      const wrapper = mount(NtpTable, {
        props: {
          columns: makeColumns(),
          rowKey: 'id',
          loadRows,
          page: 1,
        },
      })

      await flushPromises()

      const initialCallCount = loadRows.mock.calls.length

      await wrapper.setProps({ page: 2 })
      await nextTick()
      await flushPromises()

      expect(loadRows.mock.calls.length).toBeGreaterThan(initialCallCount)

      const lastCall = loadRows.mock.calls[loadRows.mock.calls.length - 1][0] as LoadRowsParams
      expect(lastCall.page).toBe(2)
    })
  })
})

describe('displayMapper', () => {
  it('uses displayMapper when present', () => {
    const columns: TableColumn[] = [
      {
        key: 'status',
        label: 'Status',
        displayMapper: (cell) => cell.label,
      },
    ]
    const rows: TableRow[] = [
      { id: 1, status: { value: 'ACTIVE', label: 'Active' } },
    ]

    const wrapper = mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
    })

    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).not.toContain('[object Object]')
  })

  it('passes cell and row to displayMapper', () => {
    const mapper = vi.fn((cell: any, row: TableRow) => `${cell.label} (${row.id})`)
    const columns: TableColumn[] = [
      { key: 'status', label: 'Status', displayMapper: mapper },
    ]
    const rows: TableRow[] = [
      { id: 1, status: { label: 'Active' } },
      { id: 2, status: { label: 'Draft' } },
    ]

    mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
    })

    expect(mapper).toHaveBeenCalledWith({ label: 'Active' }, rows[0])
    expect(mapper).toHaveBeenCalledWith({ label: 'Draft' }, rows[1])
  })

  it('renders a number returned by displayMapper', () => {
    const columns: TableColumn[] = [
      { key: 'value', label: 'Value', displayMapper: () => 42 },
    ]
    const rows: TableRow[] = [{ id: 1, value: 'anything' }]

    const wrapper = mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
    })

    expect(wrapper.text()).toContain('42')
  })

  it('renders nothing when displayMapper returns null', () => {
    const columns: TableColumn[] = [
      { key: 'value', label: 'Value', displayMapper: () => null },
    ]
    const rows: TableRow[] = [{ id: 1, value: 'anything' }]

    const wrapper = mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
    })

    const cells = wrapper.findAll('.ntp-table__cell')
    expect(cells[0].text()).toBe('')
  })

  it('renders the raw cell when displayMapper is absent', () => {
    const columns: TableColumn[] = [{ key: 'title', label: 'Title' }]
    const rows: TableRow[] = [{ id: 1, title: 'Mechanics' }]

    const wrapper = mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
    })

    expect(wrapper.text()).toContain('Mechanics')
  })

  it('passes the raw cell value to the #cell slot when provided', () => {
    const columns: TableColumn[] = [
      { key: 'status', label: 'Status', displayMapper: (cell) => cell.label },
    ]
    const rows: TableRow[] = [
      { id: 1, status: { value: 'ACTIVE', label: 'Active' } },
    ]

    const wrapper = mount(NtpTable, {
      props: { columns, rowKey: 'id', rows },
      slots: {
        cell: '<template #cell="{ value }"><span class="custom">{{ value.value }}</span></template>',
      },
    })

    expect(wrapper.find('.custom').text()).toBe('ACTIVE')
  })
})