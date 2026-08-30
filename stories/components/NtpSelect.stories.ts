import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpSelect } from '@ntp-lms-ui/components'
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

const smallOptions = [
  { id: 'physics', title: 'Physics' },
  { id: 'math', title: 'Mathematics' },
  { id: 'chemistry', title: 'Chemistry' },
  { id: 'biology', title: 'Biology' },
  { id: 'history', title: 'History' },
]

const totalOptions = Array.from({ length: 30 }, (_, i) => {
  const groupIndex = Math.floor(i / 10)
  const groupNames = ['alpha long-named option', 'beta long-named option', 'gamma long-named option']
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

export const WithInitialOption: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>()
      const initialOption = {
        value: 'physics',
        label: 'Physics',
      }

      return { selected, initialOption, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect
          v-model="selected"
          label="Subject"
          :initial-option="initialOption"
          :load-options="mockLoadSmall"
        />
      </div>
    `,
  }),
}

export const LocalFiltering: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>(null)
      return { selected, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Open and type to filter locally (no API calls).</p>
        <NtpSelect v-model="selected" label="Subject" :load-options="mockLoadSmall" />
      </div>
    `,
  }),
}

export const AsyncSearch: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>(null)
      return { selected, mockLoadLarge }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Open and type to search via API (debounced).</p>
        <NtpSelect v-model="selected" label="Option" :load-options="mockLoadLarge" />
        <p style="margin-top: 16px;">Selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const NotClearable: Story = {
  render: () => ({
    components: { NtpSelect },
    setup() {
      const selected = ref<string | number | null>('physics')
      const initialOption = {
        value: 'physics',
        label: 'Physics',
      }

      return { selected, initialOption, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpSelect
          v-model="selected"
          label="Subject"
          :initial-option="initialOption"
          :load-options="mockLoadSmall"
          :clearable="false"
        />
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