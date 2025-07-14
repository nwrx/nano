export namespace Together {
  export type ModelType =
    | 'audio'
    | 'chat'
    | 'embedding'
    | 'image'
    | 'language'
    | 'moderation'
    | 'rerank'
    | 'transcribe'

  export interface ModelConfig {
    chat_template?: string
    stop?: string[]
    bos_token?: string
    eos_token?: string
  }

  export interface ModelPricing {
    hourly: number
    input: number
    output: number
    base: number
    finetune: number
  }

  export interface Model {
    id: string
    object: 'model'
    created: number
    type: ModelType
    running: boolean
    display_name: string
    organization: string
    link: string
    license: string
    context_length: number
    config: ModelConfig
    pricing: ModelPricing
  }
}
