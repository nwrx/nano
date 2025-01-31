import type ivm from 'isolated-vm'

/**
 * Provides the TextEncoder class to the isolate.
 *
 * @param isolate The isolate to register the TextEncoder class in.
 * @param context The context to register the TextEncoder class in.
 */
export async function implementTextEncoder(isolate: ivm.Isolate, context: ivm.Context): Promise<void> {
  const script = await isolate.compileScript(`
    class TextEncoder {
      encode(text) {
        const result = []
        for (const char of text) {
          const code = char.codePointAt(0)
          result.push(code)
        }
        return new Uint8Array(result)
      }
    }
  `)
  await script.run(context)
}
