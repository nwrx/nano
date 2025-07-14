import type { ErrorObject } from 'openai/resources'
import type { Provider } from '../../utils'
import { toConstantCase } from '@unshared/string'
import { createError } from '../../utils'

export interface OnResponseErrorContext {
  response?: Response
  provider: Provider
}

export async function onResponseError(context: OnResponseErrorContext): Promise<never> {
  const { response, provider } = context
  if (!response) throw new Error('Expected the "response" property to be set on the context.')
  const { statusText, status } = response
  const text = await response.text()

  // --- Try extracting the error message from the response.
  let error: ErrorObject | undefined = undefined
  try {
    const data = JSON.parse(text) as { error: ErrorObject }
    error = data.error
    console.error(error)
  }
  catch { /** Ignore */ }

  // --- Throw an error with the extracted message.
  throw createError({
    name: toConstantCase('E', provider.name, error?.code ?? statusText),
    message: error?.message ?? text ?? statusText,
    context: { statusText, status, ...error },
  })
}
