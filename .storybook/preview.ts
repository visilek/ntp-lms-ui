import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createRouter, createMemoryHistory } from 'vue-router'

import '../src/_tokens/index.css'
import '../src/_base/index.css'
import '../src/styles/input-shell.css'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
})

setup((app) => {
  app.use(router)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview