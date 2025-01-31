/* eslint-disable sonarjs/todo-tag */
import type { JSONSchema4 } from 'json-schema'
import { defineComponent } from '@nwrx/nano'
import { categoryLanguageModelTool } from '../categories'
import { languageModelTool, string } from '../types'
import { search } from '../utils/search'

export const nodeSerpapiSearchTool = defineComponent({
  kind: 'serpapi/search-tool',
  name: 'Serpapi - Search Tool',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Perform a search using Serpapi and return the results.',
  category: categoryLanguageModelTool,

  inputSchema: {
    apiKey: {
      name: 'API Key',
      type: string,
      control: 'variable',
      description: 'The API key to authenticate with Serpapi.',
    },
    location: {
      name: 'Location',
      type: string,
      control: 'text',
      description: 'The location for the search.',
      isOptional: true,
    },
    googleDomain: {
      name: 'Google Domain',
      type: string,
      control: 'text',
      description: 'The Google domain to use for the search.',
      isOptional: true,
      defaultValue: 'google.com',
    },
    gl: {
      name: 'GL',
      type: string,
      control: 'text',
      description: 'The country code for the search.',
      isOptional: true,
    },
    hl: {
      name: 'HL',
      type: string,
      control: 'text',
      description: 'The language code for the search.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'The search results from Serpapi.',
    },
  },

  process: ({ data }) => ({
    tool: {
      name: 'serpapi_search_tool',
      description: 'Perform a search using Serpapi and return the results.',
      schema: {
        type: 'object',
        required: ['query'],
        properties: {
          query: {
            type: 'string',
            description: 'The search query.',
          },
          location: {
            type: 'string',
            description: 'The location for the search.',
          },
          googleDomain: {
            type: 'string',
            description: 'The Google domain to use for the search.',
          },
          gl: {
            type: 'string',
            description: 'The country code for the search.',
          },
          hl: {
            type: 'string',
            description: 'The language code for the search.',
          },
        },
      } as JSONSchema4,
      // @ts-expect-error: TODO: Fix type
      call: parameters => search({ ...parameters, ...data }),
    },
  }),
})
