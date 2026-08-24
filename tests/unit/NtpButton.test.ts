import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpButton } from '@ntp-lms-ui/components'

describe('NtpButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(NtpButton, {
      slots: { default: 'Save' },
    })

    expect(wrapper.text()).toBe('Save')
  })

  it('emits click when not disabled or loading', async () => {
    const wrapper = mount(NtpButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(NtpButton, {
      props: { disabled: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(NtpButton, {
      props: { loading: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('applies variant class', () => {
    const wrapper = mount(NtpButton, {
      props: { variant: 'outlined' },
    })

    expect(wrapper.classes()).toContain('ntp-button--outlined')
  })

  it('applies color class', () => {
    const wrapper = mount(NtpButton, {
      props: { color: 'error' },
    })

    expect(wrapper.classes()).toContain('ntp-button--error')
  })

  it('applies size class', () => {
    const wrapper = mount(NtpButton, {
      props: { size: 'large' },
    })

    expect(wrapper.classes()).toContain('ntp-button--large')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(NtpButton, {
      props: { loading: true },
    })

    expect(wrapper.find('.ntp-button__spinner').exists()).toBe(true)
  })

  it('has type="button"', () => {
    const wrapper = mount(NtpButton)

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('sets aria-label', () => {
    const wrapper = mount(NtpButton, {
      props: { ariaLabel: 'Close dialog' },
    })

    expect(wrapper.attributes('aria-label')).toBe('Close dialog')
  })

  it('sets aria-busy when loading', () => {
    const wrapper = mount(NtpButton, {
      props: { loading: true },
    })

    expect(wrapper.attributes('aria-busy')).toBe('true')
  })
})