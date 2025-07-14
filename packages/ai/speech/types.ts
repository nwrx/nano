import type { UUID } from 'node:crypto'
import type { Provider, ProviderFeatureOptions } from '../utils'

export namespace Speech {
  export interface Request<T extends Provider = Provider> {
    id?: UUID
    model: string
    input: string
    options?: ProviderFeatureOptions<T, 'speech'>
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
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
  }

  export interface ResultRawUrl {
    type: 'url'
    url: string
    mediaType: string
    usage?: Usage
  }

  export interface ResultRawBase64 {
    type: 'base64'
    data: string
    mediaType: string
    usage?: Usage
  }

  export interface Result {
    getStream(): ReadableStream<Uint8Array>
    getMediaType(): Promise<string>
    getBase64(): Promise<string>
    getBase64Url(): Promise<string>
    getBuffer(): Promise<Buffer>
    getFile(): Promise<File>
    getUsage(): Promise<Usage>
  }
}
