import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpSpinner } from '@ntp-lms-ui/components'

describe('NtpSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(NtpSpinner)

    expect(wrapper.find('.ntp-spinner').exists()).toBe(true)
    expect(wrapper.classes()).toContain('ntp-spinner--medium')
    expect(wrapper.classes()).toContain('ntp-spinner--primary')
  })

  it('applies size class', () => {
    const wrapper = mount(NtpSpinner, {
      props: { size: 'small' },
    })

    expect(wrapper.classes()).toContain('ntp-spinner--small')
  })

  it('applies color class', () => {
    const wrapper = mount(NtpSpinner, {
      props: { color: 'surface' },
    })

    expect(wrapper.classes()).toContain('ntp-spinner--surface')
  })

  it('has progressbar role', () => {
    const wrapper = mount(NtpSpinner)

    expect(wrapper.attributes('role')).toBe('progressbar')
  })

  it('has aria-busy', () => {
    const wrapper = mount(NtpSpinner)

    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('renders svg', () => {
    const wrapper = mount(NtpSpinner)

    expect(wrapper.find('svg').exists()).toBe(true)
  })
})