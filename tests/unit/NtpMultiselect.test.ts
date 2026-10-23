import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NtpMultiSelect } from '@ntp-lms-ui/components'

const options = [
  { id: 'a', title: 'Option A' },
  { id: 'b', title: 'Option B' },
  { id: 'c', title: 'Option C' },
]

function createLoader() {
  return async (query = '') => {
    const filtered = options.filter((o) =>
      o.title.toLowerCase().includes(query.toLowerCase()),
    )
    return { items: filtered, totalCount: filtered.length }
  }
}

let wrappers: ReturnType<typeof mount>[] = []

async function mountMultiSelect(props = {}) {
  const wrapper = mount(NtpMultiSelect, {
    props: { label: 'Select', loadOptions: createLoader(), ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  await nextTick()
  return wrapper
}

afterEach(() => {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.innerHTML = ''
})

describe('NtpMultiSelect', () => {
  it('renders with label', async () => {
    const wrapper = await mountMultiSelect()

    expect(wrapper.text()).toContain('Select')
  })

  it('shows label when one item selected', async () => {
    const wrapper = await mountMultiSelect({
      modelValue: ['a'],
      preloadedOptions: [{ value: 'a', label: 'Option A' }],
    })

    expect(wrapper.find('input').element.value).toBe('Option A')
  })

  it('shows label with count when multiple items selected', async () => {
    const wrapper = await mountMultiSelect({
      modelValue: ['a', 'b'],
      preloadedOptions: [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ],
    })

    expect(wrapper.find('input').element.value).toBe('Option B (+1)')
  })

  it('opens menu on click', async () => {
    const wrapper = await mountMultiSelect()

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ntp-menu')).not.toBeNull()
  })

  it('emits array with selected value when option clicked', async () => {
    const wrapper = await mountMultiSelect()

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    const menuItems = document.body.querySelectorAll('.ntp-menu__item')
      ; (menuItems[0] as HTMLElement).click()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
  })

  it('emits array without value when selected option clicked again', async () => {
    const wrapper = await mountMultiSelect({
      modelValue: ['a'],
      preloadedOptions: [{ value: 'a', label: 'Option A' }],
    })

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    const menuItems = document.body.querySelectorAll('.ntp-menu__item')
      ; (menuItems[0] as HTMLElement).click()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
  })

  it('shows master checkbox in preload mode with >5 options', async () => {
    const largeOptions = Array.from({ length: 6 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
    }))

    const largeLoader = async () => ({
      items: largeOptions,
      totalCount: largeOptions.length,
    })

    const wrapper = await mountMultiSelect({ loadOptions: largeLoader })

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ntp-checkbox')).not.toBeNull()
  })

  it('emits load-error on loader failure', async () => {
    const failingLoader = async () => {
      throw new Error('Network error')
    }

    const wrapper = await mountMultiSelect({ loadOptions: failingLoader })

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    expect(wrapper.emitted('load-error')).toBeTruthy()
  })

  // Static options mode

it('opens menu with static options', async () => {
  const wrapper = await mountMultiSelect({
    loadOptions: undefined,
    preloadedOptions: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ],
  })

  await wrapper.find('.ntp-select').trigger('click')
  await nextTick()

  expect(document.body.querySelector('.ntp-menu')).not.toBeNull()
  expect(document.body.textContent).toContain('Option A')
  expect(document.body.textContent).toContain('Option B')
})

it('selects values from static options', async () => {
  const wrapper = await mountMultiSelect({
    loadOptions: undefined,
    preloadedOptions: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ],
  })

  await wrapper.find('.ntp-select').trigger('click')
  await nextTick()

  const menuItems = document.body.querySelectorAll('.ntp-menu__item')
  ;(menuItems[0] as HTMLElement).click()

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])
})

it('filters static options locally', async () => {
  const wrapper = await mountMultiSelect({
    loadOptions: undefined,
    preloadedOptions: [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
      { value: 'c', label: 'Gamma' },
    ],
  })

  await wrapper.find('.ntp-select').trigger('click')
  await nextTick()

  const input = wrapper.find('input')
  await input.setValue('be')
  await nextTick()

  const menuItems = document.body.querySelectorAll('.ntp-menu__item')
  expect(menuItems.length).toBe(1)
  expect((menuItems[0] as HTMLElement).textContent).toContain('Beta')
})
})