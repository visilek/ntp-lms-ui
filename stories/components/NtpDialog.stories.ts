import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpDialog, NtpDialogHeader, NtpButton, NtpTextInput } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpDialog',
  component: NtpDialog,
} satisfies Meta<typeof NtpDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  render: () => ({
    components: { NtpDialog, NtpDialogHeader, NtpButton, NtpTextInput },
    setup() {
      const isOpen = ref(false)
      const title = ref('')

      return { isOpen, title }
    },
    template: `
      <NtpButton @click="isOpen = true">Open dialog</NtpButton>

      <NtpDialog v-model:open="isOpen">
        <NtpDialogHeader title="Edit Course" @close="isOpen = false" />

        <div class="ntp-pa-4" style="display: flex; flex-direction: column; gap: 16px;">
          <NtpTextInput v-model="title" label="Title" />
          <NtpTextInput label="Description" />
        </div>

        <div class="ntp-pa-4" style="display: flex; justify-content: flex-end; gap: 8px;">
          <NtpButton variant="outlined" @click="isOpen = false">Cancel</NtpButton>
          <NtpButton @click="isOpen = false">Save</NtpButton>
        </div>
      </NtpDialog>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { NtpDialog, NtpDialogHeader, NtpButton },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <NtpButton @click="isOpen = true">Open confirmation</NtpButton>

      <NtpDialog v-model:open="isOpen">
        <NtpDialogHeader
          title="Delete Course?"
          subtitle="This action cannot be undone."
          icon="⚠️"
          @close="isOpen = false"
        />

        <div class="ntp-pa-4" style="display: flex; justify-content: center; gap: 8px;">
          <NtpButton variant="outlined" @click="isOpen = false">Cancel</NtpButton>
          <NtpButton color="error" @click="isOpen = false">Delete</NtpButton>
        </div>
      </NtpDialog>
    `,
  }),
}

export const Fullscreen: Story = {
  render: () => ({
    components: { NtpDialog, NtpDialogHeader, NtpButton, NtpTextInput },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <NtpButton @click="isOpen = true">Open fullscreen</NtpButton>

      <NtpDialog v-model:open="isOpen" fullscreen>
        <NtpDialogHeader
          title="Edit Course Details"
          fullscreen-title="Edit"
          @close="isOpen = false"
        >
          <template #fullscreenActions>
            <NtpButton variant="text" @click="isOpen = false">Save</NtpButton>
          </template>
        </NtpDialogHeader>

        <div class="ntp-pa-4" style="display: flex; flex-direction: column; gap: 16px;">
          <NtpTextInput label="Title" />
          <NtpTextInput label="Description" />
          <NtpTextInput label="Code" />
        </div>
      </NtpDialog>
    `,
  }),
}

export const Persistent: Story = {
  render: () => ({
    components: { NtpDialog, NtpDialogHeader, NtpButton },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <NtpButton @click="isOpen = true">Open persistent</NtpButton>

      <NtpDialog v-model:open="isOpen" persistent>
        <NtpDialogHeader title="Processing..." :show-close="false" />

        <div class="ntp-pa-4">
          <p>Please wait. This dialog cannot be dismissed.</p>
        </div>
      </NtpDialog>
    `,
  }),
}