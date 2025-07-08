import { defineProviderOptions } from '../../utils/defineProviderOptions'
import { onRequest } from './onRequest'
import { onResponse } from './onResponse'

export const anthropic = defineProviderOptions({
  name: 'anthropic',
  baseUrl: 'https://api.anthropic.com/v1',
  features: {
    textGeneration: {
      path: '/messages',
      onRequest,
      onResponse,
      parameters: [
        {
          name: 'topK',
          path: 'top_k',
          location: 'body',
          schema: { type: 'integer' },
        },
        {
          name: 'topP',
          path: 'top_p',
          location: 'body',
          schema: { type: 'number' },
        },
        {
          name: 'temperature',
          path: 'temperature',
          location: 'body',
          schema: { type: 'number' },
        },
        {
          name: 'maxTokens',
          path: 'max_tokens',
          location: 'body',
          schema: { type: 'integer', default: 4096 },
        },
        {
          name: 'stopSequences',
          path: 'stop_sequences',
          location: 'body',
          schema: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        {
          name: 'stream',
          path: 'stream',
          location: 'body',
          schema: { type: 'boolean', default: true },
        },
      ],
    },
    searchModels: {
      path: '/models',
      parameters: [
        {
          name: 'beforeId',
          path: 'before_id',
          location: 'query',
          schema: { type: 'string' },
        },
        {
          name: 'afterId',
          path: 'after_id',
          location: 'query',
          schema: { type: 'string' },
        },
        {
          name: 'limit',
          path: 'limit',
          location: 'query',
          schema: { type: 'integer', default: 20, minimum: 1, maximum: 1000 },
        },
      ],
    },
  },
  parameters: [
    {
      name: 'apiKey',
      path: 'X-API-Key',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.ANTHROPIC_API_KEY,
      },
    },
    {
      name: 'version',
      path: 'Anthropic-Version',
      location: 'header',
      schema: {
        type: 'string',
        default: '2023-06-01',
        enum: [
          '2023-06-01',
          '2023-01-01',
        ],
      },
    },
    {
      name: 'betas',
      path: 'Anthropic-Beta',
      location: 'header',
      schema: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'message-batches-2024-09-24',
            'prompt-caching-2024-07-31',
            'computer-use-2024-10-22',
            'computer-use-2025-01-24',
            'pdfs-2024-09-25',
            'token-counting-2024-11-01',
            'token-efficient-tools-2025-02-19',
            'output-128k-2025-02-19',
            'files-api-2025-04-14',
            'mcp-client-2025-04-04',
            'dev-full-thinking-2025-05-14',
            'interleaved-thinking-2025-05-14',
            'code-execution-2025-05-22',
            'extended-cache-ttl-2025-04-11',
          ],
        },
      },
    },
  ],
})
