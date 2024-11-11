import { FlowError } from '@nwrx/core'
import { toConstantCase } from '@unshared/string'

export async function openaiOnError(response: Response, prefix = 'OPENAI'): Promise<FlowError> {
  try {
    const data = await response.json() as { error: { message: string } }
    return new FlowError({
      name: toConstantCase(prefix, response.statusText),
      message: data.error.message,
    })
  }
  catch {
    return new FlowError({
      name: toConstantCase(prefix, response.statusText),
      message: response.statusText,
    })
  }
}
