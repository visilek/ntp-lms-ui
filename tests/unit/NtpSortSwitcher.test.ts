import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpSortSwitcher from '../../src/components/NtpTable/NtpSortSwitcher.vue'

describe('NtpSortSwitcher', () => {
  it('defaults to state "none"', () => {
    const wrapper = mount(NtpSortSwitcher)

    expect(wrapper.classes()).toContain('ntp-sort-switcher--none')
  })

  it('applies the asc class', () => {
    const wrapper = mount(NtpSortSwitcher, { props: { state: 'asc' } })

    expect(wrapper.classes()).toContain('ntp-sort-switcher--asc')
  })

  it('applies the desc class', () => {
    const wrapper = mount(NtpSortSwitcher, { props: { state: 'desc' } })

    expect(wrapper.classes()).toContain('ntp-sort-switcher--desc')
  })

  it('renders two arrow SVGs', () => {
    const wrapper = mount(NtpSortSwitcher)

    expect(wrapper.findAll('svg')).toHaveLength(2)
  })

  it('renders the default slot inside the button', () => {
    const wrapper = mount(NtpSortSwitcher, {
      slots: { default: 'Title' },
    })

    expect(wrapper.text()).toContain('Title')
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(NtpSortSwitcher)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('is a button element', () => {
    const wrapper = mount(NtpSortSwitcher)

    expect(wrapper.element.tagName).toBe('BUTTON')
  })
})