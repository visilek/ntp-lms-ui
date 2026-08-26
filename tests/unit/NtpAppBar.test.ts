import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtpAppBar from '@ntp-lms-ui/components/NtpAppBar/NtpAppBar.vue'

describe('NtpAppBar', () => {
  it('renders title', () => {
    const wrapper = mount(NtpAppBar, {
      props: { title: 'Settings' },
    })

    expect(wrapper.text()).toContain('Settings')
  })

  it('renders subtitle', () => {
    const wrapper = mount(NtpAppBar, {
      props: { title: 'Settings', subtitle: 'General' },
    })

    expect(wrapper.text()).toContain('General')
  })

  it('applies height class', () => {
    const wrapper = mount(NtpAppBar, {
      props: { height: 'large' },
    })

    expect(wrapper.classes()).toContain('ntp-app-bar--large')
  })

  it('renders leading slot', () => {
    const wrapper = mount(NtpAppBar, {
      slots: { leading: '<button>Menu</button>' },
    })

    expect(wrapper.find('.ntp-app-bar__leading').exists()).toBe(true)
  })

  it('renders actions slot', () => {
    const wrapper = mount(NtpAppBar, {
      slots: { actions: '<button>Save</button>' },
    })

    expect(wrapper.find('.ntp-app-bar__actions').exists()).toBe(true)
  })

  it('renders default slot overriding title', () => {
    const wrapper = mount(NtpAppBar, {
      props: { title: 'Should not show' },
      slots: { default: 'Custom content' },
    })

    expect(wrapper.text()).toContain('Custom content')
    expect(wrapper.text()).not.toContain('Should not show')
  })
})