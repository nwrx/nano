import type { InferSchema, Schema } from '../../../utils'

/** An abstract representation of a message in a language model. */
export type LanguageModelMessage = InferSchema<typeof languageModelMessageSchema>

/** The schema for a language model message. */
export const languageModelMessageSchema = {
  type: 'object',
  oneOf: [
    {
      type: 'object',
      required: ['role', 'content'],
      properties: {
        role: {
          type: 'string',
          enum: ['user', 'assistant', 'system'],
        },
        type: {
          type: 'string',
        },
        content: {
          oneOf: [
            { 'x-type': 'file' },
            { 'x-type': 'stream' },
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array' },
            { type: 'object' },
          ],
        },
      },
    },
    {
      type: 'object',
      required: ['role', 'content', 'id', 'name', 'input'],
      properties: {
        role: {
          type: 'string',
          enum: ['tool_request'],
        },
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        input: {
          type: 'object',
        },
      },
    },
    {
      type: 'object',
      required: ['role', 'content', 'id', 'result'],
      properties: {
        role: {
          type: 'string',
          enum: ['tool_result'],
        },
        id: {
          type: 'string',
        },
        result: {
          type: 'object',
        },
      },
    },
    {
      type: 'object',
      required: ['role', 'content', 'id', 'error'],
      properties: {
        role: {
          type: 'string',
          enum: ['tool_result'],
        },
        id: {
          type: 'string',
        },
        error: {
          type: 'string',
        },
      },
    },
  ],
} as const satisfies Schema
