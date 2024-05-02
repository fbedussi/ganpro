import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3500',
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
})
