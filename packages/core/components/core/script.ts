import { transform } from 'esbuild'
import { wrapInSandbox } from '../../sandbox/wrapInSandbox'
import { defineComponent } from '../../utils/defineComponent'

export const script = defineComponent(
  {
    title: 'Script',
    icon: 'https://api.iconify.design/mdi:script-text-outline.svg',
    description: 'Execute a JavaScript or TypeScript script and return the result.',
    inputs: {
      language: {
        'title': 'Language',
        'description': 'The programming language of the script.',
        'default': 'javascript',
        'enum': [
          'javascript',
          'typescript',
        ] as const,
        'x-enum-labels': [
          'JavaScript',
          'TypeScript',
        ],
        'x-enum-icons': [
          'https://api.iconify.design/logos:javascript.svg',
          'https://api.iconify.design/logos:typescript-icon.svg',
        ],
      },
      code: {
        type: 'string',
        title: 'Code',
        description: 'The code to execute.',
        example: '({ data }) => { return data.value * 2 }',
      },
    },
    outputs: {
      result: {
        title: 'Result',
        description: 'The result of the script execution.',
        oneOf: [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
      },
    },
  },
  async({ data }) => {
    const { language, code } = data

    if (language === 'typescript') {
      const transformed = await transform(code, { loader: 'ts' })
      const sandboxed = await wrapInSandbox(transformed.code)
      const result = await sandboxed({ data }) as any[]
      return { result }
    }

    if (language === 'javascript') {
      const sandboxed = await wrapInSandbox(code)
      const result = await sandboxed({ data }) as any[]
      return { result }
    }

    throw new Error('Unsupported language')
  },
)
