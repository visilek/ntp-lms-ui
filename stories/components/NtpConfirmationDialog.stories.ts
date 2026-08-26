import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import NtpConfirmationDialog from '../../src/components/NtpConfirmationDialog/NtpConfirmationDialog.vue'
import NtpButton from '../../src/components/NtpButton/NtpButton.vue'

const meta = {
  title: 'Components/NtpConfirmationDialog',
  component: NtpConfirmationDialog,
} satisfies Meta<typeof NtpConfirmationDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  render: () => ({
    components: { NtpConfirmationDialog, NtpButton },
    setup() {
      const isOpen = ref(false)

      function onConfirm() {
        isOpen.value = false
      }

      return { isOpen, onConfirm }
    },
    template: `
      <NtpButton @click="isOpen = true">Open confirmation</NtpButton>

      <NtpConfirmationDialog
        v-model:open="isOpen"
        title="Confirm Attendance?"
        message="Mark this student as present for today's session."
        @confirm="onConfirm"
      />
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { NtpConfirmationDialog, NtpButton },
    setup() {
      const isOpen = ref(false)

      function onConfirm() {
        isOpen.value = false
      }

      return { isOpen, onConfirm }
    },
    template: `
      <NtpButton @click="isOpen = true">Open confirmation</NtpButton>

      <NtpConfirmationDialog
        v-model:open="isOpen"
        icon="⚠️"
        title="Confirm Attendance?"
        message="Mark this student as present for today's session."
        @confirm="onConfirm"
      />
    `,
  }),
}

export const Destructive: Story = {
  render: () => ({
    components: { NtpConfirmationDialog, NtpButton },
    setup() {
      const isOpen = ref(false)
      const isDeleting = ref(false)

      function onConfirm() {
        isDeleting.value = true
        setTimeout(() => {
          isDeleting.value = false
          isOpen.value = false
        }, 1500)
      }

      return { isOpen, isDeleting, onConfirm }
    },
    template: `
      <NtpButton color="error" @click="isOpen = true">Delete</NtpButton>

      <NtpConfirmationDialog
        v-model:open="isOpen"
        title="Delete Course?"
        message="This action is irreversible. All associated content will be removed."
        confirm-label="Delete"
        cancel-label="Keep Course"
        confirm-color="error"
        buttons="filled"
        :loading="isDeleting"
        @confirm="onConfirm"
      />
    `,
  }),
}

export const WithTypeToConfirm: Story = {
  render: () => ({
    components: { NtpConfirmationDialog, NtpButton },
    setup() {
      const isOpen = ref(false)

      function onConfirm() {
        isOpen.value = false
      }

      return { isOpen, onConfirm }
    },
    template: `
      <NtpButton color="error" @click="isOpen = true">Delete with confirmation</NtpButton>

      <NtpConfirmationDialog
        v-model:open="isOpen"
        title="Delete Course?"
        message="This action is irreversible."
        confirm-label="Delete"
        confirm-color="error"
        buttons="filled"
        confirmation-phrase="delete"
        @confirm="onConfirm"
      />
    `,
  }),
}

export const CustomContent: Story = {
  render: () => ({
    components: { NtpConfirmationDialog, NtpButton },
    setup() {
      const isOpen = ref(false)

      return { isOpen }
    },
    template: `
      <NtpButton @click="isOpen = true">Custom content</NtpButton>

      <NtpConfirmationDialog
        v-model:open="isOpen"
        title="Archive Items?"
        confirm-label="Archive"
        buttons="filled"
        @confirm="isOpen = false"
      >
        <template #default>
          <p>You are about to archive <strong>3 courses</strong>.</p>
          <p>Archived courses are hidden but can be restored later.</p>
        </template>
      </NtpConfirmationDialog>
    `,
  }),
}