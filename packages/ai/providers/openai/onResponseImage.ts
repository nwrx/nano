import type { ImagesResponse } from 'openai/resources'
import type { Image } from '../../image'
import { onResponseError } from './onResponseError'

export async function onResponseImage(context: Image.Context): Promise<Image.Result[]> {
  const { response, provider } = context
  if (!response) throw new Error('No response received from OpenAI API')
  if (!response.ok) return onResponseError({ response, provider })
  const data = await response.json() as ImagesResponse

  // --- Assert `data` has the expected structure.
  if (!data || !Array.isArray(data.data) || data.data.length === 0)
    throw new Error('Invalid response structure from OpenAI API: Expected an array of images')

  // --- Map the response data to the expected ImageGeneration.Result format.
  return data.data.map<Image.Result | undefined>((image) => {
    let mediaType: string
    if (data.output_format === 'jpeg') mediaType = 'image/jpeg'
    else if (data.output_format === 'png') mediaType = 'image/png'
    else if (data.output_format === 'webp') mediaType = 'image/webp'
    else mediaType = 'image/png' // Default to PNG if unknown
    if (image.url) {
      return {
        type: 'url',
        url: image.url,
        mediaType,
        internalPrompt: image.revised_prompt,
        usage: {
          inputTokens: data.usage?.input_tokens ?? 0,
          outputTokens: data.usage?.output_tokens ?? 0,
          imageTokens: data.usage?.input_tokens_details.image_tokens ?? 0,
          textTokens: data.usage?.input_tokens_details.text_tokens ?? 0,
          get totalTokens() {
            return this.inputTokens + this.outputTokens
          },
        },
      }
    }
    else if (image.b64_json) {
      return {
        type: 'base64',
        data: image.b64_json,
        mediaType,
        internalPrompt: image.revised_prompt,
        usage: {
          inputTokens: data.usage?.input_tokens ?? 0,
          outputTokens: data.usage?.output_tokens ?? 0,
          imageTokens: data.usage?.input_tokens_details.image_tokens ?? 0,
          textTokens: data.usage?.input_tokens_details.text_tokens ?? 0,
          get totalTokens() {
            return this.inputTokens + this.outputTokens
          },
        },
      }
    }
    else {
      // eslint-disable-next-line array-callback-return
      return
    }
  })
    .filter((image): image is Image.Result => image !== undefined)
}
