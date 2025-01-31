/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Meta, StoryObj } from '@nuxtjs/storybook'
import { ICONS_OPTIONS } from '~/.storybook/preview'
import InputText from './InputText.vue'

export default {
  title: 'Elements/InputText',
  // @ts-expect-error: Inference has issues with generic components.
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    label: {
      type: 'string',
      control: 'text',
      description: 'The label for the input field.',
      table: { category: 'Content' },
    },
    hint: {
      type: 'string',
      control: 'text',
      description: 'Hint text displayed below the input field.',
      table: { category: 'Content' },
    },
    iconPrepend: {
      type: 'string',
      control: 'select',
      description: 'Icon prepended to the input field.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    textBefore: {
      type: 'string',
      control: 'text',
      description: 'Text displayed before the input field.',
      table: { category: 'Content' },
    },
    error: {
      type: 'string',
      control: 'text',
      description: 'Error message displayed below the input field.',
      table: { category: 'Content' },
    },
    as: {
      type: 'string',
      control: 'select',
      description: 'The HTML element to render.',
      options: ['input', 'textarea'],
      table: { category: 'Behavior' },
    },
    type: {
      type: 'string',
      control: 'select',
      description: 'The input type.',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      table: { category: 'Behavior' },
    },
    parse: {
      type: 'function',
      control: 'text',
      description: 'Function to parse the input value as a raw value. This will transform the value before it is passed to the model.',
      table: { category: 'Behavior' },
    },
    serialize: {
      type: 'function',
      control: 'text',
      description: 'Function to serialize the input value. This will transform the value before it is displayed.',
      table: { category: 'Behavior' },
    },
    icon: {
      type: 'string',
      control: 'select',
      description: 'Icon displayed within the input field.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    iconAppend: {
      type: 'string',
      control: 'select',
      description: 'Icon appended to the input field.',
      options: ICONS_OPTIONS,
      table: { category: 'Icon' },
    },
    textAfter: {
      type: 'string',
      control: 'text',
      description: 'Text displayed after the input field.',
      table: { category: 'Content' },
    },
    classIcon: {
      type: 'string',
      control: 'text',
      description: 'CSS classes for the icon.',
      table: { category: 'Style' },
    },
    classGroup: {
      type: 'string',
      control: 'text',
      description: 'CSS classes for the input group. This is the prop to use to apply styles to the input field.',
      table: { category: 'Style' },
    },
    classInput: {
      type: 'string',
      control: 'text',
      description: 'CSS classes for the input field.',
      table: { category: 'Style' },
    },
  },
} satisfies Meta<typeof InputText>

export const Default: StoryObj<typeof InputText> = {
  args: {
    label: 'Default Label',
    hint: 'This is a hint',
    icon: undefined,
    iconAppend: undefined,
    iconPrepend: undefined,
    textBefore: '',
    textAfter: '',
    classIcon: '',
    classInput: '',
    classGroup: '',
  },
}

export const WithIcon = {
  ...Default,
  args: {
    icon: 'i-carbon:user',
  },
}

export const WithText = {
  ...Default,
  args: {
    textBefore: 'Before',
    textAfter: 'After',
  },
}
