import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpCard, NtpCardHeader, NtpMedia, NtpButton, NtpActionMenu } from '@ntp-lms-ui/components'

const meta = {
  title: 'Components/NtpCard',
  component: NtpCard,
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
    },
  },
} satisfies Meta<typeof NtpCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'elevated',
  },
  render: (args) => ({
    components: { NtpCard },
    setup: () => ({ args }),
    template: `
      <NtpCard v-bind="args" class="ntp-pa-4"">
        Card content
      </NtpCard>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpCard },
    template: `
      <div class="ntp-flex ntp-gap-4" style="padding: 16px;">
        <NtpCard variant="elevated" class="ntp-pa-4">Elevated</NtpCard>
        <NtpCard variant="filled" class="ntp-pa-4">Filled</NtpCard>
        <NtpCard variant="outlined" class="ntp-pa-4">Outlined</NtpCard>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader },
    template: `
      <div class="ntp-flex ntp-flex-wrap ntp-gap-4" style="padding: 16px;">
        <NtpCard color="surface" class="ntp-pa-4" style="width: 240px;">
          <NtpCardHeader title="Surface" subtitle="Default" />
        </NtpCard>

        <NtpCard color="primary" class="ntp-pa-4" style="width: 240px;">
          <NtpCardHeader title="Primary" subtitle="Tinted container" />
        </NtpCard>

        <NtpCard color="secondary" class="ntp-pa-4" style="width: 240px;">
          <NtpCardHeader title="Secondary" subtitle="Tinted container" />
        </NtpCard>

        <NtpCard color="tertiary" class="ntp-pa-4" style="width: 240px;">
          <NtpCardHeader title="Tertiary" subtitle="Tinted container" />
        </NtpCard>
      </div>
    `,
  }),
}

export const WithHeader: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader },
    template: `
      <div style="padding: 16px; max-width: 400px;">
        <NtpCard>
          <div class="ntp-pa-4">
            <NtpCardHeader
              title="John Doe"
              subtitle="2 hours ago"
              avatar="https://banana.by/uploads/posts/2018-02/1519106038_sasha_grey_02.jpg"
            />
            <p style="margin-top: 16px;">Comment body content goes here.</p>
          </div>
        </NtpCard>
      </div>
    `,
  }),
}

export const WithHeaderAndAction: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader, NtpActionMenu },
    setup() {
      const items = [
        { value: 'edit', label: 'Edit' },
        { value: 'delete', label: 'Delete', danger: true },
      ]
      return { items }
    },
    template: `
      <div class="ntp-flex ntp-flex-wrap ntp-gap-4" style="padding: 16px;">
        <NtpCard>
          <div class="ntp-pa-4">
            <NtpCardHeader
              title="Physics 101"
              subtitle="Mechanics"
              avatar="https://banana.by/uploads/posts/2018-02/1519106038_sasha_grey_02.jpg"
            >
              <NtpActionMenu :items="items" />
            </NtpCardHeader>
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>
      
        <NtpCard color="primary">
          <div class="ntp-pa-4">
            <NtpCardHeader
              title="Physics 101"
              subtitle="Mechanics"
              avatar="https://banana.by/uploads/posts/2018-02/1519106038_sasha_grey_02.jpg"
            >
              <NtpActionMenu :items="items" />
            </NtpCardHeader>
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>
      
        <NtpCard color="tertiary">
          <div class="ntp-pa-4">
            <NtpCardHeader
              title="Physics 101"
              subtitle="Mechanics"
              avatar="https://banana.by/uploads/posts/2018-02/1519106038_sasha_grey_02.jpg"
            >
              <NtpActionMenu :items="items" />
            </NtpCardHeader>
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>
      </div>
    `,
  }),
}

export const WithMedia: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader, NtpMedia },
    template: `
      <div class="ntp-flex ntp-flex-wrap ntp-gap-4" style="padding: 16px;">
        <NtpCard style="padding: 16px; max-width: 480px;">
          <NtpMedia
            :media="{ src: 'https://www.filepicker.io/api/file/3xzWlTCMR4uC49QTCzS8', alt: 'Course cover' }"
            aspect-ratio="16 / 9"
          />
          <div class="ntp-pa-4">
            <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>

        <NtpCard color="primary" style="padding: 16px; max-width: 480px;">
          <NtpMedia
            :media="{ src: 'https://www.filepicker.io/api/file/3xzWlTCMR4uC49QTCzS8', alt: 'Course cover' }"
            aspect-ratio="16 / 9"
          />
          <div class="ntp-pa-4">
            <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>

        <NtpCard color="tertiary" style="padding: 16px; max-width: 480px;">
          <NtpMedia
            :media="{ src: 'https://www.filepicker.io/api/file/3xzWlTCMR4uC49QTCzS8', alt: 'Course cover' }"
            aspect-ratio="16 / 9"
          />
          <div class="ntp-pa-4">
            <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
            <p style="margin-top: 16px;">Course description.</p>
          </div>
        </NtpCard>
      </div>
    `,
  }),
}

export const HeaderOverMedia: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader, NtpMedia },
    template: `
      <div style="padding: 16px; max-width: 400px;">
        <NtpCard>
          <div style="position: relative;">
            <NtpMedia
              :media="{ src: 'https://www.filepicker.io/api/file/3xzWlTCMR4uC49QTCzS8', alt: 'Course cover' }"
              aspect-ratio="4 / 3"
            />
            <div style="position: absolute; bottom: 0; left: 0; right: 0;">
              <NtpCardHeader
                title="Physics 101"
                subtitle="Mechanics"
                overlay="scrim"
              />
            </div>
          </div>
          <div class="ntp-pa-4">
            <p>Course description.</p>
          </div>
        </NtpCard>
      </div>
    `,
  }),
}

export const Clickable: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader },
    template: `
      <div style="padding: 16px; max-width: 400px;">
        <NtpCard clickable>
          <div class="ntp-pa-4">
            <NtpCardHeader title="Clickable card" subtitle="Click to navigate" />
          </div>
        </NtpCard>
      </div>
    `,
  }),
}

export const WithFooterActions: Story = {
  render: () => ({
    components: { NtpCard, NtpCardHeader, NtpButton },
    template: `
      <div style="padding: 16px; max-width: 400px;">
        <NtpCard>
          <div class="ntp-pa-4">
            <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
            <p style="margin-top: 16px;">Course description.</p>
          </div>
          <div class="ntp-px-4 ntp-pb-3 ntp-flex ntp-justify-end ntp-gap-2">
            <NtpButton variant="text" size="small">Cancel</NtpButton>
            <NtpButton variant="text" size="small">Save</NtpButton>
          </div>
        </NtpCard>
      </div>
    `,
  }),
}