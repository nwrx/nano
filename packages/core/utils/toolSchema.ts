import type { InferSchema, Schema } from './defineComponent'

/** A tool is a function that can be used by a node to extend it's functionality. */
export type Tool = InferSchema<typeof TOOL_SCHEMA>

/** The JSON schema of a tool. */
export const TOOL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'name',
    'inputSchema',
    'call',
  ],
  properties: {
    nodeId: {
      'type': 'string',
      'title': 'Node ID',
      'description': 'The ID of the node that the tool is associated with.',
      'x-internal': true,
    },
    name: {
      type: 'string',
      title: 'Name',
      description: 'The name of the tool to identify it in the list of tools.',
    },
    description: {
      'type': 'string',
      'title': 'Description',
      'description': 'The description of the tool to provide additional information about it to LLM. It allows the LLM to understand the purpose of the tool and how, when, and where to use it.',
      'x-optional': true,
    },
    inputSchema: {
      type: 'object',
      title: 'Properties',
      description: 'The schema of the data that the tool can accept.',
      required: ['type', 'required', 'properties'],
      properties: {
        type: {
          type: 'string',
          enum: ['object'] as const,
          default: 'object',
        },
        required: {
          type: 'array',
          items: { type: 'string' },
        },
        properties: {
          type: 'object',
          additionalProperties: { type: 'object', additionalProperties: true },
        },
        additionalProperties: {
          type: 'boolean',
          default: false,
        },
      },
    },
    call: {
      'title': 'Call',
      'description': 'The function that calls the language model API.',
      'x-type': 'function',
      'x-resolves': {
        type: 'object',
        additionalProperties: true,
      },
      'x-returns': {
        type: 'object',
        additionalProperties: true,
      },
      'x-takes': [{
        type: 'object',
        additionalProperties: true,
      }],
    },
  },
} satisfies Schema
