import type { ErrorResponse } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'
import { toConstantCase } from '@unshared/string'
import { createError } from '../../../utils'

export async function onResponseError(context: TextGeneration.Context): Promise<never> {
  const { provider, response } = context
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  const { statusText, status } = response
  const text = await response.text()

  // --- Try extracting the error message from the response.
  let type: string | undefined
  let message: string
  try {
    const data = JSON.parse(text) as ErrorResponse
    type = data.error.type
    message = data.error.message
  }
  catch {
    message = text || statusText
  }

  // --- Throw an error with the extracted message.
  throw createError({
    name: toConstantCase('E', provider.provider.name, type ?? statusText),
    message,
    context: { statusText, status, type },
  })
}
