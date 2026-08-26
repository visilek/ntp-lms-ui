import type { Meta, StoryObj } from '@storybook/vue3'
import NtpAppBar from '../../src/components/NtpAppBar/NtpAppBar.vue'
import NtpButton from '../../src/components/NtpButton/NtpButton.vue'

const meta = {
  title: 'Components/NtpAppBar',
  component: NtpAppBar,
  argTypes: {
    height: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof NtpAppBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
  },
  render: (args) => ({
    components: { NtpAppBar },
    setup: () => ({ args }),
    template: '<NtpAppBar v-bind="args" />',
  }),
}

export const AllHeights: Story = {
  render: () => ({
    components: { NtpAppBar },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <NtpAppBar title="Small" subtitle="64px height" height="small" />
        <NtpAppBar title="Medium" subtitle="112px height" height="medium" />
        <NtpAppBar title="Large" subtitle="152px height" height="large" />
      </div>
    `,
  }),
}

export const WithSlots: Story = {
  render: () => ({
    components: { NtpAppBar, NtpButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <NtpAppBar title="With leading and actions">
          <template #leading>
            <NtpButton icon-only aria-label="Menu">☰</NtpButton>
          </template>
          <template #actions>
            <NtpButton variant="text">Save</NtpButton>
          </template>
        </NtpAppBar>

        <NtpAppBar title="Medium with slots" height="medium">
          <template #leading>
            <NtpButton icon-only aria-label="Menu">☰</NtpButton>
          </template>
          <template #actions>
            <NtpButton variant="text">Done</NtpButton>
          </template>
        </NtpAppBar>
      </div>
    `,
  }),
}

export const CustomTitle: Story = {
  render: () => ({
    components: { NtpAppBar },
    template: `
      <NtpAppBar>
        <template #default>
          <strong>Custom title area</strong>
        </template>
      </NtpAppBar>
    `,
  }),
}