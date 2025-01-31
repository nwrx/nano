import type { JSONSchema4 } from 'json-schema'
import { defineNode, FlowError } from '@nwrx/core'
import { languageModelTool, string } from '@nwrx/module-core/types'
import { categoryLegifrance } from '../categories'
import { getAccessToken } from '../utils/getAccessToken'
import { search } from '../utils/search'

export const nodeLegifranceSearchTool = defineNode({
  kind: 'legifrance/search-tool',
  name: 'Legifrance - Search Tool',
  icon: 'https://api.iconify.design/flags:fr.svg',
  description: 'Search for legal documents on Legifrance based on specified query parameters.',
  category: categoryLegifrance,

  inputSchema: {
    clientId: {
      type: string,
      name: 'Client ID',
      control: 'variable',
    },
    clientSecret: {
      type: string,
      name: 'Client Secret',
      control: 'variable',
    },
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'Override the internal name used when passing the tool to the Language Model.',
      defaultValue: 'legifrance_search',
      isOptional: true,
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'Search for legal documents on Legifrance based on specified query parameters.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'A list of legal documents matching the search query.',
    },
  },

  process: ({ input }) => ({
    tool: {
      name: input.name!,
      description: input.description!,
      schema: {
        type: 'object',
        required: ['query'],
        properties: {
          query: {
            type: 'string',
            description: 'The search query to filter the legal documents on Legifrance.',
          },
          code: {
            type: 'string',
            description: 'The legislative code to search in.',
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        try {
          const { clientId, clientSecret } = input
          const { query, code } = data as { query: string; code: string }
          const accessToken = await getAccessToken({ clientId, clientSecret })
          const documents = await search({ query, code, accessToken })
          return JSON.stringify(documents, undefined, 2)
        }
        catch (error) {
          const message = (error as Error).message
          throw new FlowError({
            name: 'LEGIFRANCE_SEARCH_ERROR',
            message: `An error occurred while searching for legal documents on Legifrance: ${message}`,
            context: { input, data, error },
          })
        }
      },
    },
  }),
})
