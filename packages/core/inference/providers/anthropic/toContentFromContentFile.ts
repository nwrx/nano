import type { Base64ImageSource, ContentBlockParam } from '@anthropic-ai/sdk/resources'
import type { TextGeneration } from '../../textGeneration'
import { ACCEPTED_MEDIA_TYPES } from './constants'

/**
 * Converts a ContentFile object to an Anthropic content object with type 'image', 'document', or 'text'.
 *
 * @param content The ContentFile object to convert.
 * @returns An Anthropic content object with the appropriate type based on the media type.
 * @example
 *
 * // Create a ContentFile object
 * const content = {
 *   name: 'example.png',
 *   mediaType: 'image/png',
 *   data: new Uint8Array([ ... ])
 * };
 *
 * // Convert to Anthropic content
 * const anthropicContent = toContentFromContentFile(content);
 * console.log(anthropicContent);
 * // {
 * //   type: 'image',
 * //   source: {
 * //     type: 'base64',
 * //     media_type: 'image/png',
 * //     data: '...' // base64 encoded data
 * //   }
 * // }
 */
export function toContentFromContentFile(content: TextGeneration.ContentFile): ContentBlockParam {
  if (ACCEPTED_MEDIA_TYPES.has(content.mediaType)) {
    return {
      type: 'image',
      source: content.data instanceof URL
        ? { type: 'url', url: content.data.toString() }
        : {
          type: 'base64',
          media_type: content.mediaType as Base64ImageSource['media_type'],
          data: content.data instanceof Uint8Array
            ? Buffer.from(content.data).toString('base64')
            : content.data,
        },
    }
  }
  else if (content.mediaType.startsWith('text/plain')) {
    return {
      type: 'document',
      title: content.name,
      source: content.data instanceof URL
        ? { type: 'url', url: content.data.toString() }
        : {
          type: 'text',
          media_type: 'text/plain',
          data: content.data instanceof Uint8Array
            ? Buffer.from(content.data).toString('utf8')
            : content.data,
        },
    }
  }
  else if (content.mediaType.startsWith('application/pdf')) {
    return {
      type: 'document',
      title: content.name,
      source: content.data instanceof URL
        ? { type: 'url', url: content.data.toString() }
        : {
          type: 'base64',
          media_type: 'application/pdf',
          data: content.data instanceof Uint8Array
            ? Buffer.from(content.data).toString('base64')
            : content.data,
        },
    }
  }
  throw new Error(`Unsupported media type "${content.mediaType}" in content file.`)
}
