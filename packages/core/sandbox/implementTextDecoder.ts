import type ivm from 'isolated-vm'

/**
 * Provides the TextDecoder class to the isolate.
 *
 * @param isolate The isolate to register the TextDecoder class in.
 * @param context The context to register the TextDecoder class in.
 */
export async function implementTextDecoder(isolate: ivm.Isolate, context: ivm.Context): Promise<void> {
  const script = await isolate.compileScript(`
    class TextDecoder {
      decode(buffer) {
        const result = []
        for (const byte of buffer) {
          const code = byte & 0xFF
          result.push(code)
        }
        return String.fromCodePoint(...result)
      }
    }
  `)
  await script.run(context)
}
