import { transform } from 'esbuild'
import { implementFetch, implementHeaders, implementTextDecoder, implementTextEncoder } from '../sandbox'
import { wrapInSandbox } from '../sandbox/wrapInSandbox'
import { defineComponent } from '../utils/defineComponent'

export const script = defineComponent(
  {
    isTrusted: true,
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
      input: {
        'title': 'Input',
        'description': 'The input data for the script.',
        'x-optional': true,
        'oneOf': [
          { type: 'array' },
          { type: 'object' },
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
        ],
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
    const { language, code, input } = data

    // --- Transpile the code if it's TypeScript.
    const transpiled = language === 'typescript'
      ? await transform(code, { loader: 'ts' }).then(result => result.code)
      : code

    // --- Wrap the code in an isolate vm.
    const sandbox = await wrapInSandbox(transpiled)
    await implementFetch(sandbox.isolate, sandbox.context)
    await implementHeaders(sandbox.isolate, sandbox.context)
    await implementTextDecoder(sandbox.isolate, sandbox.context)
    await implementTextEncoder(sandbox.isolate, sandbox.context)

    // --- Execute the script with the input data.
    return { result: await sandbox(input) as string }
  },
)
