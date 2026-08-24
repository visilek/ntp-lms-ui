import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpToggle from '@ntp-lms-ui/components/NtpInputs/NtpToggle.vue'

describe('NtpToggle', () => {
  it('renders with label', () => {
    const wrapper = mount(NtpToggle, {
      props: { label: 'Notifications' },
    })

    expect(wrapper.text()).toContain('Notifications')
  })

  it('emits update:modelValue when toggled', async () => {
    const wrapper = mount(NtpToggle)

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits change event', async () => {
    const wrapper = mount(NtpToggle)

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('has role switch', () => {
    const wrapper = mount(NtpToggle)

    expect(wrapper.find('input').attributes('role')).toBe('switch')
  })

  it('renders default slot content', () => {
    const wrapper = mount(NtpToggle, {
      slots: { default: 'Custom label' },
    })

    expect(wrapper.text()).toContain('Custom label')
  })

  it('applies disabled state', () => {
    const wrapper = mount(NtpToggle, {
      props: { disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('prevents change when readonly', async () => {
    const wrapper = mount(NtpToggle, {
      props: { readonly: true, modelValue: false },
    })

    await wrapper.find('input').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies label position class', () => {
    const wrapper = mount(NtpToggle, {
      props: { labelPosition: 'right' },
    })

    expect(wrapper.classes()).toContain('ntp-toggle--label-right')
  })
})