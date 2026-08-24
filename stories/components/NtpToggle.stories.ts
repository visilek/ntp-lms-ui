import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import NtpToggle from '../../src/components/NtpInputs/NtpToggle.vue'

const meta: Meta<typeof NtpToggle> = {
  title: 'Components/NtpToggle',
  component: NtpToggle,
}

export default meta

type Story = StoryObj<typeof NtpToggle>

export const Default: Story = {
  args: {
    label: 'Toggle',
  },
  render: (args) => ({
    components: { NtpToggle },
    setup: () => ({ args }),
    template: '<NtpToggle v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpToggle },
    setup() {
      const on = ref(true)
      const off = ref(false)
      const disabledOn = ref(true)
      const disabledOff = ref(false)
      const readonlyOn = ref(true)

      return { on, off, disabledOn, disabledOff, readonlyOn }
    },
    template: `
      <H1>States</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpToggle v-model="on" label="On" />
        <NtpToggle v-model="off" label="Off" />
        <NtpToggle v-model="disabledOn" label="Disabled on" disabled />
        <NtpToggle v-model="disabledOff" label="Disabled off" disabled />
        <NtpToggle v-model="readonlyOn" label="Readonly" readonly />
      </div>

      <H1>Label Position</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpToggle label="Label left (default)" />
        <NtpToggle label="Label right" label-position="right" />
      </div>

      <H1>Custom Label</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpToggle>
          <span>Enable <strong>notifications</strong></span>
        </NtpToggle>
      </div>
    `,
  }),
}