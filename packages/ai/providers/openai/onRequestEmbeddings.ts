import type { EmbeddingCreateParams } from 'openai/resources'
import type { Embeddings } from '../../embeddings'

/**
 * Prepares the request for embeddings by setting the request body
 * according to the OpenAI API specifications.
 *
 * @param context The context for the embeddings request.
 */
export function onRequestEmbeddings(context: Embeddings.Context): void {
  context.init.body = JSON.stringify({
    model: context.request.model,
    input: context.request.input,
  } as EmbeddingCreateParams)
}
