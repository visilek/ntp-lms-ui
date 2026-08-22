import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpChip from '@ntp-lms-ui/components/NtpChip/NtpChip.vue'

describe('NtpChip', () => {
  it('renders label prop', () => {
    const wrapper = mount(NtpChip, {
      props: { label: 'Physics' },
    })

    expect(wrapper.text()).toContain('Physics')
  })

  it('renders default slot content', () => {
    const wrapper = mount(NtpChip, {
      slots: { default: 'Custom content' },
    })

    expect(wrapper.text()).toContain('Custom content')
  })

  it('applies variant class', () => {
    const wrapper = mount(NtpChip, {
      props: { variant: 'outlined' },
    })

    expect(wrapper.classes()).toContain('ntp-chip--outlined')
  })

  it('applies color class', () => {
    const wrapper = mount(NtpChip, {
      props: { color: 'error' },
    })

    expect(wrapper.classes()).toContain('ntp-chip--error')
  })

  it('applies size class', () => {
    const wrapper = mount(NtpChip, {
      props: { size: 'small' },
    })

    expect(wrapper.classes()).toContain('ntp-chip--small')
  })

  it('emits click only when clickable', async () => {
    const wrapper = mount(NtpChip, {
      props: { clickable: true, label: 'Click me' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = mount(NtpChip, {
      props: { label: 'Static' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(NtpChip, {
      props: { clickable: true, disabled: true },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('renders dismiss button when dismissible', () => {
    const wrapper = mount(NtpChip, {
      props: { dismissible: true, label: 'Tag' },
    })

    expect(wrapper.find('.ntp-chip__dismiss').exists()).toBe(true)
  })

  it('emits dismiss when dismiss button clicked', async () => {
    const wrapper = mount(NtpChip, {
      props: { dismissible: true, label: 'Tag' },
    })

    await wrapper.find('.ntp-chip__dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('does not emit dismiss when disabled', async () => {
    const wrapper = mount(NtpChip, {
      props: { dismissible: true, disabled: true },
    })

    await wrapper.find('.ntp-chip__dismiss').trigger('click')
    expect(wrapper.emitted('dismiss')).toBeUndefined()
  })

  it('sets dismiss aria-label', () => {
    const wrapper = mount(NtpChip, {
      props: { dismissible: true, label: 'Physics' },
    })

    expect(wrapper.find('.ntp-chip__dismiss').attributes('aria-label')).toBe('Remove Physics')
  })

  it('renders as button when clickable', () => {
    const wrapper = mount(NtpChip, {
      props: { clickable: true },
    })

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders as span when not clickable', () => {
    const wrapper = mount(NtpChip)

    expect(wrapper.find('span.ntp-chip').exists()).toBe(true)
  })
})