import type { Anthropic } from './types'
import { toConstantCase } from '@unshared/string'
import { createError } from '../../../utils'

export async function anthropicOnResponseError(response: Response): Promise<never> {
  const { statusText, status } = response
  const text = await response.text()

  // --- Try extracting the error message from the response.
  let message: string
  try {
    const data = JSON.parse(text) as Anthropic.ErrorResponse
    message = data.error.message
  }
  catch {
    message = text || statusText
  }

  // --- Throw an error with the extracted message.
  throw createError({
    name: toConstantCase('e', 'anthropic', statusText),
    message,
    context: { statusText, status },
  })
}
