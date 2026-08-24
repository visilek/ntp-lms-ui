import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpTextInput } from '@ntp-lms-ui/components'

describe('NtpTextInput', () => {
  it('renders with label', () => {
    const wrapper = mount(NtpTextInput, {
      props: { label: 'Username' },
    })

    expect(wrapper.text()).toContain('Username')
  })

  it('applies variant class', () => {
    const wrapper = mount(NtpTextInput, {
      props: { variant: 'outlined' },
    })

    expect(wrapper.classes()).toContain('ntp-input--outlined')
  })

  it('applies context color class', () => {
    const wrapper = mount(NtpTextInput, {
      props: { contextColor: 'primary' },
    })

    expect(wrapper.classes()).toContain('ntp-input--context-primary')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(NtpTextInput)

    await wrapper.find('input').setValue('hello')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })

  it('shows hint text', () => {
    const wrapper = mount(NtpTextInput, {
      props: { hint: 'Helper text' },
    })

    expect(wrapper.text()).toContain('Helper text')
  })

  it('shows errors instead of hint when errors set', () => {
    const wrapper = mount(NtpTextInput, {
      props: { errors: ['Wrong value'], hint: 'Helper text' },
    })

    expect(wrapper.text()).toContain('Wrong value')
    expect(wrapper.text()).not.toContain('Helper text')
  })

  it('shows multiple errors', () => {
    const wrapper = mount(NtpTextInput, {
      props: { errors: ['First error', 'Second error'] },
    })

    expect(wrapper.text()).toContain('First error')
    expect(wrapper.text()).toContain('Second error')
  })

  it('applies error class', () => {
    const wrapper = mount(NtpTextInput, {
      props: { errors: ['Wrong value'] },
    })

    expect(wrapper.classes()).toContain('ntp-input--error')
  })

  it('applies disabled state', () => {
    const wrapper = mount(NtpTextInput, {
      props: { disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies readonly state', () => {
    const wrapper = mount(NtpTextInput, {
      props: { readonly: true },
    })

    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('floats label when value present', () => {
    const wrapper = mount(NtpTextInput, {
      props: { modelValue: 'test', label: 'Username' },
    })

    expect(wrapper.classes()).toContain('ntp-input--label-floating')
  })

  it('floats label on focus', async () => {
    const wrapper = mount(NtpTextInput, {
      props: { label: 'Username' },
    })

    await wrapper.find('input').trigger('focus')

    expect(wrapper.classes()).toContain('ntp-input--label-floating')
  })

  it('renders leading slot', () => {
    const wrapper = mount(NtpTextInput, {
      slots: { leading: '<span>🔍</span>' },
    })

    expect(wrapper.find('.ntp-input__leading').exists()).toBe(true)
  })

  it('renders trailing slot', () => {
    const wrapper = mount(NtpTextInput, {
      slots: { trailing: '<span>✕</span>' },
    })

    expect(wrapper.find('.ntp-input__trailing').exists()).toBe(true)
  })

  it('sets aria-invalid when errors present', () => {
    const wrapper = mount(NtpTextInput, {
      props: { errors: ['Wrong value'] },
    })

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(NtpTextInput, {
      props: { required: true },
    })

    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })
})