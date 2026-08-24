import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpCheckbox from '@ntp-lms-ui/components/NtpInputs/NtpCheckbox.vue'

describe('NtpCheckbox', () => {
  it('renders with label', () => {
    const wrapper = mount(NtpCheckbox, {
      props: { label: 'Accept terms' },
    })

    expect(wrapper.text()).toContain('Accept terms')
  })

  it('emits update:modelValue when checked', async () => {
    const wrapper = mount(NtpCheckbox)

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emits change event', async () => {
    const wrapper = mount(NtpCheckbox)

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('renders default slot content', () => {
    const wrapper = mount(NtpCheckbox, {
      slots: { default: 'Custom label' },
    })

    expect(wrapper.text()).toContain('Custom label')
  })

  it('applies disabled state', () => {
    const wrapper = mount(NtpCheckbox, {
      props: { disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('prevents change when readonly', async () => {
    const wrapper = mount(NtpCheckbox, {
      props: { readonly: true, modelValue: false },
    })

    await wrapper.find('input').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('applies label position class', () => {
    const wrapper = mount(NtpCheckbox, {
      props: { labelPosition: 'left' },
    })

    expect(wrapper.classes()).toContain('ntp-checkbox--label-left')
  })
})