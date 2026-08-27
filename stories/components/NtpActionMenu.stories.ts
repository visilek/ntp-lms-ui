import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpActionMenu, NtpButton } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpActionMenu',
  component: NtpActionMenu,
} satisfies Meta<typeof NtpActionMenu>

export default meta

type Story = StoryObj<typeof meta>

const items = [
  { value: 'edit', label: 'Edit', leading: '✏️' },
  { value: 'duplicate', label: 'Duplicate', leading: '📋' },
  { value: 'archive', label: 'Archive', leading: '📁' },
  { value: 'delete', label: 'Delete', leading: '🗑️', danger: true },
]

export const Default: Story = {
  render: () => ({
    components: { NtpActionMenu },
    setup() {
      const lastSelected = ref('')

      function onSelect(payload: { value: string | number }) {
        lastSelected.value = String(payload.value)
      }

      return { items, lastSelected, onSelect }
    },
    template: `
      <div style="padding: 100px;">
        <NtpActionMenu :items="items" @select="onSelect" />
        <p v-if="lastSelected" style="margin-top: 16px;">Selected: {{ lastSelected }}</p>
      </div>
    `,
  }),
}

export const CustomAriaLabel: Story = {
  render: () => ({
    components: { NtpActionMenu },
    setup() {
      return { items }
    },
    template: `
      <div style="padding: 100px;">
        <NtpActionMenu :items="items" aria-label="Actions" />
      </div>
    `,
  }),
}

export const CustomTrigger: Story = {
  render: () => ({
    components: { NtpActionMenu, NtpButton },
    setup() {
      return { items }
    },
    template: `
      <div style="padding: 100px;">
        <NtpActionMenu :items="items">
          <template #trigger>
            <span>⋯</span>
          </template>
        </NtpActionMenu>
      </div>
    `,
  }),
}

export const CustomMenuContent: Story = {
  render: () => ({
    components: { NtpActionMenu },
    setup() {
      return {}
    },
    template: `
      <div style="padding: 100px;">
        <NtpActionMenu>
          <template #default>
            <button type="button" style="width: 100%; padding: 8px 16px; text-align: left;">Custom action 1</button>
            <button type="button" style="width: 100%; padding: 8px 16px; text-align: left;">Custom action 2</button>
          </template>
        </NtpActionMenu>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { NtpActionMenu },
    setup() {
      return { items }
    },
    template: `
      <div style="padding: 100px; display: flex; gap: 24px; align-items: center;">
        <NtpActionMenu :items="items" />
        <NtpActionMenu :items="items" variant="outlined" color="primary" />
        <NtpActionMenu :items="items" variant="filled" color="tertiary" />
        <NtpActionMenu :items="items" disabled />
      </div>
    `,
  }),
}