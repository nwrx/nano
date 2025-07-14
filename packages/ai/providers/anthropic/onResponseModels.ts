import type { ModelInfosPage } from '@anthropic-ai/sdk/resources'
import type { Models } from '../../models'
import { onResponseError } from './onResponseError'

/**
 * Handles the response from the Anthropic API when requesting available models.
 * It extracts model information and returns it in a standardized format.
 *
 * @param context The context containing the response and request information.
 * @returns A promise that resolves to a Models.Result containing the list of models.
 */
export async function onResponseModels(context: Models.Context): Promise<Models.Result> {
  const { response, request } = context
  if (!response) throw new Error('Response is not defined in the context')
  if (!response.ok) return onResponseError(request)

  // --- Map the response data to the Models.Result format.
  const data = await response.json() as ModelInfosPage
  const models = data.data.map<Models.Model>(model => ({
    name: model.id,
    title: model.display_name,
    createdAt: model.created_at,
    features: model.type === 'model' ? ['chat'] : [],
  }))

  // --- Return the models in the expected format.
  return { models }
}
