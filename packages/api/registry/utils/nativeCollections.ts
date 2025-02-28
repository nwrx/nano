import type { RegistryCollection } from '../entities'
import { dedent } from '@unshared/string'

export type NativeCollections = Record<string, Partial<RegistryCollection>>
export type NativeCollectionName = keyof typeof NATIVE_COLLECTIONS

export const NATIVE_COLLECTIONS = {
  core: {
    title: 'Core',
    icon: '/favicon-196x196.png',
    description: 'Core platform components.',
    isPublic: true,
  },
  openai: {
    title: 'OpenAI',
    icon: '',
    description: 'OpenAI API integration components.',
    isPublic: true,
  },
  anthropic: {
    title: 'Anthropic',
    icon: 'https://cdn.edi-static.fr/image/upload/c_scale,dpr_auto,f_auto,q_auto,w_auto/c_limit,w_auto/v1/Img/BREVE/2024/1/400929/Anthropic-cet-anti-OpenAI-qui-veut-voir-choses-autrement-F.jpg',
    description: 'Components for interacting with the Anthropic API.',
    isPublic: true,
  },
  groq: {
    title: 'Groq',
    icon: 'https://cdn.brandfetch.io/idxygbEPCQ/w/201/h/201/theme/dark/icon.png?c=1dxbfHSJFAPEGdCLU4o5B',
    description: 'Components for interacting with the Groq API.',
    isPublic: true,
  },
  mistral: {
    title: 'Mistral',
    icon: 'https://cdn.brandfetch.io/idkGYeU449/w/200/h/200/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B',
    description: 'Components for interacting with the Mistral API.',
    isPublic: true,
    summary: dedent(`
      Mistral is a powerful AI platform that provides LLM models such as \`mistral:7b\` and \`mistral:13b\`. These models deliver
      good performance in natural language processing tasks, combining efficiency with state-of-the-art capabilities.

      The platform offers both open-source and proprietary models, with various sizes and specializations to suit different use cases. Mistral's APIs provide easy access to these models, allowing developers to integrate advanced AI capabilities into their applications with minimal effort.
    `),
  },
} as const satisfies NativeCollections
