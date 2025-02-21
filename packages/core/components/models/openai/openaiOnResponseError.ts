import type { OpenAI } from './types'
import { toConstantCase } from '@unshared/string'
import { createError } from '../../../utils'

export async function openaiOnResponseError(response: Response, provider = 'OPENAI'): Promise<never> {
  const { statusText, status } = response
  const text = await response.text()

  // --- Try extracting the error message from the response.
  let message: string
  try {
    const data = JSON.parse(text) as OpenAI.ErrorResponse
    message = data.error.message
  }
  catch {
    message = text || statusText
  }

  // --- Throw an error with the extracted message.
  throw createError({
    name: toConstantCase('e', provider, statusText),
    message,
    context: { statusText, status },
  })
}
