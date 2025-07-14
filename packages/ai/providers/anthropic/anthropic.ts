import { defineProvider } from '../../utils/defineProvider'
import { onRequestChat } from './onRequestChat'
import { onResponseChat } from './onResponseChat'
import { onResponseModels } from './onResponseModels'

export const anthropic = defineProvider({
  name: 'anthropic',
  baseUrl: 'https://api.anthropic.com/v1',
  parameters: {
    apiKey: {
      path: 'X-API-Key',
      location: 'header',
      schema: {
        type: 'string',
        required: true,
        default: process.env.ANTHROPIC_API_KEY,
      },
    },
    version: {
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
    betas: {
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
  },
  chat: {
    path: '/messages',
    onRequest: onRequestChat,
    onResponse: onResponseChat,
    parameters: {
      maxTokens: {
        path: 'max_tokens',
        location: 'body',
        schema: { type: 'integer', default: 4096 },
      },
      serviceTier: {
        path: 'service_tier',
        location: 'body',
        schema: {
          type: 'string',
          default: 'auto',
          enum: ['standard_only', 'auto'],
        },
      },
      stopSequences: {
        path: 'stop_sequences',
        location: 'body',
        schema: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      stream: {
        location: 'body',
        schema: { type: 'boolean', default: true },
      },
      temperature: {
        location: 'body',
        schema: { type: 'number', minimum: 0, maximum: 1 },
      },
      thinking: {
        path: 'thinking.type',
        location: 'body',
        schema: {
          type: 'string',
          enum: [
            'enabled',
            'disabled',
          ],
        },
      },
      thinkingBudget: {
        path: 'thinking.budget_tokens',
        location: 'body',
        schema: { type: 'integer', minimum: 1024 },
      },
    },
  },
  models: {
    path: '/models',
    onResponse: onResponseModels,
    parameters: {
      beforeId: {
        path: 'before_id',
        location: 'query',
        schema: { type: 'string' },
      },
      afterId: {
        path: 'after_id',
        location: 'query',
        schema: { type: 'string' },
      },
      limit: {
        location: 'query',
        schema: { type: 'integer', default: 20, minimum: 1, maximum: 1000 },
      },
    },
  },
} as const)
