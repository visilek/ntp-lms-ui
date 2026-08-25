import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpCheckboxGroup } from '@ntp-lms-ui/components'
import { SELECTION_LABEL_POSITIONS, SELECTION_GROUP_DIRECTIONS } from '@ntp-lms-ui/lib'

const meta = {
  title: 'Components/NtpCheckboxGroup',
  component: NtpCheckboxGroup,
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
} satisfies Meta<typeof NtpCheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Choose options',
    labelPosition: 'right',
    direction: 'vertical',
    options: [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
    ],
  },
  render: (args) => ({
    components: { NtpCheckboxGroup },
    setup: () => ({ args }),
    template: '<NtpCheckboxGroup v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpCheckboxGroup },
    setup() {
      const vertical = ref<string[]>(['create'])
      const required = ref<string[]>([])
      const horizontal = ref<string[]>(['a'])
      const withErrors = ref<string[]>([])
      const withDisabledOption = ref<string[]>([])
      const readonlyGroup = ref<string[]>(['a', 'b'])
      const disabledGroup = ref<string[]>(['a'])

      return {
        vertical,
        horizontal,
        withErrors,
        withDisabledOption,
        readonlyGroup,
        disabledGroup,
      }
    },
    template: `
      <H1>Vertical (default)</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          v-model="vertical"
          label="Permissions"
          :options="[
            { value: 'create', label: 'Create' },
            { value: 'edit', label: 'Edit' },
            { value: 'delete', label: 'Delete' },
          ]"
        />
      </div>

      <H1>Required</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          v-model="required"
          label="Выбрать"
          required
          :options="[
            { value: 'a', label: 'Стул №1' },
            { value: 'b', label: 'Стул №2' },
          ]"
        />
      </div>

      <H1>Horizontal</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          v-model="horizontal"
          label="Days"
          direction="horizontal"
          :options="[
            { value: 'mon', label: 'Mon' },
            { value: 'tue', label: 'Tue' },
            { value: 'wed', label: 'Wed' },
          ]"
        />
      </div>

      <H1>With Errors</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          v-model="withErrors"
          label="Selection"
          :errors="['Select at least one option']"
          :options="[
            { value: 'x', label: 'Option X' },
            { value: 'y', label: 'Option Y' },
          ]"
        />
      </div>

      <H1>With Disabled Option</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          v-model="withDisabledOption"
          label="Features"
          :options="[
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
            { value: 'premium', label: 'Premium', disabled: true },
          ]"
        />
      </div>

      <H1>Readonly Group</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
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
        <NtpCheckboxGroup
          v-model="disabledGroup"
          label="Unavailable"
          disabled
          :options="[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]"
        />
      </div>

      <H1>Custom Option Slot</H1>
      <div class="ntp-my-2" style="max-width: 400px;">
        <NtpCheckboxGroup
          :model-value="[]"
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
        </NtpCheckboxGroup>
      </div>
    `,
  }),
}