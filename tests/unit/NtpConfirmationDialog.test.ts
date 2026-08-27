import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { NtpConfirmationDialog } from '@ntp-lms-ui/components'

let wrappers: ReturnType<typeof mount>[] = []

async function mountDialog(props = {}) {
  const wrapper = mount(NtpConfirmationDialog, {
    props: { open: true, ...props },
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

describe('NtpConfirmationDialog', () => {
  it('renders title and message', async () => {
    await mountDialog({ title: 'Delete?', message: 'Are you sure?' })

    const text = document.body.textContent
    expect(text).toContain('Delete?')
    expect(text).toContain('Are you sure?')
  })

  it('emits confirm when confirm clicked', async () => {
    const wrapper = await mountDialog()

    const buttons = document.body.querySelectorAll('button')
    const confirmButton = Array.from(buttons).find((b) => b.textContent?.includes('Confirm'))
    confirmButton?.click()

    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('emits cancel and closes when cancel clicked', async () => {
    const wrapper = await mountDialog()

    const buttons = document.body.querySelectorAll('button')
    const cancelButton = Array.from(buttons).find((b) => b.textContent?.includes('Cancel'))
    cancelButton?.click()
    await nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })

  it('disables confirm when confirmation phrase not matched', async () => {
    await mountDialog({
      confirmationPhrase: 'delete',
      confirmLabel: 'Delete',
    })

    const buttons = document.body.querySelectorAll('button')
    const confirmButton = Array.from(buttons).find((b) => b.textContent?.includes('Delete'))

    expect((confirmButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('renders text input when confirmation phrase set', async () => {
    await mountDialog({ confirmationPhrase: 'delete' })

    expect(document.body.querySelector('input[type="text"]')).not.toBeNull()
  })

  it('does not emit confirm when loading', async () => {
    const wrapper = await mountDialog({ loading: true })

    const buttons = document.body.querySelectorAll('button')
    const confirmButton = Array.from(buttons).find((b) => b.textContent?.includes('Confirm'))
    confirmButton?.click()

    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})