import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpRadioGroup } from '@ntp-lms-ui/components'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('NtpRadioGroup', () => {
  it('renders all options', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { options },
    })

    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.text()).toContain('Option B')
    expect(wrapper.text()).toContain('Option C')
  })

  it('renders group label', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { label: 'Choose', options },
    })

    expect(wrapper.text()).toContain('Choose')
  })

  it('checks selected option', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { modelValue: 'b', options },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.checked).toBe(false)
    expect(inputs[1].element.checked).toBe(true)
    expect(inputs[2].element.checked).toBe(false)
  })

  it('emits update:modelValue when option selected', async () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { modelValue: null, options },
    })

    await wrapper.findAll('input')[0].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('applies direction class', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { direction: 'horizontal', options },
    })

    expect(wrapper.classes()).toContain('ntp-radio-group--horizontal')
  })

  it('disables individual option', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    })

    expect(wrapper.findAll('input')[1].attributes('disabled')).toBeDefined()
  })

  it('shows errors', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { errors: ['Error message'], options },
    })

    expect(wrapper.text()).toContain('Error message')
  })

  it('shows hint when no errors', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { hint: 'Helper text', options },
    })

    expect(wrapper.text()).toContain('Helper text')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { required: true, options },
    })

    expect(wrapper.find('fieldset').attributes('aria-required')).toBe('true')
  })

  it('has radiogroup role', () => {
    const wrapper = mount(NtpRadioGroup, {
      props: { options },
    })

    expect(wrapper.find('fieldset').attributes('role')).toBe('radiogroup')
  })
})