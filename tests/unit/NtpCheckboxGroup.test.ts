import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpCheckboxGroup } from '@ntp-lms-ui/components'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('NtpCheckboxGroup', () => {
  it('renders all options', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { options },
    })

    expect(wrapper.text()).toContain('Option A')
    expect(wrapper.text()).toContain('Option B')
    expect(wrapper.text()).toContain('Option C')
  })

  it('renders group label', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { label: 'Choose', options },
    })

    expect(wrapper.text()).toContain('Choose')
  })

  it('checks options from modelValue', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { modelValue: ['a', 'c'], options },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.checked).toBe(true)
    expect(inputs[1].element.checked).toBe(false)
    expect(inputs[2].element.checked).toBe(true)
  })

  it('emits update:modelValue when option toggled on', async () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { modelValue: [], options },
    })

    await wrapper.findAll('input')[0].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
  })

  it('emits update:modelValue when option toggled off', async () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { modelValue: ['a'], options },
    })

    await wrapper.findAll('input')[0].setValue(false)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('applies direction class', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { direction: 'horizontal', options },
    })

    expect(wrapper.classes()).toContain('ntp-checkbox-group--horizontal')
  })

  it('disables individual option', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[1].attributes('disabled')).toBeDefined()
  })

  it('shows errors', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { errors: ['Error message'], options },
    })

    expect(wrapper.text()).toContain('Error message')
  })

  it('shows hint when no errors', () => {
    const wrapper = mount(NtpCheckboxGroup, {
      props: { hint: 'Helper text', options },
    })

    expect(wrapper.text()).toContain('Helper text')
  })
})