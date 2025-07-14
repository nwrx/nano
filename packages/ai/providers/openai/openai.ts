import { defineProvider } from '../../utils/defineProvider'
import { onRequestChat } from './onRequestChat'
import { onRequestEmbeddings } from './onRequestEmbeddings'
import { onRequestImage } from './onRequestImage'
import { onRequestSpeech } from './onRequestSpeech'
// import { onRequestTranscript } from './onRequestTranscript'
import { onResponseChat } from './onResponseChat'
import { onResponseEmbeddings } from './onResponseEmbeddings'
import { onResponseImage } from './onResponseImage'
import { onResponseModels } from './onResponseModels'
import { onResponseSpeech } from './onResponseSpeech'
// import { onResponseTranscript } from './onResponseTranscript'

/** OpenAI provider. */
export type OpenAI = typeof openai

/** OpenAI provider. */
export const openai = defineProvider({
  name: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  parameters: {
    apiKey: {
      path: 'Authorization',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.OPENAI_API_KEY,
      },
    },
    project: {
      path: 'OpenAI-Project',
      location: 'header',
      schema: {
        type: 'string',
        default: process.env.OPENAI_PROJECT,
      },
    },
    organization: {
      path: 'OpenAI-Organization',
      location: 'header',
      schema: {
        type: 'string',
        default: process.env.OPENAI_ORGANIZATION,
      },
    },
  },
  chat: {
    path: '/chat/completions',
    onRequest: onRequestChat,
    onResponse: onResponseChat,
    parameters: {
      stream: {
        location: 'body',
        schema: { type: 'boolean', default: true },
      },
      modalities: {
        location: 'body',
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['text', 'image', 'audio'],
          },
        },
      },
    },
  },
  embeddings: {
    path: '/embeddings',
    onRequest: onRequestEmbeddings,
    onResponse: onResponseEmbeddings,
    parameters: {
      format: {
        path: 'encoding_format',
        location: 'body',
        schema: {
          type: 'string',
          enum: ['float', 'base64'],
          default: 'float',
        },
      },
      dimensions: {
        location: 'body',
        schema: {
          type: 'integer',
          minimum: 1,
          description: 'Number of dimensions for the embeddings (only supported by text-embedding-3-* models)',
        },
      },
    },
  },
  image: {
    path: '/images/generations',
    onRequest: onRequestImage,
    onResponse: onResponseImage,
    parameters: {
      prompt: {
        location: 'body',
        schema: {
          type: 'string',
          maxLength: 32000, // For gpt-image-1
          minLength: 1,
        },
      },
      background: {
        location: 'body',
        schema: {
          type: 'string',
          enum: ['transparent', 'opaque', 'auto'],
          default: 'auto',
        },
      },
      moderation: {
        location: 'body',
        schema: {
          type: 'string',
          enum: ['low', 'auto'],
          default: 'auto',
        },
      },
      count: {
        path: 'n',
        location: 'body',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: 1,
        },
      },
      compression: {
        path: 'output_compression',
        location: 'body',
        schema: {
          type: 'integer',
          minimum: 0,
          maximum: 100,
          default: 100,
        },
      },
      format: {
        path: 'output_format',
        location: 'body',
        schema: {
          type: 'string',
          enum: ['png', 'jpeg', 'webp'],
          default: 'png',
        },
      },
      quality: {
        location: 'body',
        schema: {
          type: 'string',
          enum: ['standard', 'hd', 'low', 'medium', 'high', 'auto'],
          default: 'auto',
        },
      },
      responseFormat: {
        path: 'response_format',
        location: 'body',
        schema: {
          type: 'string',
          enum: ['url', 'b64_json'],
          default: 'b64_json',
        },
      },
      size: {
        location: 'body',
        schema: {
          type: 'string',
          enum: [
            'auto',
            '1024x1024',
            '1536x1024',
            '1024x1536',
            '256x256',
            '512x512',
            '1792x1024',
            '1024x1792',
          ],
          default: 'auto',
        },
      },
      style: {
        location: 'body',
        schema: {
          type: 'string',
          enum: ['vivid', 'natural'],
          default: 'vivid',
        },
      },
    },
  },
  models: {
    path: '/models',
    onResponse: onResponseModels,
  },
  speech: {
    path: '/audio/speech',
    onRequest: onRequestSpeech,
    onResponse: onResponseSpeech,
    parameters: {
      voice: {
        location: 'body',
        schema: {
          type: 'string',
          required: true,
          enum: [
            'alloy',
            'ash',
            'ballad',
            'coral',
            'echo',
            'fable',
            'onyx',
            'nova',
            'sage',
            'shimmer',
            'verse',
          ],
        },
      },
      instructions: {
        location: 'body',
        schema: {
          type: 'string',
          maxLength: 1000,
        },
      },
      responseFormat: {
        path: 'response_format',
        location: 'body',
        schema: {
          type: 'string',
          enum: ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'],
          default: 'mp3',
        },
      },
      speed: {
        location: 'body',
        schema: {
          type: 'number',
          minimum: 0.25,
          maximum: 4,
          default: 1,
        },
      },
      streamFormat: {
        path: 'stream_format',
        location: 'body',
        schema: {
          type: 'string',
          enum: ['sse', 'audio'],
        },
      },
    },
  },
  // transcript: {
  //   path: '/audio/transcriptions',
  //   onRequest: onRequestTranscript,
  //   onResponse: onResponseTranscript,
  //   parameters: {
  //     language: {
  //       location: 'body',
  //       schema: {
  //         type: 'string',
  //         description: 'ISO-639-1 language code (e.g., "en", "es", "fr")',
  //       },
  //     },
  //     responseFormat: {
  //       path: 'response_format',
  //       location: 'body',
  //       schema: {
  //         type: 'string',
  //         enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
  //         default: 'json',
  //       },
  //     },
  //     temperature: {
  //       location: 'body',
  //       schema: {
  //         type: 'number',
  //         minimum: 0,
  //         maximum: 1,
  //         default: 0,
  //       },
  //     },
  //     granularities: {
  //       path: 'timestamp_granularities',
  //       location: 'body',
  //       schema: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           enum: ['word', 'segment'],
  //         },
  //       },
  //     },
  //   },
  // },
} as const)
