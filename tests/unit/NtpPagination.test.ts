import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NtpPagination } from '@ntp-lms-ui/components'

let wrappers: ReturnType<typeof mount>[] = []

async function mountPagination(props = {}) {
  const wrapper = mount(NtpPagination, {
    props: { totalCount: 123, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  await nextTick()
  return wrapper
}

afterEach(() => {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.innerHTML = ''
})

describe('NtpPagination', () => {
  it('renders count text', async () => {
    const wrapper = await mountPagination({ page: 1, pageSize: 20, totalCount: 123 })

    expect(wrapper.text()).toContain('1–20 of 123')
  })

  it('renders count text for last page', async () => {
    const wrapper = await mountPagination({ page: 7, pageSize: 20, totalCount: 123 })

    expect(wrapper.text()).toContain('121–123 of 123')
  })

  it('hides count when empty', async () => {
    const wrapper = await mountPagination({ totalCount: 0 })

    expect(wrapper.find('.ntp-pagination__count').exists()).toBe(false)
  })

  it('hides page controls when single page', async () => {
    const wrapper = await mountPagination({ totalCount: 5, pageSize: 20 })

    expect(wrapper.findAll('.ntp-pagination__button')).toHaveLength(0)
  })

  it('renders all page numbers when few pages', async () => {
    const wrapper = await mountPagination({ totalCount: 60, pageSize: 20, page: 1 })

    const buttons = wrapper.findAll('.ntp-pagination__button')
    // 3 page buttons + prev + next
    expect(buttons.length).toBe(5)
  })

  it('renders ellipsis when many pages', async () => {
    const wrapper = await mountPagination({ totalCount: 1000, pageSize: 20, page: 25 })

    expect(wrapper.findAll('.ntp-pagination__ellipsis').length).toBeGreaterThan(0)
  })

  it('emits update:page when page button clicked', async () => {
    const wrapper = await mountPagination({ page: 1, pageSize: 20, totalCount: 123 })

    const buttons = wrapper.findAll('.ntp-pagination__button')
    await buttons[2].trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('emits update:page when next clicked', async () => {
    const wrapper = await mountPagination({ page: 1, pageSize: 20, totalCount: 123 })

    const buttons = wrapper.findAll('.ntp-pagination__button')
    const nextButton = buttons[buttons.length - 1]
    await nextButton.trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('disables previous on first page', async () => {
    const wrapper = await mountPagination({ page: 1, pageSize: 20, totalCount: 123 })

    const buttons = wrapper.findAll('.ntp-pagination__button')
    expect((buttons[0].element as HTMLButtonElement).disabled).toBe(true)
  })

  it('disables next on last page', async () => {
    const wrapper = await mountPagination({ page: 7, pageSize: 20, totalCount: 123 })

    const buttons = wrapper.findAll('.ntp-pagination__button')
    const nextButton = buttons[buttons.length - 1]
    expect((nextButton.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('marks current page as active', async () => {
    const wrapper = await mountPagination({ page: 2, pageSize: 20, totalCount: 123 })

    const activeButton = wrapper.find('.ntp-pagination__button--active')
    expect(activeButton.text()).toBe('2')
    expect(activeButton.attributes('aria-current')).toBe('page')
  })
})