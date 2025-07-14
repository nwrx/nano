import type { Provider, ProviderFeatureOptions } from '../utils'

export namespace Transcript {
  export interface Request<T extends Provider = Provider> {
    id?: string
    model: string
    file: File | string | Uint8Array // Audio file, binary data, or base64
    options?: ProviderFeatureOptions<T, 'transcript'>
    abortSignal?: AbortSignal
  }

  export interface Context<T extends Provider = Provider> {
    id: string
    request: Request<T>
    provider: Provider
    url: URL
    init: RequestInit
    response?: Response
  }

  export interface Usage {
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
    audioTokens?: number
    textTokens?: number
  }

  export interface TranscriptionSegment {
    id: number
    seek: number
    start: number
    end: number
    text: string
    tokens: number[]
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
  }

  export interface TranscriptionWord {
    word: string
    start: number
    end: number
  }

  export interface ResultText {
    type: 'text'
    text: string
    usage?: Usage
  }

  export interface ResultVerbose {
    type: 'verbose'
    task: string
    language: string
    duration: number
    text: string
    segments?: TranscriptionSegment[]
    words?: TranscriptionWord[]
    usage?: Usage
  }

  export type Result = ResultText | ResultVerbose
}
