import type { ImageGenerateParams } from 'openai/resources'
import type { Image } from '../../image'

/**
 * Prepares the request for image generation by setting the request body
 * according to the OpenAI API specifications.
 *
 * @param context The context for the image generation request.
 */
export function onRequestImage(context: Image.Context): void {
  context.init.body = JSON.stringify({
    model: context.request.model,
    prompt: context.request.prompt,
  } as ImageGenerateParams)
}
