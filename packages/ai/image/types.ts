import type { Provider, ProviderFeatureOptions } from '../utils'

export namespace Image {
  export interface Request<T extends Provider = Provider> {
    id?: string
    model: string
    prompt: string
    options?: ProviderFeatureOptions<T, 'image'>
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
    inputTokens: number
    outputTokens: number
    totalTokens: number
    imageTokens: number
    textTokens: number
  }

  export interface ResultUrl {
    type: 'url'
    url: string
    mediaType: string
    usage: Usage
    internalPrompt?: string
  }

  export interface ResultBase64 {
    type: 'base64'
    data: string
    mediaType: string
    usage: Usage
    internalPrompt?: string
  }

  export type Result = ResultBase64 | ResultUrl
}
