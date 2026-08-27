import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NtpDialog } from '@ntp-lms-ui/components'

let wrappers: ReturnType<typeof mount>[] = []

async function mountDialog(props = {}) {
  const wrapper = mount(NtpDialog, {
    props: { open: true, ...props },
    attachTo: document.body,
    slots: { default: '<div>Dialog content</div>' },
  })
  wrappers.push(wrapper)
  await nextTick()
  return wrapper
}

afterEach(() => {
  wrappers.forEach((w) => w.unmount())
  wrappers = []
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('NtpDialog', () => {
  it('does not render when closed', () => {
    mount(NtpDialog, {
      props: { open: false },
    })

    expect(document.body.querySelector('.ntp-dialog')).toBeNull()
  })

  it('renders content when open', async () => {
    await mountDialog()

    expect(document.body.querySelector('.ntp-dialog')?.textContent).toContain('Dialog content')
  })

  it('emits update:open false on Escape', async () => {
    const wrapper = await mountDialog()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('does not close on Escape when persistent', async () => {
    const wrapper = await mountDialog({ persistent: true })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('emits update:open false on backdrop click', async () => {
    const wrapper = await mountDialog()

    const dialog = document.body.querySelector('.ntp-dialog') as HTMLElement
    dialog.click()

    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('does not close on backdrop when persistent', async () => {
    const wrapper = await mountDialog({ persistent: true })

    const dialog = document.body.querySelector('.ntp-dialog') as HTMLElement
    dialog.click()

    expect(wrapper.emitted('update:open')).toBeUndefined()
  })

  it('shows close button in standard mode', async () => {
    await mountDialog()

    expect(document.body.querySelector('.ntp-dialog__close')).not.toBeNull()
  })

  it('hides close button when showClose false', async () => {
    await mountDialog({ showClose: false })

    expect(document.body.querySelector('.ntp-dialog__close')).toBeNull()
  })

  it('locks body scroll when open', async () => {
    await mountDialog()

    expect(document.body.style.overflow).toBe('hidden')
  })
})