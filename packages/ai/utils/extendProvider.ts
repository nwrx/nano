import type { Provider } from './types'
import { extendProviderFeature } from './extendProviderFeature'

export function extendProvider(source: Provider, target: Partial<Provider>): Provider {
  return {
    ...source,
    ...target,
    parameters: { ...source.parameters, ...target.parameters },
    models: extendProviderFeature(source.models, target.models),
    chat: extendProviderFeature(source.chat, target.chat),
    image: extendProviderFeature(source.image, target.image),
    transcript: extendProviderFeature(source.transcript, target.transcript),
    speech: extendProviderFeature(source.speech, target.speech),
    embeddings: extendProviderFeature(source.embeddings, target.embeddings),
  }
}
