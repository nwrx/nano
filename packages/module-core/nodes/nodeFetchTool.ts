/* eslint-disable vue/component-definition-name-casing */
import type { JSONSchema4 } from 'json-schema'
import { defineComponent, ThreadError } from '@nwrx/core'
import { request } from '@unshared/client/utils'
import { categoryBasic } from '../categories'
import { languageModelTool, string } from '../types'

export const nodeFetchTool = defineComponent({
  kind: 'core/fetch-tool',
  name: 'Fetch Tool',
  icon: 'https://api.iconify.design/carbon:connect.svg',
  description: 'Retrieve data from a remote HTTP resource and return the response as a string.',
  category: categoryBasic,

  inputSchema: {
    baseUrl: {
      name: 'URL',
      control: 'text',
      type: string,
      description: 'The base URL of the API endpoint to fetch data from.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'The response body returned from the API call as a string.',
    },
  },

  process: ({ data }) => ({
    tool: {
      name: 'fetch_tool',
      description: 'Retrieve data from a remote HTTP resource and return the response as a string.',
      schema: {
        type: 'object',
        required: ['baseApiURL'],
        properties: {
          ...(
            data.baseUrl
              ? { path: { type: 'string', description: 'The path of the API endpoint to fetch data from.' } }
              : { url: { type: 'string', description: 'The base URL of the API endpoint to fetch data from.' } }
          ),
          method: {
            type: 'string',
            description: 'The HTTP method to use for the API call.',
            enum: ['GET', 'POST', 'PATCH', 'DELETE'],
            default: 'GET',
          },
          query: {
            type: 'object',
            description: 'Key-value pairs to be sent as query parameters in the API call.',
            additionalProperties: { type: 'string' },
          },
          body: {
            type: 'object',
            description: 'Key-value pairs to be sent as the body in the API call. Only applicable for POST, PATCH, and DELETE methods.',
            additionalProperties: { type: 'string' },
          },
          headers: {
            type: 'object',
            description: 'Key-value pairs to be sent as headers in the API call.',
            additionalProperties: { type: 'string' },
          },
        },
      } as JSONSchema4,
      call: async(parameters) => {
        try {
          const url = data.baseUrl
            ? new URL(parameters.path as string, parameters.url as string).toString()
            : parameters.url as string

          const result = await request(url, {
            method: parameters.method as 'get',
            query: parameters.query as Record<string, string>,
            body: parameters.body as Record<string, string>,
            headers: parameters.headers as Record<string, string>,
          })
          return JSON.stringify(result)
        }
        catch (error) {
          const message = (error as Error).message
          throw new ThreadError({
            name: 'FETCH_TOOL_ERROR',
            message: `An error occurred while fetching data: ${message}`,
            context: parameters,
          })
        }
      },
    },
  }),
})
