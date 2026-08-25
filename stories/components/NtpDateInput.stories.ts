import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import NtpDateInput from '../../src/components/NtpInputs/NtpDateInput.vue'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '../../src/lib/types/input'

const meta = {
  title: 'Components/NtpDateInput',
  component: NtpDateInput,
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
} satisfies Meta<typeof NtpDateInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Date',
  },
  render: (args) => ({
    components: { NtpDateInput },
    setup: () => ({ args }),
    template: '<NtpDateInput v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpDateInput },
    setup() {
      const plain = ref<string | null>(null)
      const withValue = ref<string | null>('2026-08-25')
      const withMinMax = ref<string | null>(null)
      const withErrors = ref<string | null>(null)
      const withHint = ref<string | null>(null)

      return { plain, withValue, withMinMax, withErrors, withHint }
    },
    template: `
      <H1>Surface Context</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <NtpDateInput v-model="plain" label="Resting" />
        <NtpDateInput v-model="withValue" label="With value" />
        <NtpDateInput v-model="withMinMax" label="With min/max" min="2026-01-01" max="2026-09-31" />
        <NtpDateInput v-model="withHint" label="With hint" hint="Select a date" />
        <NtpDateInput v-model="withErrors" label="With errors" :errors="['Date is required']" />
        <NtpDateInput label="Disabled" disabled />
        <NtpDateInput label="Readonly" readonly model-value="2026-08-25" />
        <NtpDateInput label="Required" required />
      </div>

      <H1>Primary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(193, 44%, 40%); border-radius: 12px;">
        <NtpDateInput label="Filled" variant="filled" context-color="primary" />
        <NtpDateInput label="Outlined" variant="outlined" context-color="primary" />
      </div>

      <H1>Secondary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(48, 11%, 40%); border-radius: 12px;">
        <NtpDateInput label="Filled" variant="filled" context-color="secondary" />
        <NtpDateInput label="Outlined" variant="outlined" context-color="secondary" />
      </div>

      <H1>Slots</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <NtpDateInput label="With calendar icon">
          <template #leading>
            <span>📅</span>
          </template>
        </NtpDateInput>
      </div>
    `,
  }),
}