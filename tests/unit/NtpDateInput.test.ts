import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpDateInput from '@ntp-lms-ui/components/NtpInputs/NtpDateInput.vue'

describe('NtpDateInput', () => {
  it('renders with label', () => {
    const wrapper = mount(NtpDateInput, {
      props: { label: 'Due date' },
    })

    expect(wrapper.text()).toContain('Due date')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(NtpDateInput)

    await wrapper.find('input').setValue('2026-08-25')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-08-25'])
  })

  it('emits null when cleared', async () => {
    const wrapper = mount(NtpDateInput, {
      props: { modelValue: '2026-08-25' },
    })

    await wrapper.find('input').setValue('')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('applies variant class', () => {
    const wrapper = mount(NtpDateInput, {
      props: { variant: 'outlined' },
    })

    expect(wrapper.classes()).toContain('ntp-input--outlined')
  })

  it('shows errors', () => {
    const wrapper = mount(NtpDateInput, {
      props: { errors: ['Date required'] },
    })

    expect(wrapper.text()).toContain('Date required')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(NtpDateInput, {
      props: { required: true },
    })

    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })

  it('applies disabled state', () => {
    const wrapper = mount(NtpDateInput, {
      props: { disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})