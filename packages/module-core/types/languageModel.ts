import type { MaybePromise, ObjectLike } from '@unshared/types'
import type { InferenceData, InferenceResult } from '../nodes'
import { defineType } from '@nwrx/core'
import { assertFunction, assertStringNotEmpty, createParser } from '@unshared/validation'

/** The context that is passed in the model completion process. */
interface OnDataContext<T, U> {
  body: T
  data: U
  call: (name: string, data: ObjectLike) => Promise<string>
  resume: () => void
}

/** The interface that represents a language model. */
export interface LanguageModel<T = any, U = any> {

  /**
   * The URL of the model API. It is used to specify the endpoint to which the
   * request should be sent to generate completions.
   *
   * @example 'https://api.openai.com/v1/engines/davinci/completions'
   */
  url: string

  /**
   * The name of the model. It is used to specify which language model from
   * the API should be used to generate completions. Safe to say it must exist
   * in the API's list of models.
   *
   * @example 'davinci'
   */
  model: string

  /**
   * The API token used to authenticate with the model API. It is used to
   * authorize the request to generate completions.
   *
   * @example 'sk-1234567890abcdef1234567890abcdef'
   */
  token?: string

  /**
   * The function that generates the body of the request to the model API. Since
   * as of now, there is no universal format across all model APIs, this function
   * is used to generate the request body based on the context of the inference.
   *
   * @example ({ prompt }) => ({ model: 'davinci', prompt })
   */
  getBody: (options: InferenceData) => T

  /**
   * The function that extracts the completion from the response of the model API.
   * Since as of now, there is no universal format across all model APIs, this function
   * is used to extract the completion from the response based on the API's format.
   *
   * @example response => response.choices[0].text
   */
  onData: (context: OnDataContext<T, U>) => MaybePromise<InferenceResult | void>

  /**
   * The function that handles non OK responses from the model API. It is used to
   * handle and extract the error message from the response in case of an error.
   * It is optional and can be omitted if not required.
   */
  onError?: (response: Response) => MaybePromise<string>
}

/**
 * The `nwrx/language-model-instance` flow type represents an instance of a language model used to infer completions
 * of text. The values bearing this type are passed to the `nwrx/inference` flow node to generate
 * completions based on some input text.
 */
export const languageModel = defineType({
  kind: 'language-model',
  name: 'Language Model',
  color: '#5636D9',
  description: 'An instance of a language model used to infer completions of text.',
  parse: createParser({
    url: assertStringNotEmpty,
    model: assertStringNotEmpty,
    token: assertStringNotEmpty,
    getBody: assertFunction,
    onData: assertFunction,
    onError: assertFunction,
  }) as (value: unknown) => LanguageModel,
})
