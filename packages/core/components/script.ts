import { transform } from 'esbuild'
import { implementFetch, implementHeaders, implementTextDecoder, implementTextEncoder } from '../sandbox'
import { wrapInSandbox } from '../sandbox/wrapInSandbox'
import { defineComponent } from '../utils/defineComponent'

export const script = defineComponent(
  {
    isTrusted: true,
    name: 'script',
    purpose: 'processing',
    icon: 'carbon:code',
    title: {
      en: 'Script',
      fr: 'Script',
      de: 'Skript',
      es: 'Script',
      zh: '脚本',
    },
    description: {
      en: 'Execute JavaScript or TypeScript code in a sandboxed environment.',
      fr: 'Exécuter du code JavaScript ou TypeScript dans un environnement isolé.',
      de: 'JavaScript- oder TypeScript-Code in einer Sandbox-Umgebung ausführen.',
      es: 'Ejecutar código JavaScript o TypeScript en un entorno aislado.',
      zh: '在沙箱环境中执行JavaScript或TypeScript代码。',
    },
    inputs: {
      language: {
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
          'logos:javascript',
          'logos:typescript-icon',
        ],
      },
      code: {
        type: 'string',
      },
      input: {
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
