import type { CreateEmbeddingResponse } from 'openai/resources'
import type { Embeddings } from '../../embeddings'
import { onResponseError } from './onResponseError'

export async function onResponseEmbeddings(context: Embeddings.Context): Promise<Embeddings.Result> {
  const { response, provider } = context
  if (!response) throw new Error('No response available')
  if (!response.ok) return onResponseError({ response, provider })

  // --- Parse the JSON response and extract embeddings.
  const data = await response.json() as CreateEmbeddingResponse
  return {
    embeddings: data.data
      .toSorted((a, b) => a.index - b.index)
      .map(item => item.embedding),
    usage: {
      promptTokens: data.usage.prompt_tokens,
      totalTokens: data.usage.total_tokens,
    },
  }
}
