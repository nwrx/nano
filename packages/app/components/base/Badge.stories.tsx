/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ICONS_OPTIONS } from '~/.storybook/preview'
import Badge from './Badge.vue'

export default {
  title: 'Elements/Badge',
  tags: ['autodocs'],
  component: Badge,
  argTypes: {
    label: {
      type: 'string',
      control: 'text',
      description: 'The text label displayed within the badge.',
      table: { category: 'Content' },
    },
    icon: {
      type: 'string',
      control: 'select',
      description: 'The main icon displayed within the badge.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    iconAppend: {
      type: 'string',
      control: 'select',
      description: 'An additional icon appended to the badge.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    iconPrepend: {
      type: 'string',
      control: 'select',
      description: 'An additional icon prepended to the badge. Alias for `icon`.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    iconLoad: {
      type: 'boolean',
      control: 'boolean',
      description: 'Determines whether to load the icon.',
      table: { category: 'Icon' },
    },
    class: {
      type: 'boolean',
      control: 'check',
      description: 'CSS classes to apply styles such as outlined, soft, or various colors and sizes.',
      table: { category: 'Style' },
      options: [
        'badge-outlined',
        'badge-soft',
        'badge-primary',
        'badge-secondary',
        'badge-success',
        'badge-danger',
        'badge-warning',
        'badge-lg',
      ],
    },
  },
} satisfies Meta<typeof Badge>

/**
 * The `Badge` component is a versatile UI element used to display a label with optional icons.
 * It supports various styles, colors, and sizes to fit different use cases.
 */
export const Default: StoryObj<typeof Badge> = {
  args: {
    label: 'Hello World!',
    icon: undefined,
    iconAppend: undefined,
    iconLoad: false,
    iconPrepend: undefined,
    class: [],
  },
}

/**
 * The `Icon` story demonstrates the use of icons within the `Badge` component.
 * Icons can be appended, prepended, or used as the main icon within the badge.
 */
export const Icon = {
  ...Default,
  render: () => <div class="flex space-x-md">
    <Badge label="User" icon="i-carbon:user" />
    <Badge label="User" icon="i-carbon:user" iconAppend="i-carbon:checkmark" />
    <Badge label="User" icon="i-carbon:checkmark" iconPrepend="i-carbon:user" />
  </div>,
}

/**
 * The `Colors` story showcases the different color options available for the `Badge` component.
 * Use these colors to convey different statuses or categories:
 * - `Primary`: For primary actions or highlights.
 * - `Secondary`: For secondary actions or less prominent highlights.
 * - `Success`: To indicate successful operations or positive statuses.
 * - `Danger`: To highlight errors, warnings, or critical statuses.
 * - `Warning`: To draw attention to cautionary information or warnings.
 */
export const Colors = {
  ...Default,
  render: () => <div class="flex space-x-md">
    <Badge label="Primary" class="badge-primary" />
    <Badge label="Secondary" class="badge-secondary" />
    <Badge label="Success" class="badge-success" />
    <Badge label="Danger" class="badge-danger" />
    <Badge label="Warning" class="badge-warning" />
  </div>,
}

/**
 * The `Outlined` story showcases the outlined style of the `Badge` component.
 * Use the `badge-outlined` class to apply an outlined style, making the badge appear more distinct and prominent.
 */
export const Outlined = {
  ...Default,
  render: () => <div class="flex space-x-md">
    <Badge label="Primary" class="badge-outlined badge-primary" />
    <Badge label="Secondary" class="badge-outlined badge-secondary" />
    <Badge label="Success" class="badge-outlined badge-success" />
    <Badge label="Danger" class="badge-outlined badge-danger" />
    <Badge label="Warning" class="badge-outlined badge-warning" />
  </div>,
}

/**
 * The `Soft` story demonstrates the soft style of the `Badge` component.
 * Use the `badge-soft` class to apply a softer, more subtle style to the badge, ideal for less prominent information.
 */
export const Soft = {
  ...Default,
  render: () => <div class="flex space-x-md">
    <Badge label="Primary" class="badge-soft badge-primary" />
    <Badge label="Secondary" class="badge-soft badge-secondary" />
    <Badge label="Success" class="badge-soft badge-success" />
    <Badge label="Danger" class="badge-soft badge-danger" />
    <Badge label="Warning" class="badge-soft badge-warning" />
  </div>,
}

/**
 * The `Size` story showcases the size variations of the `Badge` component.
 * Use the `badge-lg` class to increase the size of the badge for greater prominence, making it stand out more.
 */
export const Size = {
  ...Default,
  render: () => <div class="flex space-x-md">
    <Badge label="Default" />
    <Badge label="Large" class="badge-lg" />
  </div>,
}
