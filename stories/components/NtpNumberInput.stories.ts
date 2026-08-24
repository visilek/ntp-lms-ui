import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import NtpNumberInput from '../../src/components/NtpInputs/NtpNumberInput.vue'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '../../src/lib/types/input'

const meta: Meta<typeof NtpNumberInput> = {
  title: 'Components/NtpNumberInput',
  component: NtpNumberInput,
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
}

export default meta

type Story = StoryObj<typeof NtpNumberInput>

export const Default: Story = {
  args: {
    label: 'Number',
  },
  render: (args) => ({
    components: { NtpNumberInput },
    setup: () => ({ args }),
    template: '<NtpNumberInput v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpNumberInput },
    setup() {
      const plain = ref<number | null>(null)
      const withMinMax = ref<number | null>(5)
      const atMax = ref<number | null>(10)
      const atMin = ref<number | null>(0)
      const withError = ref<number | null>(null)
      const decimal = ref<number | null>(3.14)

      return { plain, withMinMax, atMax, atMin, withError, decimal }
    },
    template: `
      <H1>Surface Context</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <NtpNumberInput v-model="plain" label="Integer (step=1)" :step="1" />
        <NtpNumberInput v-model="decimal" label="Decimal (step=0.01)" :step="0.01" />
        <NtpNumberInput v-model="withMinMax" label="With min/max" :min="1" :max="100" hint="Between 1 and 100" />
        <NtpNumberInput v-model="atMax" label="At max" :min="0" :max="10" />
        <NtpNumberInput v-model="atMin" label="At min" :min="0" :max="10" />
        <NtpNumberInput v-model="withError" label="With consumer error" :errors="['Must be a prime number']" />
        <NtpNumberInput label="Disabled" disabled />
        <NtpNumberInput label="Readonly" readonly :model-value="7" />
      </div>

      <H1>Primary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(193, 44%, 40%); border-radius: 12px;">
        <NtpNumberInput label="Filled" variant="filled" context-color="primary" />
        <NtpNumberInput label="Filled with value" variant="filled" context-color="primary" :model-value="10" />
        <NtpNumberInput label="Outlined" variant="outlined" context-color="primary" />
        <NtpNumberInput label="Outlined with value" variant="outlined" context-color="primary" :model-value="20" />
      </div>

      <H1>Secondary Context</H1>
      <div class="ntp-pa-4 ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; background-color: hsl(48, 11%, 40%); border-radius: 12px;">
        <NtpNumberInput label="Filled" variant="filled" context-color="secondary" />
        <NtpNumberInput label="Filled with value" variant="filled" context-color="secondary" :model-value="10" />
        <NtpNumberInput label="Outlined" variant="outlined" context-color="secondary" />
        <NtpNumberInput label="Outlined with value" variant="outlined" context-color="secondary" :model-value="20" />
      </div>
    `,
  }),
}