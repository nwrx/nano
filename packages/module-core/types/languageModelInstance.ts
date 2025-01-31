import { defineType } from '@nwrx/core'
import { assertFunction, assertStringNotEmpty, assertUndefined, createParser } from '@unshared/validation'

/** The context that is passed in the model inference process. */
export interface LanguageModelInferenceContext {
  prompt: string
  seed?: number
  stop?: string
  temperature?: number
  maxCompletionTokens?: number
}

export interface LanguageModelInferenceResponse {
  completion: string
  fingerprint: string
  tokensTotal: number
  tokensPrompt: number
  tokensCompletion: number
}

/** A function that returns the body of a request that should be sent to the model API. */
export type LanguageModelGetBody = (context: LanguageModelInferenceContext) => Record<string, any>

/** A function that returns the completion from the response of the model API. */
export type LanguageModelGetCompletion = (response: any) => LanguageModelInferenceResponse

/**
 * The `nwrx/lm-model` flow type represents an instance of a language model used to infer completions
 * of text. The values bearing this type are passed to the `nwrx/inference` flow node to generate
 * completions based on some input text.
 */
export const languageModelInstance = defineType({
  kind: 'language-model-instance',
  name: 'LM Model',
  color: '#5636D9',
  description: 'An instance of a language model used to infer completions of text.',
  parse: createParser({

    /**
     * The URL of the model API. It is used to specify the endpoint to which the
     * request should be sent to generate completions.
     *
     * @example 'https://api.openai.com/v1/engines/davinci/completions'
     */
    url: assertStringNotEmpty,

    /**
     * The name of the model. It is used to specify which language model from
     * the API should be used to generate completions. Safe to say it must exist
     * in the API's list of models.
     *
     * @example 'davinci'
     */
    model: assertStringNotEmpty,

    /**
     * The API token used to authenticate with the model API. It is used to
     * authorize the request to generate completions.
     *
     * @example 'sk-1234567890abcdef1234567890abcdef'
     */
    token: [[assertUndefined], [assertStringNotEmpty]],

    /**
     * The function that generates the body of the request to the model API. Since
     * as of now, there is no universal format across all model APIs, this function
     * is used to generate the request body based on the context of the inference.
     *
     * @example ({ prompt }) => ({ model: 'davinci', prompt })
     */
    getBody: assertFunction<LanguageModelGetBody>,

    /**
     * The function that extracts the completion from the response of the model API.
     * Since as of now, there is no universal format across all model APIs, this function
     * is used to extract the completion from the response based on the API's format.
     *
     * @example response => response.choices[0].text
     */
    getCompletion: assertFunction<LanguageModelGetCompletion>,
  }),
})
