import { ThreadError } from '@nwrx/nano'
import { toConstantCase } from '@unshared/string'

export async function openaiOnError(response: Response, prefix = 'OPENAI'): Promise<ThreadError> {
  try {
    const data = await response.json() as { error: { message: string } }
    return new ThreadError({
      name: toConstantCase(prefix, response.statusText),
      message: data.error.message,
    })
  }
  catch {
    return new ThreadError({
      name: toConstantCase(prefix, response.statusText),
      message: response.statusText,
    })
  }
}
