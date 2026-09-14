import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpBreadcrumbs } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpBreadcrumbs',
  component: NtpBreadcrumbs,
} satisfies Meta<typeof NtpBreadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'Physics 101' },
      ]
      return { items }
    },
    template: '<NtpBreadcrumbs :items="items" />',
  }),
}

export const WithHomeIcon: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [
        { icon: '🏠', ariaLabel: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'Physics 101' },
      ]
      return { items }
    },
    template: '<NtpBreadcrumbs :items="items" />',
  }),
}

export const SingleItem: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [{ label: 'Dashboard' }]
      return { items }
    },
    template: '<NtpBreadcrumbs :items="items" />',
  }),
}

export const LongPath: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [
        { icon: '🏠', ariaLabel: 'Home', to: '/' },
        { label: 'Regulatory Framework', to: '/framework' },
        { label: 'Basic General', to: '/framework/basic' },
        { label: 'Mathematics', to: '/framework/basic/math' },
        { label: 'Algebra' },
      ]
      return { items }
    },
    template: '<NtpBreadcrumbs :items="items" />',
  }),
}

export const CustomSeparator: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'Physics 101' },
      ]
      return { items }
    },
    template: `
      <NtpBreadcrumbs :items="items">
        <template #separator>
          <span>/</span>
        </template>
      </NtpBreadcrumbs>
    `,
  }),
}

export const ContextNavigation: Story = {
  render: () => ({
    components: { NtpBreadcrumbs },
    setup() {
      const items = [
        { label: 'Basic General / Basic', to: '/discipline-structuring' },
        { label: 'Mathematics', to: '/curriculums/math' },
        { label: 'Algebra' },
      ]
      return { items }
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px;">Context indicator example from the ADR:</p>
        <NtpBreadcrumbs :items="items" />
      </div>
    `,
  }),
}