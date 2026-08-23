import type { Meta, StoryObj } from '@storybook/vue3'
import NtpChip from '../../src/components/NtpChip/NtpChip.vue'

const meta: Meta<typeof NtpChip> = {
  title: 'Components/NtpChip',
  component: NtpChip,
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
}

export default meta

type Story = StoryObj<typeof NtpChip>

export const Default: Story = {
  args: {
    label: 'Chip',
  },
  render: (args) => ({
    components: { NtpChip },
    setup: () => ({ args }),
    template: '<NtpChip v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpChip },
    template: `
      <H1>Filled</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Primary" color="primary" />
        <NtpChip label="Secondary" color="secondary" />
        <NtpChip label="Tertiary" color="tertiary" />
        <NtpChip label="Error" color="error" />
        <NtpChip label="Neutral" color="neutral" />
        <NtpChip label="Disabled" disabled />
      </div>

      <H1>Outlined</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Primary" variant="outlined" color="primary" />
        <NtpChip label="Secondary" variant="outlined" color="secondary" />
        <NtpChip label="Tertiary" variant="outlined" color="tertiary" />
        <NtpChip label="Error" variant="outlined" color="error" />
        <NtpChip label="Neutral" variant="outlined" color="neutral" />
        <NtpChip label="Disabled" variant="outlined" disabled />
      </div>

      <H1>Sizes</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Small" size="small" color="primary" />
        <NtpChip label="Medium" size="medium" color="primary" />
      </div>

      <H1>Dismissible</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Removable" dismissible color="primary" />
        <NtpChip label="Removable" dismissible color="secondary" />
        <NtpChip label="Removable" dismissible color="tertiary" />
        <NtpChip label="Removable" dismissible color="error" />
        <NtpChip label="Removable" dismissible color="neutral" />
        <NtpChip label="Removable" dismissible variant="outlined" color="primary" />
        <NtpChip label="Removable" dismissible variant="outlined" color="secondary" />
        <NtpChip label="Removable" dismissible variant="outlined" color="tertiary" />
        <NtpChip label="Removable" dismissible variant="outlined" color="error" />
        <NtpChip label="Removable" dismissible variant="outlined" color="neutral" />
        <NtpChip label="Disabled" dismissible disabled />
      </div>

      <H1>Clickable</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Clickable" clickable color="primary" />
        <NtpChip label="Clickable" clickable color="secondary" />
        <NtpChip label="Clickable" clickable color="tertiary" />
        <NtpChip label="Clickable" clickable color="error" />
        <NtpChip label="Clickable" clickable color="neutral" />
        <NtpChip label="Clickable" clickable variant="outlined" color="primary" />
        <NtpChip label="Clickable" clickable variant="outlined" color="secondary" />
        <NtpChip label="Clickable" clickable variant="outlined" color="tertiary" />
        <NtpChip label="Clickable" clickable variant="outlined" color="error" />
        <NtpChip label="Clickable" clickable variant="outlined" color="neutral" />
        <NtpChip label="Disabled" clickable disabled />
      </div>

      <H1>With Leading Icon</H1>
      <div class="ntp-my-2" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <NtpChip label="Physics" color="primary">
          <template #leading>
            <span>🔬</span>
          </template>
        </NtpChip>
        <NtpChip label="Clickable" color="primary" clickable>
          <template #leading>
            <span>🔬</span>
          </template>
        </NtpChip>
        <NtpChip label="Draft" variant="outlined" color="tertiary">
          <template #leading>
            <span>✏️</span>
          </template>
        </NtpChip>
        <NtpChip label="Clickable" variant="outlined" color="tertiary" clickable>
          <template #leading>
            <span>✏️</span>
          </template>
        </NtpChip>
      </div>
    `,
  }),
}