import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NtpSelect } from '@ntp-lms-ui/components'

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

async function mountSelect(props = {}) {
  const wrapper = mount(NtpSelect, {
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

describe('NtpSelect', () => {
  it('renders with label', async () => {
    const wrapper = await mountSelect()

    expect(wrapper.text()).toContain('Select')
  })

  it('opens menu on click', async () => {
    const wrapper = await mountSelect()

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ntp-menu')).not.toBeNull()
  })

  it('emits selected value when option clicked', async () => {
    const wrapper = await mountSelect()

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    const menuItems = document.body.querySelectorAll('.ntp-menu__item')
    ;(menuItems[0] as HTMLElement).click()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('shows label from preloaded options', async () => {
    const wrapper = await mountSelect({
      modelValue: 'b',
      preloadedOptions: [{ value: 'b', label: 'Option B' }],
    })

    expect(wrapper.find('input').element.value).toBe('Option B')
  })

  it('shows #value for unknown programmatic value', async () => {
    const wrapper = await mountSelect({ modelValue: 'unknown-id' })

    expect(wrapper.find('input').element.value).toBe('#unknown-id')
  })

  it('shows clear button when value selected', async () => {
    const wrapper = await mountSelect({
      modelValue: 'a',
      preloadedOptions: [{ value: 'a', label: 'Option A' }],
    })

    expect(wrapper.find('.ntp-select__clear').exists()).toBe(true)
  })

  it('emits null on clear', async () => {
    const wrapper = await mountSelect({
      modelValue: 'a',
      preloadedOptions: [{ value: 'a', label: 'Option A' }],
    })

    await wrapper.find('.ntp-select__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('does not show clear button when not clearable', async () => {
    const wrapper = await mountSelect({
      modelValue: 'a',
      preloadedOptions: [{ value: 'a', label: 'Option A' }],
      clearable: false,
    })

    expect(wrapper.find('.ntp-select__clear').exists()).toBe(false)
  })

  it('emits load-error on loader failure', async () => {
    const failingLoader = async () => {
      throw new Error('Network error')
    }

    const wrapper = await mountSelect({ loadOptions: failingLoader })

    await wrapper.find('.ntp-select').trigger('click')
    await nextTick()

    expect(wrapper.emitted('load-error')).toBeTruthy()
  })

  // Static options mode

it('renders with static options (no loader)', async () => {
  const wrapper = await mountSelect({
    loadOptions: undefined,
    preloadedOptions: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
    ],
  })

  expect(wrapper.text()).toContain('Select')
})

it('opens menu with static options', async () => {
  const wrapper = await mountSelect({
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

it('selects value from static options', async () => {
  const wrapper = await mountSelect({
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

  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
})

it('filters static options locally', async () => {
  const wrapper = await mountSelect({
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
  await input.setValue('al')
  await nextTick()

  const menuItems = document.body.querySelectorAll('.ntp-menu__item')
  expect(menuItems.length).toBe(1)
  expect((menuItems[0] as HTMLElement).textContent).toContain('Alpha')
})

it('does not show "Load more" in static mode', async () => {
  const wrapper = await mountSelect({
    loadOptions: undefined,
    preloadedOptions: Array.from({ length: 20 }, (_, i) => ({
      value: `item-${i}`,
      label: `Item ${i}`,
    })),
  })

  await wrapper.find('.ntp-select').trigger('click')
  await nextTick()

  expect(document.body.querySelector('.ntp-select__footer-content')).toBeNull()
})
})