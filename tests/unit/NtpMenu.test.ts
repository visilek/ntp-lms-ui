import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpMenu } from '@ntp-lms-ui/components'

const items = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', danger: true },
]

let wrappers: ReturnType<typeof mount>[] = []

function mountMenu(props = {}) {
  const wrapper = mount(NtpMenu, {
    props: { items, open: true, ...props },
    attachTo: document.body,
  })
  wrappers.push(wrapper)
  return wrapper
}

function getMenuItems(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll('.ntp-menu__item'))
}

afterEach(() => {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.innerHTML = ''
})

describe('NtpMenu', () => {
  it('does not render when closed', () => {
    mount(NtpMenu, {
      props: { items, open: false },
    })

    expect(document.body.querySelector('.ntp-menu')).toBeNull()
  })

  it('renders items when open', () => {
    mountMenu()

    const text = document.body.querySelector('.ntp-menu')?.textContent
    expect(text).toContain('Option A')
    expect(text).toContain('Option B')
    expect(text).toContain('Option C')
  })

  it('emits select when item clicked', async () => {
    const wrapper = mountMenu()

    getMenuItems()[0].click()

    expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
  })

  it('does not emit select for disabled item', async () => {
    const wrapper = mountMenu({
      items: [{ value: 'a', label: 'A', disabled: true }],
    })

    getMenuItems()[0].click()

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('applies danger class', () => {
    mountMenu()

    const dangerItem = getMenuItems()[2]
    expect(dangerItem.classList).toContain('ntp-menu__item--danger')
  })

  it('renders leading content', () => {
    mountMenu({
      items: [{ value: 'a', label: 'A', leading: '✏️' }],
    })

    expect(document.body.querySelector('.ntp-menu__item-leading')).not.toBeNull()
  })

  it('emits close on outside click', async () => {
    const wrapper = mountMenu()

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close on Escape', async () => {
    const wrapper = mountMenu()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})