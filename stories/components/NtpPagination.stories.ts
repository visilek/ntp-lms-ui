import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpPagination } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpPagination',
  component: NtpPagination,
} satisfies Meta<typeof NtpPagination>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(1)
      const pageSize = ref(20)
      const totalCount = ref(123)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
        />
      </div>
    `,
  }),
}

export const FewPages: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(1)
      const pageSize = ref(20)
      const totalCount = ref(45)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px;">Few pages — no ellipsis.</p>
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
        />
      </div>
    `,
  }),
}

export const ManyPages: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(25)
      const pageSize = ref(20)
      const totalCount = ref(1000)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px;">Many pages — ellipsis and windowed numbers.</p>
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
        />
      </div>
    `,
  }),
}

export const SinglePage: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(1)
      const pageSize = ref(20)
      const totalCount = ref(5)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px;">Single page — controls hidden.</p>
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
        />
      </div>
    `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(1)
      const pageSize = ref(20)
      const totalCount = ref(0)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <p style="margin-bottom: 16px;">Empty — no count text.</p>
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NtpPagination },
    setup() {
      const page = ref(3)
      const pageSize = ref(20)
      const totalCount = ref(200)
      return { page, pageSize, totalCount }
    },
    template: `
      <div style="padding: 40px;">
        <NtpPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total-count="totalCount"
          disabled
        />
      </div>
    `,
  }),
}