import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpRadioGroup } from '@ntp-lms-ui/components'
import {
  SELECTION_LABEL_POSITIONS,
  SELECTION_GROUP_DIRECTIONS,
} from '../../src/lib/types/input'

const meta = {
  title: 'Components/NtpRadioGroup',
  component: NtpRadioGroup,
  argTypes: {
    labelPosition: {
      control: 'select',
      options: [...SELECTION_LABEL_POSITIONS],
    },
    direction: {
      control: 'select',
      options: [...SELECTION_GROUP_DIRECTIONS],
    },
  },
} satisfies Meta<typeof NtpRadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Choose one',
    labelPosition: 'right',
    direction: 'vertical',
    options: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ],
  },
  render: (args) => ({
    components: { NtpRadioGroup },
    setup: () => ({ args }),
    template: '<NtpRadioGroup v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpRadioGroup },
    setup() {
      const vertical = ref<string | null>('b')
      const horizontal = ref<string | null>('a')
      const withErrors = ref<string | null>(null)
      const withDisabledOption = ref<string | null>(null)
      const readonlyGroup = ref<string | null>('a')
      const disabledGroup = ref<string | null>('a')
      const requiredGroup = ref<string | null>(null)

      return {
        vertical,
        horizontal,
        withErrors,
        withDisabledOption,
        readonlyGroup,
        disabledGroup,
        requiredGroup,
      }
    },
    template: `
      <H1>Vertical (default)</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="vertical"
          label="Difficulty"
          :options="[
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ]"
        />
      </div>

      <H1>Horizontal</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="horizontal"
          label="Mode"
          direction="horizontal"
          :options="[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]"
        />
      </div>

      <H1>With Errors</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="withErrors"
          label="Selection"
          :errors="['Choose an option']"
          :options="[
            { value: 'x', label: 'Option X' },
            { value: 'y', label: 'Option Y' },
          ]"
        />
      </div>

      <H1>With Disabled Option</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="withDisabledOption"
          label="Plan"
          :options="[
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
            { value: 'premium', label: 'Premium', disabled: true },
          ]"
        />
      </div>

      <H1>Readonly Group</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="readonlyGroup"
          label="Locked selection"
          readonly
          :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]"
        />
      </div>

      <H1>Disabled Group</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="disabledGroup"
          label="Unavailable"
          disabled
          :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]"
        />
      </div>

      <H1>Required Group</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          v-model="requiredGroup"
          label="Required selection"
          required
          :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]"
        />
      </div>

      <H1>Custom Option Slot</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpRadioGroup
          :model-value="null"
          label="Custom rendering"
          :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]"
        >
          <template #option="{ option, checked }">
            <strong v-if="checked">✓ {{ option.label }}</strong>
            <span v-else>{{ option.label }}</span>
          </template>
        </NtpRadioGroup>
      </div>
    `,
  }),
}