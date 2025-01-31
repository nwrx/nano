import type { Preview } from '@nuxtjs/storybook'
import { theme } from './theme'

export const ICONS_OPTIONS = [
  'i-carbon:user',
  'i-carbon:settings',
  'i-carbon:help',
  'i-carbon:notification',
]

const ICON_LABELS = {
  '': 'None',
  'i-carbon:user': 'User',
  'i-carbon:settings': 'Settings',
  'i-carbon:help': 'Help',
  'i-carbon:notification': 'Notification',
}

export default {
  parameters: {
    docs: {
      theme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  argTypes: {
    icon: { options: ICONS_OPTIONS, control: { labels: ICON_LABELS } },
    iconAppend: { options: ICONS_OPTIONS, control: { labels: ICON_LABELS } },
    iconPrepend: { options: ICONS_OPTIONS, control: { labels: ICON_LABELS } },
  },
} as Preview
