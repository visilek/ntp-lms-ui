import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpButton } from '@ntp-lms-ui/components'
import { BUTTON_VARIANTS, BUTTON_COLORS, BUTTON_SIZES } from '@ntp-lms-ui/lib'

const meta: Meta<typeof NtpButton> = {
  title: 'Components/NtpButton',
  component: NtpButton,
  argTypes: {
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS],
    },
    color: {
      control: 'select',
      options: [...BUTTON_COLORS],
    },
    size: {
      control: 'select',
      options: [...BUTTON_SIZES],
    },
  },
}

export default meta

type Story = StoryObj<typeof NtpButton>

export const Default: Story = {
  render: (args) => ({
    components: { NtpButton },
    setup: () => ({ args }),
    template: '<NtpButton v-bind="args">Button</NtpButton>',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpButton },
    template: `
      <H1>Primary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="primary">Filled</NtpButton>
        <NtpButton variant="filled" color="primary" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="primary" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="primary">Outlined</NtpButton>
        <NtpButton variant="outlined" color="primary" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="primary" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="primary">Text</NtpButton>
        <NtpButton variant="text" color="primary" disabled>Text</NtpButton>
        <NtpButton variant="text" color="primary" loading>Text</NtpButton>
        </div>
      <H1>Secondary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="secondary">Filled</NtpButton>
        <NtpButton variant="filled" color="secondary" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="secondary" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="secondary">Outlined</NtpButton>
        <NtpButton variant="outlined" color="secondary" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="secondary" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="secondary">Text</NtpButton>
        <NtpButton variant="text" color="secondary" disabled>Text</NtpButton>
        <NtpButton variant="text" color="secondary" loading>Text</NtpButton>
        </div>
      <H1>Tertiary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="tertiary">Filled</NtpButton>
        <NtpButton variant="filled" color="tertiary" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="tertiary" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="tertiary">Outlined</NtpButton>
        <NtpButton variant="outlined" color="tertiary" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="tertiary" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="tertiary">Text</NtpButton>
        <NtpButton variant="text" color="tertiary" disabled>Text</NtpButton>
        <NtpButton variant="text" color="tertiary" loading>Text</NtpButton>
        </div>
      <H1>Error</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="error">Filled</NtpButton>
        <NtpButton variant="filled" color="error" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="error" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="error">Outlined</NtpButton>
        <NtpButton variant="outlined" color="error" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="error" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="error">Text</NtpButton>
        <NtpButton variant="text" color="error" disabled>Text</NtpButton>
        <NtpButton variant="text" color="error" loading>Text</NtpButton>
        </div>
      <H1>Surface</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="surface">Filled</NtpButton>
        <NtpButton variant="filled" color="surface" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="surface" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="surface">Outlined</NtpButton>
        <NtpButton variant="outlined" color="surface" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="surface" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="surface">Text</NtpButton>
        <NtpButton variant="text" color="surface" disabled>Text</NtpButton>
        <NtpButton variant="text" color="surface" loading>Text</NtpButton>
        </div>
      <H1>On surface variant</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled" color="on-surface-variant">Filled</NtpButton>
        <NtpButton variant="filled" color="on-surface-variant" disabled>Filled</NtpButton>
        <NtpButton variant="filled" color="on-surface-variant" loading>Filled</NtpButton>
        <NtpButton variant="outlined" color="on-surface-variant">Outlined</NtpButton>
        <NtpButton variant="outlined" color="on-surface-variant" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" color="on-surface-variant" loading>Outlined</NtpButton>
        <NtpButton variant="text" color="on-surface-variant">Text</NtpButton>
        <NtpButton variant="text" color="on-surface-variant" disabled>Text</NtpButton>
        <NtpButton variant="text" color="on-surface-variant" loading>Text</NtpButton>
        </div>
      <H1>Default</H1>
      <div class="ntp-my-2" style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <NtpButton variant="filled">Filled</NtpButton>
        <NtpButton variant="filled" disabled>Filled</NtpButton>
        <NtpButton variant="filled" loading>Filled</NtpButton>
        <NtpButton variant="outlined">Outlined</NtpButton>
        <NtpButton variant="outlined" disabled>Outlined</NtpButton>
        <NtpButton variant="outlined" loading>Outlined</NtpButton>
        <NtpButton variant="text">Text</NtpButton>
        <NtpButton variant="text" disabled>Text</NtpButton>
        <NtpButton variant="text" loading>Text</NtpButton>
        </div>
    `,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { NtpButton },
    template: `
      <H1>Primary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="primary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="primary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="primary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="primary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="primary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="primary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="primary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="primary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="primary" loading>+</NtpButton>
        </div>
      <H1>Secondary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="secondary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="secondary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="secondary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="secondary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="secondary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="secondary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="secondary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="secondary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="secondary" loading>+</NtpButton>
      </div>
      <H1>Tertiary</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="tertiary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="tertiary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="tertiary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="tertiary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="tertiary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="tertiary" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="tertiary">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="tertiary" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="tertiary" loading>+</NtpButton>
      </div>
       <H1>Error</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="error">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="error" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="error" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="error">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="error" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="error" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="error">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="error" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="error" loading>+</NtpButton>
      </div>
      <H1>Surface</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="surface">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="surface" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="surface" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="surface">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="surface" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="surface" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="surface">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="surface" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="surface" loading>+</NtpButton>
      </div>
      <H1>On surface variant</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add" color="on-surface-variant">+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="on-surface-variant" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" color="on-surface-variant" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="on-surface-variant">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="on-surface-variant" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" color="on-surface-variant" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="on-surface-variant">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="on-surface-variant" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" color="on-surface-variant" loading>+</NtpButton>
      </div>
      <H1>Default</H1>
      <div class="ntp-my-2" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <NtpButton icon-only aria-label="Add">+</NtpButton>
        <NtpButton icon-only aria-label="Add" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="outlined" loading>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text">+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" disabled>+</NtpButton>
        <NtpButton icon-only aria-label="Add" variant="text" loading>+</NtpButton>
      </div>
      
    `,
  }),
}