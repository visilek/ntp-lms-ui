import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpDateTimeInput } from '@ntp-lms-ui/components'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '@ntp-lms-ui/lib'

const meta = {
  title: 'Components/NtpDateTimeInput',
  component: NtpDateTimeInput,
  argTypes: {
    variant: {
      control: 'select',
      options: [...INPUT_VARIANTS],
    },
    contextColor: {
      control: 'select',
      options: [...INPUT_CONTEXT_COLORS],
    },
  },
} satisfies Meta<typeof NtpDateTimeInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date and time',
  },
  render: (args) => ({
    components: { NtpDateTimeInput },
    setup: () => ({ args }),
    template: '<NtpDateTimeInput v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpDateTimeInput },
    setup() {
      const plain = ref<string | null>(null)
      const withValue = ref<string | null>('2026-08-25T14:30')
      const withMinMax = ref<string | null>(null)
      const withStep = ref<string | null>(null)
      const withErrors = ref<string | null>(null)
      const withHint = ref<string | null>(null)

      return { plain, withValue, withMinMax, withStep, withErrors, withHint }
    },
    template: `
      <H1>Surface Context</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <NtpDateTimeInput v-model="plain" label="Resting" />
        <NtpDateTimeInput v-model="withValue" label="With value" />
        <NtpDateTimeInput v-model="withMinMax" label="With min/max" min="2026-01-01T00:00" max="2026-12-31T23:59" />
        <NtpDateTimeInput v-model="withStep" label="15-minute step" :step="900" />
        <NtpDateTimeInput v-model="withHint" label="With hint" hint="Select date and time" />
        <NtpDateTimeInput v-model="withErrors" label="With errors" :errors="['Date and time are required']" />
        <NtpDateTimeInput label="Disabled" disabled />
        <NtpDateTimeInput label="Readonly" readonly model-value="2026-08-25T14:30" />
        <NtpDateTimeInput label="Required" required />
      </div>

      <H1>Primary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(193, 44%, 40%); border-radius: 12px;">
        <NtpDateTimeInput label="Filled" variant="filled" context-color="primary" />
        <NtpDateTimeInput label="Outlined" variant="outlined" context-color="primary" />
      </div>

      <H1>Secondary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(48, 11%, 40%); border-radius: 12px;">
        <NtpDateTimeInput label="Filled" variant="filled" context-color="secondary" />
        <NtpDateTimeInput label="Outlined" variant="outlined" context-color="secondary" />
      </div>
    `,
  }),
}