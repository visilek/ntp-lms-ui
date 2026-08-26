import { nextTick } from 'vue'
import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpActionMenu from '@ntp-lms-ui/components/NtpActionMenu/NtpActionMenu.vue'

const items = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

let wrappers: ReturnType<typeof mount>[] = []

function mountMenu(props = {}) {
  const wrapper = mount(NtpActionMenu, {
    props: { items, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.innerHTML = ''
})

describe('NtpActionMenu', () => {
  it('renders trigger button', () => {
    const wrapper = mountMenu()

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('opens menu when trigger clicked', async () => {
    const wrapper = mountMenu()

    await wrapper.find('button').trigger('click')

    expect(document.body.querySelector('.ntp-menu')).not.toBeNull()
  })

  it('emits select when item clicked', async () => {
    const wrapper = mountMenu()

    await wrapper.find('button').trigger('click')

    const menuItems = document.body.querySelectorAll('.ntp-menu__item')
    ;(menuItems[0] as HTMLElement).click()

    expect(wrapper.emitted('select')?.[0]).toEqual([
      { value: 'a', item: items[0] },
    ])
  })

  it('closes menu after select', async () => {
    const wrapper = mountMenu()

    await wrapper.find('button').trigger('click')
    const menuItems = document.body.querySelectorAll('.ntp-menu__item')
    ;(menuItems[0] as HTMLElement).click()

    await nextTick()

    expect(document.body.querySelector('.ntp-menu')).toBeNull()
  })

  it('does not open when disabled', async () => {
    const wrapper = mountMenu({ disabled: true })

    await wrapper.find('button').trigger('click')

    expect(document.body.querySelector('.ntp-menu')).toBeNull()
  })

  it('applies aria-label', () => {
    const wrapper = mountMenu({ ariaLabel: 'Custom actions' })

    expect(wrapper.find('button').attributes('aria-label')).toBe('Custom actions')
  })
})