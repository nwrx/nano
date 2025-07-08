import type { Base64ImageSource, ContentBlockParam, ImageBlockParam, TextBlockParam } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'
import { ACCEPTED_MEDIA_TYPES } from './constants'

/**
 * Converts a ContentToolResult to an Anthropic content tool result.
 *
 * @param content The ContentToolResult to convert.
 * @returns An Anthropic content tool result.
 * @example
 *
 * // Convert a ContentToolResult to Anthropic content tool result
 * const content = {
 *   toolCallId: '1234',
 *   output: [
 *     { type: 'text', value: 'Hello, world!' },
 *     { type: 'content', value: [{ type: 'text', text: 'Image data' }] }
 *   ]
 * }
 *
 * const anthropicContent = toContentFromContentToolResult(content)
 * console.log(anthropicContent)
 * // {
 * //   type: 'tool_result',
 * //   tool_use_id: '1234',
 * //   is_error: false,
 * //   content: [
 * //     { type: 'text', text: 'Hello, world!' },
 * //     { type: 'text', text: 'Image data' }
 * //   ]
 * // }
 */
export function toContentFromContentToolResult(content: TextGeneration.ContentToolResult): ContentBlockParam {
  const contentItems = content.output.flatMap<ImageBlockParam | TextBlockParam>((item) => {

    // --- If the item is a content type, it may contain text or image data.
    // --- Merge the text and image data into a single array of content items.
    // eslint-disable-next-line unicorn/prefer-ternary
    if (item.type === 'content') {
      return item.value.map<ImageBlockParam | TextBlockParam>((value) => {
        if (value.type === 'text') {
          return {
            type: 'text',
            text: value.text,
          }
        }
        else if (ACCEPTED_MEDIA_TYPES.has(value.mediaType)) {
          return {
            type: 'image',
            source: {
              type: 'base64',
              data: value.data,
              media_type: value.mediaType as Base64ImageSource['media_type'],
            },
          }
        }
        else {
          throw new Error(`Unsupported media type "${value.mediaType}" in content tool result.`)
        }
      })
    }

    // --- Otherwise, treat the item as a text type and optionally serialize nested objects.
    else {
      return {
        type: 'text',
        text: typeof item.value === 'string'
          ? item.value
          : JSON.stringify(item.value),
      }
    }
  })

  return {
    type: 'tool_result',
    tool_use_id: content.toolCallId,
    is_error: content.output.some(x => x.type === 'error-json' || x.type === 'error-text'),
    content: contentItems,
  }
}
