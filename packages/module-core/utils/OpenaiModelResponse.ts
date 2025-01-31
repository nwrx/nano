export interface OpenaiModelResponse {
  object: 'list'

  /** The list of models. */
  data: OpenaiModelObject[]
}

export interface OpenaiModelObject {

  /** The model identifier, which can be referenced in the API endpoints. */
  id: string

  /** The Unix timestamp (in seconds) when the model was created. */
  created: number

  /** The organization that owns the model. */
  owned_by: string

  /** The object type, which is always "model". */
  object: 'model'
}
