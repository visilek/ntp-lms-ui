import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpNumberInput } from '@ntp-lms-ui/components'

describe('NtpNumberInput', () => {
  it('renders with label', () => {
    const wrapper = mount(NtpNumberInput, {
      props: { label: 'Amount' },
    })

    expect(wrapper.text()).toContain('Amount')
  })

  it('emits number on valid input', async () => {
    const wrapper = mount(NtpNumberInput)

    await wrapper.find('input').setValue('42')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42])
  })

  it('emits decimal for step 0.01', async () => {
    const wrapper = mount(NtpNumberInput, {
      props: { step: 0.01 },
    })

    await wrapper.find('input').setValue('3.14')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3.14])
  })

  it('emits null for empty input', async () => {
    const wrapper = mount(NtpNumberInput)

    await wrapper.find('input').setValue('')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  //   it('shows internal error for below min', async () => {
  //     const wrapper = mount(NtpNumberInput, {
  //       props: { min: 1, max: 10 },
  //     })

  //     await wrapper.find('input').setValue('0')
  //     await wrapper.find('input').trigger('blur')

  //     expect(wrapper.text()).toContain('Must be at least 1')
  //   })

  //   it('shows internal error for above max', async () => {
  //     const wrapper = mount(NtpNumberInput, {
  //       props: { min: 1, max: 10 },
  //     })

  //     await wrapper.find('input').setValue('11')
  //     await wrapper.find('input').trigger('blur')

  //     expect(wrapper.text()).toContain('Must be at most 10')
  //   })

  //   it('merges consumer errors with internal errors', async () => {
  //     const wrapper = mount(NtpNumberInput, {
  //       props: {
  //         min: 1,
  //         max: 10,
  //         errors: ['Must be a prime number'],
  //       },
  //     })

  //     await wrapper.find('input').setValue('0')
  //     await wrapper.find('input').trigger('blur')

  //     expect(wrapper.text()).toContain('Must be a prime number')
  //     expect(wrapper.text()).toContain('Must be at least 1')
  //   })

  it('increments value when + clicked', async () => {
    const wrapper = mount(NtpNumberInput, {
      props: { modelValue: 5, min: 0, max: 10 },
    })

    await wrapper.find('[aria-label="Increment"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('decrements value when - clicked', async () => {
    const wrapper = mount(NtpNumberInput, {
      props: { modelValue: 5, min: 0, max: 10 },
    })

    await wrapper.find('[aria-label="Decrement"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('does not increment at max', async () => {
    const wrapper = mount(NtpNumberInput, {
      props: { modelValue: 10, min: 0, max: 10 },
    })

    const incrementButton = wrapper.find('[aria-label="Increment"]')
    expect(incrementButton.attributes('disabled')).toBeDefined()
  })

  it('does not decrement at min', async () => {
    const wrapper = mount(NtpNumberInput, {
      props: { modelValue: 0, min: 0, max: 10 },
    })

    const decrementButton = wrapper.find('[aria-label="Decrement"]')
    expect(decrementButton.attributes('disabled')).toBeDefined()
  })

  it('floats label when value present', () => {
    const wrapper = mount(NtpNumberInput, {
      props: { modelValue: 5, label: 'Amount' },
    })

    expect(wrapper.classes()).toContain('ntp-input--label-floating')
  })

  it('sets aria-required when required', () => {
    const wrapper = mount(NtpNumberInput, {
      props: { required: true },
    })

    expect(wrapper.find('input').attributes('aria-required')).toBe('true')
  })

  it('applies disabled state', () => {
    const wrapper = mount(NtpNumberInput, {
      props: { disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies readonly state', () => {
    const wrapper = mount(NtpNumberInput, {
      props: { readonly: true },
    })

    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })
})