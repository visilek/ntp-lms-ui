import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpMultiSelect } from '@ntp-lms-ui/components'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '@ntp-lms-ui/lib'

const meta = {
  title: 'Components/NtpMultiSelect',
  component: NtpMultiSelect,
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
} satisfies Meta<typeof NtpMultiSelect>

export default meta

type Story = StoryObj<typeof meta>

const smallOptions = [
  { id: 'physics', title: 'Physics' },
  { id: 'math', title: 'Mathematics' },
  { id: 'chemistry', title: 'Chemistry' },
  { id: 'biology', title: 'Biology' },
  { id: 'history', title: 'History' },
  { id: 'literature', title: 'Literature' },
]

const totalOptions = Array.from({ length: 30 }, (_, i) => {
  const groupIndex = Math.floor(i / 10)
  const groupNames = ['alpha', 'beta', 'gamma']
  const group = groupNames[groupIndex]
  const number = (i % 10) + 1
  return {
    id: `${group}-${number}`,
    title: `${group} ${number}`,
  }
})

async function mockLoadSmall(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const filtered = smallOptions.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase()),
  )
  return { items: filtered, totalCount: filtered.length }
}

async function mockLoadLarge(query: string, page: number, pageSize: number) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const filtered = totalOptions.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase()),
  )
  const start = (page - 1) * pageSize
  return {
    items: filtered.slice(start, start + pageSize),
    totalCount: filtered.length,
  }
}

export const Default: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<Array<string | number>>([])
      return { selected, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpMultiSelect v-model="selected" label="Subjects" :load-options="mockLoadSmall" />
        <p style="margin-top: 16px;">Selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const WithInitialOptions: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<Array<string | number>>([])
      const initialOptions = [
        { value: 'physics', label: 'Physics' },
        { value: 'math', label: 'Mathematics' },
      ]

      return { selected, initialOptions, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpMultiSelect
          v-model="selected"
          :initial-options="initialOptions"
          label="Subjects"
          :load-options="mockLoadSmall"
        />
      </div>
    `,
  }),
}

export const WithMasterCheckbox: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<Array<string | number>>([])
      const initialOptions = [
        { value: 'physics', label: 'Physics' }
      ]
      return { selected, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Preload mode with 6 options — master checkbox visible.</p>
        <NtpMultiSelect v-model="selected" :initial-options="initialOptions" label="Subjects" :load-options="mockLoadSmall" />
      </div>
    `,
  }),
}

export const AsyncMode: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<Array<string | number>>([])
      return { selected, mockLoadLarge }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Async mode — search + load more + warning icon.</p>
        <NtpMultiSelect v-model="selected" label="Options" :load-options="mockLoadLarge" />
        <p style="margin-top: 16px;">Selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const ContextColors: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const primarySelected = ref<Array<string | number>>([])
      const secondarySelected = ref<Array<string | number>>([])

      return { primarySelected, secondarySelected, mockLoadSmall }
    },
    template: `
      <div class="ntp-flex ntp-flex-col ntp-gap-6" style="max-width: 400px; padding: 40px;">
        <div class="ntp-pa-6" style="background-color: hsl(193, 44%, 40%); border-radius: 12px;">
          <NtpMultiSelect
            v-model="primarySelected"
            label="Primary context"
            context-color="primary"
            variant="outlined"
            :load-options="mockLoadSmall"
          />
        </div>
        <div class="ntp-pa-6" style="background-color: hsl(48, 11%, 40%); border-radius: 12px;">
          <NtpMultiSelect
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