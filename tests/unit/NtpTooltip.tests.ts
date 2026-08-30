import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NtpTooltip } from '@ntp-lms-ui/components'

describe('NtpTooltip', () => {
  it('renders trigger content', () => {
    const wrapper = mount(NtpTooltip, {
      props: { text: 'Help text' },
      slots: { default: '<button>Hover</button>' },
    })

    expect(wrapper.text()).toContain('Hover')
  })

  it('does not show tooltip by default', () => {
    const wrapper = mount(NtpTooltip, {
      props: { text: 'Help text' },
      slots: { default: '<button>Hover</button>' },
    })

    expect(wrapper.find('.ntp-tooltip__content').exists()).toBe(false)
  })

  it('shows tooltip on hover', async () => {
    const wrapper = mount(NtpTooltip, {
      props: { text: 'Help text' },
      slots: { default: '<button>Hover</button>' },
    })

    await wrapper.trigger('mouseenter')

    expect(wrapper.find('.ntp-tooltip__content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Help text')
  })

  it('hides tooltip on mouse leave', async () => {
    const wrapper = mount(NtpTooltip, {
      props: { text: 'Help text' },
      slots: { default: '<button>Hover</button>' },
    })

    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')

    expect(wrapper.find('.ntp-tooltip__content').exists()).toBe(false)
  })

  it('applies position class', () => {
    const wrapper = mount(NtpTooltip, {
      props: { text: 'Help', position: 'bottom' },
    })

    expect(wrapper.classes()).toContain('ntp-tooltip--bottom')
  })
})