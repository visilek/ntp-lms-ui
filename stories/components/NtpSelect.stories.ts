import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpSelect, NtpButton } from '@ntp-lms-ui/components'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '@ntp-lms-ui/lib'

const meta = {
  title: 'Components/NtpSelect',
  component: NtpSelect,
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
} satisfies Meta<typeof NtpSelect>

export default meta

type Story = StoryObj<typeof meta>

const availableOptions = [
  { id: 'physics', label: 'Physics' },
  { id: 'math', label: 'Mathematics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'biology', label: 'Biology' },
  { id: 'history', label: 'History' },
]

async function mockLoadSmall(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const filtered = availableOptions.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  )
  return { items: filtered, totalCount: filtered.length }
}

export const Default: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>(null)
      return { selected, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect v-model="selected" label="Subject" :load-options="mockLoadSmall" />
        <p style="margin-top: 16px;">Selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const WithPreloadedOptions: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>('physics')
      const preloadedOptions = [
        { value: 'physics', label: 'Physics' },
      ]

      return { selected, preloadedOptions, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect
          v-model="selected"
          label="Subject"
          :load-options="mockLoadSmall"
          :preloaded-options="preloadedOptions"
        />
      </div>
    `,
  }),
}

export const WithoutPreloadedOptions: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>('physics')
      return { selected, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">
          Value set without preloaded — label resolves via API on mount.
        </p>
        <NtpSelect v-model="selected" label="Subject" :load-options="mockLoadSmall" />
      </div>
    `,
  }),
}

export const NotClearable: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>('physics')
      const preloadedOptions = [
        { value: 'physics', label: 'Physics' },
      ]

      return { selected, preloadedOptions, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect
          v-model="selected"
          label="Subject"
          :load-options="mockLoadSmall"
          :preloaded-options="preloadedOptions"
          :clearable="false"
        />
      </div>
    `,
  }),
}

export const ProgrammaticReset: Story = {
  render: () => ({
    components: { NtpSelect, NtpButton },
    setup() {
      const selected = ref<string | number | null>(null)
      const preloadedOptions = [
        { value: 'physics', label: 'Physics' },
        { value: 'math', label: 'Mathematics' },
        { value: 'chemistry', label: 'Chemistry' },
      ]

      function resetToPhysics() {
        selected.value = 'physics'
      }

      function resetToMath() {
        selected.value = 'math'
      }

      return { selected, preloadedOptions, mockLoadSmall, resetToPhysics, resetToMath }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect
          v-model="selected"
          label="Subject"
          :load-options="mockLoadSmall"
          :preloaded-options="preloadedOptions"
        />
        <div class="ntp-flex ntp-gap-2" style="margin-top: 16px;">
          <NtpButton size="small" @click="resetToPhysics">Set Physics</NtpButton>
          <NtpButton size="small" @click="resetToMath">Set Math</NtpButton>
        </div>
      </div>
    `,
  }),
}

export const StaticOptions: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>(null)
      const options = [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
      ]
      return { selected, options }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Static options — no loader.</p>
        <NtpSelect v-model="selected" label="Status" :preloaded-options="options" />
        <p style="margin-top: 16px;">Selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const ContextColors: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const primarySelected = ref<string | number | null>(null)
      const secondarySelected = ref<string | number | null>(null)

      return { primarySelected, secondarySelected, mockLoadSmall }
    },
    template: `
      <div class="ntp-flex ntp-flex-col ntp-gap-6" style="max-width: 400px; padding: 40px;">
        <div class="ntp-pa-6" style="background-color: hsl(193, 44%, 40%); border-radius: 12px;">
          <NtpSelect
            v-model="primarySelected"
            label="Primary context"
            context-color="primary"
            variant="outlined"
            :load-options="mockLoadSmall"
          />
        </div>
        <div class="ntp-pa-6" style="background-color: hsl(48, 11%, 40%); border-radius: 12px;">
          <NtpSelect
            v-model="secondarySelected"
            label="Secondary context"
            context-color="secondary"
            variant="outlined"
            :load-options="mockLoadSmall"
          />
        </div>
      </div>
    `,
  }),
}