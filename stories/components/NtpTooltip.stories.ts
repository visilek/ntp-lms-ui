import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpTooltip } from '@ntp-lms-ui/components'
import { NtpButton } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpTooltip',
  component: NtpTooltip,
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
} satisfies Meta<typeof NtpTooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Tooltip text',
  },
  render: (args) => ({
    components: { NtpTooltip },
    setup: () => ({ args }),
    template: `
      <NtpTooltip v-bind="args">
        <span>Hover me</span>
      </NtpTooltip>
    `,
  }),
}

export const Positions: Story = {
  render: () => ({
    components: { NtpTooltip, NtpButton },
    template: `
      <div class="ntp-flex ntp-gap-6" style="padding: 100px;">
        <NtpTooltip text="Top tooltip" position="top">
          <NtpButton variant="outlined">Top</NtpButton>
        </NtpTooltip>

        <NtpTooltip text="Bottom tooltip" position="bottom">
          <NtpButton variant="outlined">Bottom</NtpButton>
        </NtpTooltip>

        <NtpTooltip text="Left tooltip" position="left">
          <NtpButton variant="outlined">Left</NtpButton>
        </NtpTooltip>

        <NtpTooltip text="Right tooltip" position="right">
          <NtpButton variant="outlined">Right</NtpButton>
        </NtpTooltip>
      </div>
    `,
  }),
}