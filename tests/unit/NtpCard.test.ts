import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpCard, NtpCardHeader } from '@ntp-lms-ui/components'

describe('NtpCard', () => {
  it('renders default slot', () => {
    const wrapper = mount(NtpCard, {
      slots: { default: 'Card content' },
    })

    expect(wrapper.text()).toContain('Card content')
  })

  it('applies variant class', () => {
    const wrapper = mount(NtpCard, {
      props: { variant: 'outlined' },
    })

    expect(wrapper.classes()).toContain('ntp-card--outlined')
  })

  it('applies color class', () => {
    const wrapper = mount(NtpCard, {
      props: { color: 'primary' },
    })

    expect(wrapper.classes()).toContain('ntp-card--color-primary')
  })

  it('applies surface color class by default', () => {
    const wrapper = mount(NtpCard)

    expect(wrapper.classes()).toContain('ntp-card--color-surface')
  })

  it('applies clickable class', () => {
    const wrapper = mount(NtpCard, {
      props: { clickable: true },
    })

    expect(wrapper.classes()).toContain('ntp-card--clickable')
  })

  it('emits click when clickable', async () => {
    const wrapper = mount(NtpCard, {
      props: { clickable: true },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when not clickable', async () => {
    const wrapper = mount(NtpCard)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })
})

describe('NtpCardHeader', () => {
  it('renders title and subtitle', () => {
    const wrapper = mount(NtpCardHeader, {
      props: { title: 'Title', subtitle: 'Subtitle' },
    })

    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Subtitle')
  })

  it('applies overlay class', () => {
    const wrapper = mount(NtpCardHeader, {
      props: { overlay: 'scrim' },
    })

    expect(wrapper.classes()).toContain('ntp-card-header--overlay-scrim')
  })

  it('applies with-avatar class when avatar provided', () => {
    const wrapper = mount(NtpCardHeader, {
      props: { avatar: 'https://example.com/avatar.jpg' },
    })

    expect(wrapper.classes()).toContain('ntp-card-header--with-avatar')
  })

  it('renders action slot', () => {
    const wrapper = mount(NtpCardHeader, {
      slots: { default: '<button>Action</button>' },
    })

    expect(wrapper.find('.ntp-card-header__action').exists()).toBe(true)
  })
})