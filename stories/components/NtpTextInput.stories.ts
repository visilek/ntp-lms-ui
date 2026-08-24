import type { Meta, StoryObj } from '@storybook/vue3'
import { NtpTextInput } from '@ntp-lms-ui/components'
import { INPUT_VARIANTS, INPUT_CONTEXT_COLORS } from '@ntp-lms-ui/lib'

const meta: Meta<typeof NtpTextInput> = {
  title: 'Components/NtpTextInput',
  component: NtpTextInput,
  argTypes: {
    variant: {
      control: 'select',
      options: [...INPUT_VARIANTS],
    },
    contextColor: {
      control: 'select',
      options: [...INPUT_CONTEXT_COLORS],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email'],
    },
  },
}

export default meta

type Story = StoryObj<typeof NtpTextInput>

export const Default: Story = {
  args: {
    label: 'Label',
  },
  render: (args) => ({
    components: { NtpTextInput },
    setup: () => ({ args }),
    template: '<NtpTextInput v-bind="args" />',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { NtpTextInput },
    template: `
      <H1>Surface Context / Filled</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Filled input" variant="filled"/>
        <NtpTextInput label="Filled input" variant="filled" context-color="surface" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" />
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="filled" disabled />
        <NtpTextInput label="Disabled" variant="filled" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="Readonly value" />
      </div>

      <H1>Surface Context / Outlined</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Outlined input" variant="outlined"/>
        <NtpTextInput label="Outlined input" variant="outlined" context-color="surface" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong" />
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="outlined" disabled />
        <NtpTextInput label="Disabled" variant="outlined" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="Readonly value" />
      </div>

      <H1>Slots</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With leading icon">
          <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With trailing action">
          <template #trailing>
            <span>✕</span>
          </template>
        </NtpTextInput>
      </div>
    `,
  }),
}

export const LeadingIcon: Story = {
  render: () => ({
    components: { NtpTextInput },
    template: `
      <H1>Surface Context / Filled</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Filled input" variant="filled">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Filled input" variant="filled" context-color="surface" model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here" model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" >
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" model-value="Some text" >
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="filled" disabled />
        <NtpTextInput label="Disabled" variant="filled" disabled model-value="Some text" >
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="Readonly value" >
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>

      <H1>Surface Context / Outlined</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Outlined input" variant="outlined">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Outlined input" variant="outlined" context-color="surface" model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here" model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong" model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="outlined" disabled>
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Disabled" variant="outlined" disabled model-value="Some text">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="Readonly value">
        <template #leading>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
    `,
  }),
}

export const TrailingIcon: Story = {
  render: () => ({
    components: { NtpTextInput },
    template: `
      <H1>Surface Context / Filled</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Filled input" variant="filled">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Filled input" variant="filled" context-color="surface" model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With hint" variant="filled" hint="Supporting text goes here" model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" >
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With error" variant="filled" error="Something went wrong" model-value="Some text" >
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="filled" disabled />
        <NtpTextInput label="Disabled" variant="filled" disabled model-value="Some text" >
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="filled" readonly model-value="Readonly value" >
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>

      <H1>Surface Context / Outlined</H1>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Outlined input" variant="outlined">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Outlined input" variant="outlined" context-color="surface" model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With hint" variant="outlined" hint="Supporting text goes here" model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="With error" variant="outlined" error="Something went wrong" model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Disabled" variant="outlined" disabled>
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Disabled" variant="outlined" disabled model-value="Some text">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px; max-width: 400px;">
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
        <NtpTextInput label="Readonly" variant="outlined" readonly model-value="Readonly value">
        <template #trailing>
            <span>🔍</span>
          </template>
        </NtpTextInput>
      </div>
    `,
  }),
}

export const OnPrimaryContext: Story = {
  render: () => ({
    components: { NtpTextInput },
    template: `
      <H1>Filled</H1>
      <div style="background-color: hsl(193, 44%, 40%); border-radius: 12px; padding: 12px;">
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Filled input" variant="filled" context-color="primary" />
        <NtpTextInput label="Filled input" variant="filled" context-color="primary" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With hint" variant="filled" context-color="primary" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="filled" context-color="primary" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With error" variant="filled" context-color="primary" error="Something went wrong" />
        <NtpTextInput label="With error" variant="filled" context-color="primary" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Disabled" variant="filled" context-color="primary" disabled />
        <NtpTextInput label="Disabled" variant="filled" context-color="primary" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Readonly" variant="filled" context-color="primary" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="filled" context-color="primary" readonly model-value="Readonly value" />
      </div>
      </div>

      <H1>Outlined</H1>
      <div style="background-color: hsl(193, 44%, 40%); border-radius: 12px; padding: 12px;">
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Outlined input" variant="outlined" context-color="primary" />
        <NtpTextInput label="Outlined input" variant="outlined" context-color="primary" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With hint" variant="outlined" context-color="primary" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="outlined" context-color="primary" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With error" variant="outlined" context-color="primary" error="Something went wrong" />
        <NtpTextInput label="With error" variant="outlined" context-color="primary" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Disabled" variant="outlined" context-color="primary" disabled />
        <NtpTextInput label="Disabled" variant="outlined" context-color="primary" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Readonly" variant="outlined" context-color="primary" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="outlined" context-color="primary" readonly model-value="Readonly value" />
      </div>
      </div>
    `,
  }),
}

export const OnSecondaryContext: Story = {
  render: () => ({
    components: { NtpTextInput },
    template: `
      <H1>Filled</H1>
      <div style="background-color: hsl(48, 11%, 40%); border-radius: 12px; padding: 12px;">
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Filled input" variant="filled" context-color="secondary" />
        <NtpTextInput label="Filled input" variant="filled" context-color="secondary" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With hint" variant="filled" context-color="secondary" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="filled" context-color="secondary" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With error" variant="filled" context-color="secondary" error="Something went wrong" />
        <NtpTextInput label="With error" variant="filled" context-color="secondary" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Disabled" variant="filled" context-color="secondary" disabled />
        <NtpTextInput label="Disabled" variant="filled" context-color="secondary" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Readonly" variant="filled" context-color="secondary" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="filled" context-color="secondary" readonly model-value="Readonly value" />
      </div>
      </div>

      <H1>Outlined</H1>
      <div style="background-color: hsl(48, 11%, 40%); border-radius: 12px; padding: 12px;">
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Outlined input" variant="outlined" context-color="secondary" />
        <NtpTextInput label="Outlined input" variant="outlined" context-color="secondary" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With hint" variant="outlined" context-color="secondary" hint="Supporting text goes here" />
        <NtpTextInput label="With hint" variant="outlined" context-color="secondary" hint="Supporting text goes here" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="With error" variant="outlined" context-color="secondary" error="Something went wrong" />
        <NtpTextInput label="With error" variant="outlined" context-color="secondary" error="Something went wrong" model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Disabled" variant="outlined" context-color="secondary" disabled />
        <NtpTextInput label="Disabled" variant="outlined" context-color="secondary" disabled model-value="Some text" />
      </div>
      <div class="ntp-my-2" style="display: flex; flex-direction: row; gap: 24px;">
        <NtpTextInput label="Readonly" variant="outlined" context-color="secondary" readonly model-value="" />
        <NtpTextInput label="Readonly" variant="outlined" context-color="secondary" readonly model-value="Readonly value" />
      </div>
      </div>
    `,
  }),
}