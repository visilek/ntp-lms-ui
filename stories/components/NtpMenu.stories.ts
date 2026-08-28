import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpMenu, NtpButton, NtpTextInput } from '@ntp-lms-ui/components'
import { MENU_PLACEMENTS } from '@ntp-lms-ui/lib'

const meta = {
  title: 'Components/NtpMenu',
  component: NtpMenu,
  argTypes: {
    placement: {
      control: 'select',
      options: [...MENU_PLACEMENTS],
    },
  },
} satisfies Meta<typeof NtpMenu>

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
    components: { NtpMenu, NtpButton },
    setup() {
      const anchorRef = ref<HTMLElement | null>(null)
      const isOpen = ref(false)
      const lastSelected = ref('')

      function onSelect(payload: { value: string | number }) {
        lastSelected.value = String(payload.value)
        isOpen.value = false
      }

      return { anchorRef, isOpen, lastSelected, items, onSelect }
    },
    template: `
      <div style="padding: 100px;">
        <NtpButton ref="anchorRef"  @click="isOpen = !isOpen">Open menu</NtpButton>
        <NtpMenu
          :items="items"
          :anchor="anchorRef"
          :open="isOpen"
          @select="onSelect"
          @close="isOpen = false"
        />

        <p v-if="lastSelected" style="margin-top: 16px;">Selected: {{ lastSelected }}</p>
      </div>
    `,
  }),
}

export const Placements: Story = {
  render: () => ({
    components: { NtpMenu, NtpButton },
    setup() {
      const anchorBottomEnd = ref<HTMLElement | null>(null)
      const anchorBottomStart = ref<HTMLElement | null>(null)
      const anchorTopEnd = ref<HTMLElement | null>(null)
      const anchorTopStart = ref<HTMLElement | null>(null)

      const openMenu = ref<string | null>(null)

      function toggle(menu: string) {
        openMenu.value = openMenu.value === menu ? null : menu
      }

      return {
        anchorBottomEnd,
        anchorBottomStart,
        anchorTopEnd,
        anchorTopStart,
        openMenu,
        items,
        toggle,
      }
    },
    template: `
      <div style="padding: 150px; display: flex; gap: 40px; align-items: center; flex-wrap: wrap;">
          <NtpButton ref="anchorBottomEnd" @click="toggle('bottom-end')">Bottom End</NtpButton>
          <NtpButton ref="anchorBottomStart" @click="toggle('bottom-start')">Bottom Start</NtpButton>
          <NtpButton ref="anchorTopEnd" @click="toggle('top-end')">Top End</NtpButton>
          <NtpButton ref="anchorTopStart" @click="toggle('top-start')">Top Start</NtpButton>
      </div>

      <NtpMenu
        :items="items"
        :anchor="anchorBottomEnd"
        placement="bottom-end"
        :open="openMenu === 'bottom-end'"
        @close="openMenu = null"
      />
      <NtpMenu
        :items="items"
        :anchor="anchorBottomStart"
        placement="bottom-start"
        :open="openMenu === 'bottom-start'"
        @close="openMenu = null"
      />
      <NtpMenu
        :items="items"
        :anchor="anchorTopEnd"
        placement="top-end"
        :open="openMenu === 'top-end'"
        @close="openMenu = null"
      />
      <NtpMenu
        :items="items"
        :anchor="anchorTopStart"
        placement="top-start"
        :open="openMenu === 'top-start'"
        @close="openMenu = null"
      />
    `,
  }),
}

export const WithSearchHeader: Story = {
  render: () => ({
    components: { NtpMenu, NtpButton, NtpTextInput },
    setup() {
      const anchorRef = ref<HTMLElement | null>(null)
      const isOpen = ref(false)
      const searchQuery = ref('')

      return { anchorRef, isOpen, searchQuery }
    },
    template: `
      <div style="padding: 100px;">
          <NtpButton ref="anchorRef" @click="isOpen = !isOpen">Open with search</NtpButton>

        <NtpMenu
          :items="[
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
          ]"
          :anchor="anchorRef"
          :open="isOpen"
          @close="isOpen = false"
        >
          <template #header>
            <NtpTextInput v-model="searchQuery" label="Search" variant="outlined" />
          </template>
        </NtpMenu>
      </div>
    `,
  }),
}

export const WithDisabledItems: Story = {
  render: () => ({
    components: { NtpMenu, NtpButton },
    setup() {
      const anchorRef = ref<HTMLElement | null>(null)
      const isOpen = ref(false)

      return {
        anchorRef,
        isOpen,
        items: [
          { value: 'a', label: 'Available' },
          { value: 'b', label: 'Disabled', disabled: true },
          { value: 'c', label: 'Delete', danger: true },
        ],
      }
    },
    template: `
      <div style="padding: 100px;">
        <div ref="anchorRef" style="display: inline-flex;">
          <NtpButton @click="isOpen = !isOpen">Open with disabled</NtpButton>
        </div>

        <NtpMenu
          :items="items"
          :anchor="anchorRef"
          :open="isOpen"
          @close="isOpen = false"
        />
      </div>
    `,
  }),
}

export const WithFooter: Story = {
  render: () => ({
    components: { NtpMenu, NtpButton },
    setup() {
      const anchorRef = ref<HTMLElement | null>(null)
      const isOpen = ref(false)

      return { anchorRef, isOpen }
    },
    template: `
      <div style="padding: 100px;">
        <div ref="anchorRef" style="display: inline-flex;">
          <NtpButton @click="isOpen = !isOpen">Open with footer</NtpButton>
        </div>

        <NtpMenu
          :items="[
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
            { value: 'c', label: 'Option C' },
          ]"
          :anchor="anchorRef"
          :open="isOpen"
          @close="isOpen = false"
        >
          <template #footer>
            <NtpButton variant="text" size="small">Load more</NtpButton>
          </template>
        </NtpMenu>
      </div>
    `,
  }),
}