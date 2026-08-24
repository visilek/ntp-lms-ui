import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpCheckbox } from '@ntp-lms-ui/components'

const meta: Meta<typeof NtpCheckbox> = {
  title: 'Components/NtpCheckbox',
  component: NtpCheckbox,
}

export default meta

type Story = StoryObj<typeof NtpCheckbox>

export const Default: Story = {
  args: {
    label: 'Checkbox',
  },
  render: (args) => ({
    components: { NtpCheckbox },
    setup: () => ({ args }),
    template: '<NtpCheckbox v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpCheckbox },
    setup() {
      const checked = ref(true)
      const unchecked = ref(false)
      const disabledChecked = ref(true)
      const disabledUnchecked = ref(false)
      const readonlyChecked = ref(true)
      const indeterminate = ref(false)

      return {
        checked,
        unchecked,
        disabledChecked,
        disabledUnchecked,
        readonlyChecked,
        indeterminate,
      }
    },
    template: `
      <H1>States</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpCheckbox v-model="checked" label="Checked" />
        <NtpCheckbox v-model="unchecked" label="Unchecked" />
        <NtpCheckbox :model-value="true" indeterminate label="Indeterminate" />
        <NtpCheckbox v-model="disabledChecked" label="Disabled checked" disabled />
        <NtpCheckbox v-model="disabledUnchecked" label="Disabled unchecked" disabled />
        <NtpCheckbox v-model="readonlyChecked" label="Readonly" readonly />
      </div>

      <H1>Label Position</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpCheckbox label="Label right (default)" />
        <NtpCheckbox label="Label left" label-position="left" />
      </div>

      <H1>Custom Label</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <NtpCheckbox>
          I agree to the <a href="#" style="color: var(--ntp-color-primary);">terms and conditions</a>
        </NtpCheckbox>
      </div>
    `,
  }),
}