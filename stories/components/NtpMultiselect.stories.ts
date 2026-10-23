import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpMultiSelect, NtpButton } from '@ntp-lms-ui/components'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '@ntp-lms-ui/lib'
import type { DropdownValue } from '@ntp-lms-ui/lib/types'

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


const tinyOptions = [
  { id: 'physics', title: 'Physics' },
  { id: 'math', title: 'Mathematics' },
  { id: 'chemistry', title: 'Chemistry' },
  { id: 'biology', title: 'Biology' },
]

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

async function mockLoadTiny(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const filtered = tinyOptions.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase()),
  )
  return { items: filtered, totalCount: filtered.length }
}

async function mockLoadSmall(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const filtered = smallOptions.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase()),
  )
  return { items: filtered, totalCount: filtered.length }
}

async function mockLoadLarge(query: string, page: number, pageSize: number) {
  await new Promise((resolve) => setTimeout(resolve, 600))
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
      return { selected, mockLoadTiny }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpMultiSelect v-model="selected" label="Subjects" :load-options="mockLoadTiny" />
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

      return { selected, initialOptions, mockLoadTiny }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpMultiSelect
          v-model="selected"
          :initial-options="initialOptions"
          label="Subjects"
          :load-options="mockLoadTiny"
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

export const SelectedView: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<DropdownValue[]>(['physics', 'math'])
      const preloadedOptions = [
        { value: 'physics', label: 'Physics' },
        { value: 'math', label: 'Mathematics' },
        { value: 'chemistry', label: 'Chemistry' },
      ]

      return { selected, preloadedOptions, mockLoadSmall }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <p style="margin-bottom: 16px;">Open and toggle "Show selected" to view the selected-only list.</p>
        <NtpMultiSelect
          v-model="selected"
          label="Subjects"
          :load-options="mockLoadSmall"
          :preloaded-options="preloadedOptions"
        />
      </div>
    `,
  }),
}

export const ProgrammaticReset: Story = {
  render: () => ({
    components: { NtpMultiSelect, NtpButton },
    setup() {
      const selected = ref<DropdownValue[]>([])
      const preloadedOptions = [
        { value: 'physics', label: 'Physics' },
        { value: 'math', label: 'Mathematics' },
        { value: 'chemistry', label: 'Chemistry' },
      ]

      function setTwoSubjects() {
        selected.value = ['physics', 'math']
      }

      function setOneSubject() {
        selected.value = ['chemistry']
      }

      function clearAll() {
        selected.value = []
      }

      return { selected, preloadedOptions, mockLoadSmall, setTwoSubjects, setOneSubject, clearAll }
    },
    template: `
      <div style="max-width: 400px; padding: 40px;">
        <NtpMultiSelect
          v-model="selected"
          label="Subjects"
          :load-options="mockLoadSmall"
          :preloaded-options="preloadedOptions"
        />
        <div class="ntp-flex ntp-gap-2" style="margin-top: 16px;">
          <NtpButton size="small" @click="setTwoSubjects">Set Two</NtpButton>
          <NtpButton size="small" @click="setOneSubject">Set One</NtpButton>
          <NtpButton size="small" @click="clearAll">Clear</NtpButton>
        </div>
      </div>
    `,
  }),
}

export const StaticOptions: Story = {
  render: () => ({
    components: { NtpMultiSelect },
    setup() {
      const selected = ref<DropdownValue[]>([])
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
        <NtpMultiSelect v-model="selected" label="Statuses" :preloaded-options="options" />
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