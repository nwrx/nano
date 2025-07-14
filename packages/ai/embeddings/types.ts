import type { Provider, ProviderFeatureOptions } from '../utils'

export namespace Embeddings {
  export interface Request<T extends Provider = Provider> {
    id?: string
    model: string
    input: string | string[]
    options?: ProviderFeatureOptions<T, 'embeddings'>
    signal?: AbortSignal
  }

  export interface Context<T extends Provider = Provider> {
    id: string
    provider: T
    request: Request<T>
    url: URL
    init: RequestInit
    response?: Response
  }

  export interface Usage {
    promptTokens?: number
    totalTokens?: number
  }

  export interface Result {
    embeddings: number[][]
    usage?: Usage
  }
}
