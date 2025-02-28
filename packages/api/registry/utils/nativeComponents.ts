/* eslint-disable sonarjs/no-duplicate-string */
import type { components } from '@nwrx/nano/components'
import type { RegistryComponent } from '../entities'
import type { NativeCategoryName } from './nativeCategories'
import type { NativeCollectionName } from './nativeCollections'

export type NativeComponents = Record<keyof typeof components, Partial<Omit<RegistryComponent, 'categories' | 'collection'>> & {
  collection: NativeCollectionName
  categories: NativeCategoryName[]
}>

export const NATIVE_COMPONENTS = {
  // Control
  input: {
    title: 'Input',
    icon: 'https://api.iconify.design/carbon:port-input.svg',
    description: 'A simple input control that allows the user to enter text.',
    categories: ['control', 'built-by-nanoworks'],
    collection: 'core',
  },
  output: {
    title: 'Output',
    icon: 'https://api.iconify.design/carbon:port-output.svg',
    description: 'A simple output control that displays text.',
    categories: ['control', 'built-by-nanoworks'],
    collection: 'core',
  },
  ask: {
    title: 'Ask',
    icon: 'https://api.iconify.design/carbon:help.svg',
    description: 'Ask for user input and await the response. This will interrupt the flow until the user provides a response.',
    categories: ['control', 'built-by-nanoworks'],
    collection: 'core',
  },
  confirm: {
    title: 'Confirm',
    icon: 'https://api.iconify.design/carbon:checkmark-outline-warning.svg',
    description: 'Ask for user confirmation and await the response. This will interrupt the flow until the user provides a response.',
    categories: ['control', 'built-by-nanoworks'],
    collection: 'core',
  },
  gate: {
    title: 'Gate',
    icon: 'https://api.iconify.design/carbon:plug.svg',
    description: 'Routes a value based on a condition.',
    categories: ['control', 'built-by-nanoworks'],
    collection: 'core',
  },

  // Processing
  inference: {
    title: 'Inference',
    icon: 'https://api.iconify.design/carbon:ai-label.svg',
    description: 'Inference processing provider. Inference provides powerful processing capabilities for a variety of use cases.',
    categories: ['processing', 'built-by-nanoworks', 'llm'],
    collection: 'core',
  },
  client: {
    title: 'Client',
    icon: 'https://api.iconify.design/carbon:http.svg',
    description: 'Client processing provider. Client provides powerful processing capabilities for a variety of use cases.',
    categories: ['processing', 'built-by-nanoworks'],
    collection: 'core',
  },
  stringify: {
    title: 'Stringify',
    icon: 'https://api.iconify.design/carbon:string-text.svg',
    description: 'Stringify processing provider. Stringify provides powerful processing capabilities for a variety of use cases.',
    categories: ['processing', 'built-by-nanoworks'],
    collection: 'core',
  },
  parse: {
    title: 'Parse',
    icon: 'https://api.iconify.design/carbon:object.svg',
    description: 'Parse processing provider. Parse provides powerful processing capabilities for a variety of use cases.',
    categories: ['processing', 'built-by-nanoworks'],
    collection: 'core',
  },
  template: {
    title: 'Template',
    icon: 'https://api.iconify.design/carbon:prompt-template.svg',
    description: 'Template processing provider. Template provides powerful processing capabilities for a variety of use cases.',
    categories: ['processing', 'built-by-nanoworks'],
    collection: 'core',
  },

  // Models
  anthropic: {
    title: 'Anthropic',
    icon: 'https://api.iconify.design/carbon:models.svg',
    description: 'Anthropic LLM model provider. Anthropic provides powerful LLM models for a variety of use cases.',
    categories: ['models', 'built-by-nanoworks', 'llm'],
    collection: 'anthropic',
  },
  openai: {
    title: 'OpenAI',
    icon: 'https://api.iconify.design/carbon:models.svg',
    description: 'OpenAI LLM model provider. OpenAI provides powerful LLM models for a variety of use cases.',
    categories: ['models', 'built-by-nanoworks', 'llm'],
    collection: 'openai',
  },
  groq: {
    title: 'Groq',
    icon: 'https://api.iconify.design/carbon:processing.svg',
    description: 'Groq processing provider. Groq provides powerful processing capabilities for a variety of use cases.',
    categories: ['models', 'built-by-nanoworks', 'llm'],
    collection: 'groq',
  },
  mistralai: {
    title: 'MistralAI',
    icon: 'https://api.iconify.design/carbon:models.svg',
    description: 'MistralAI LLM model provider. MistralAI provides powerful LLM models for a variety of use cases.',
    categories: ['models', 'built-by-nanoworks', 'llm'],
    collection: 'mistral',
  },

  // Storage
  messages: {
    title: 'Messages',
    icon: 'https://api.iconify.design/carbon:storage.svg',
    description: 'Messages storage provider. Messages provides powerful storage capabilities for a variety of use cases.',
    categories: ['storage', 'built-by-nanoworks'],
    collection: 'core',
  },
} as const satisfies Partial<NativeComponents>
