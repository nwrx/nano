import type { StorybookConfig } from '@nuxtjs/storybook'
import type { InlineConfig, UserConfig } from 'vite'
import { mergeConfig } from 'vite'

export default {
  framework: '@storybook-vue/nuxt',
  stories: [
    '../components/**/*.mdx',
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  // docs: {
  //   autodocs: 'tag',
  // },
  core: {
    disableTelemetry: true,
  },
  viteFinal: config => mergeConfig<InlineConfig, UserConfig>(config, {
    plugins: [
      {
        name: 'force-reload-on-specific-files',
        handleHotUpdate: ({ file, server }) => {
          const isStory = /\.stories\.(js|jsx|mjs|ts|tsx)$/i.test(file)
          const isConfig = file.includes('/.storybook/')
          const isMdx = /\/components\/.*\.mdx$/.test(file)
          if (isStory || isMdx || isConfig) server.hot.send({ type: 'full-reload' })
        },
      },
    ],
  }),
} satisfies StorybookConfig
