import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { NtpBreadcrumbs } from '@ntp-lms-ui/components'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/courses', component: { template: '<div />' } },
  ],
})

let wrappers: ReturnType<typeof mount>[] = []

function mountBreadcrumbs(props = {}) {
  const wrapper = mount(NtpBreadcrumbs, {
    props,
    global: {
      plugins: [router],
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('NtpBreadcrumbs', () => {
  it('renders all items', () => {
    const wrapper = mountBreadcrumbs({
      items: [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'Physics 101' },
      ],
    })

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Courses')
    expect(wrapper.text()).toContain('Physics 101')
  })

  it('renders clickable items as RouterLink', () => {
    const wrapper = mountBreadcrumbs({
      items: [{ label: 'Home', to: '/' }],
    })

    expect(wrapper.find('.ntp-breadcrumbs__link').exists()).toBe(true)
  })

  it('renders non-clickable items as plain text', () => {
    const wrapper = mountBreadcrumbs({
      items: [{ label: 'Current' }],
    })

    expect(wrapper.find('.ntp-breadcrumbs__text').exists()).toBe(true)
    expect(wrapper.find('.ntp-breadcrumbs__link').exists()).toBe(false)
  })

  it('renders separator between items', () => {
    const wrapper = mountBreadcrumbs({
      items: [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
      ],
    })

    expect(wrapper.findAll('.ntp-breadcrumbs__separator')).toHaveLength(1)
  })

  it('does not render separator after last item', () => {
    const wrapper = mountBreadcrumbs({
      items: [{ label: 'Only item' }],
    })

    expect(wrapper.findAll('.ntp-breadcrumbs__separator')).toHaveLength(0)
  })

  it('renders icon-only items', () => {
    const wrapper = mountBreadcrumbs({
      items: [{ icon: '🏠', ariaLabel: 'Home', to: '/' }],
    })

    expect(wrapper.find('.ntp-breadcrumbs__icon').exists()).toBe(true)
    expect(wrapper.find('.ntp-breadcrumbs__link').attributes('aria-label')).toBe('Home')
  })

  it('renders custom separator via slot', () => {
    const wrapper = mount(NtpBreadcrumbs, {
      props: {
        items: [
          { label: 'A', to: '/' },
          { label: 'B' },
        ],
      },
      slots: {
        separator: '<span class="custom-sep">/</span>',
      },
      global: { plugins: [router] },
    })

    expect(wrapper.find('.custom-sep').exists()).toBe(true)
  })

  it('renders custom item via slot', () => {
    const wrapper = mount(NtpBreadcrumbs, {
      props: {
        items: [{ label: 'Home', to: '/' }],
      },
      slots: {
        item: '<span class="custom-item">Custom</span>',
      },
      global: { plugins: [router] },
    })

    expect(wrapper.find('.custom-item').exists()).toBe(true)
  })
})