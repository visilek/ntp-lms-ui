import type { Meta, StoryObj } from '@storybook/vue3'
import NtpSpinner from '../../src/components/NtpSpinner/NtpSpinner.vue'
import { SPINNER_SIZES, SPINNER_COLORS } from '../../src/lib/types/spinner'

const meta: Meta<typeof NtpSpinner> = {
  title: 'Components/NtpSpinner',
  component: NtpSpinner,
  argTypes: {
    size: {
      control: 'select',
      options: [...SPINNER_SIZES],
    },
    color: {
      control: 'select',
      options: [...SPINNER_COLORS],
    },
  },
}

export default meta

type Story = StoryObj<typeof NtpSpinner>

export const Default: Story = {
  render: (args) => ({
    components: { NtpSpinner },
    setup: () => ({ args }),
    template: '<NtpSpinner v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpSpinner },
    template: `
      <H1>Sizes</H1>
      <div class="ntp-my-2" style="display: flex; gap: 24px; align-items: center;">
        <NtpSpinner size="small" />
        <NtpSpinner size="medium" />
        <NtpSpinner size="large" />
      </div>

      <H1>Colors — Medium</H1>
      <div class="ntp-my-2" style="display: flex; gap: 24px; align-items: center;">
        <NtpSpinner color="primary" />
        <NtpSpinner color="on-surface-variant" />
      </div>

      <H1>Surface Color — on Dark Background</H1>
      <div class="ntp-pa-4" style="display: flex; gap: 24px; align-items: center; background-color: hsl(193, 44%, 40%); border-radius: 12px;">
        <NtpSpinner color="surface" />
      </div>
    `,
  }),
}