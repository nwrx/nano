import type { JSONSchema4 } from 'json-schema'
import { defineNode } from '@nwrx/core'
import { categoryLanguageModelTool } from '../categories'
import { languageModelTool, string } from '../types'

export interface ArxivToolInput {
  search_query: string
  start?: number
  max_results?: number
}

export const toolArxiv = defineNode({
  kind: 'core/arxiv-tool',
  name: 'Arxiv',
  icon: 'https://api.iconify.design/mdi:book-open-page-variant.svg',
  description: 'The **Arxiv Tool** node is designed to fetch research papers from arXiv based on a search query. The node requires a search query as input and returns a list of research papers matching the query.',
  category: categoryLanguageModelTool,

  inputSchema: {
    name: {
      name: 'Name',
      type: string,
      control: 'text',
      description: 'Override the internal name used when passing the tool to the Language Model.',
      defaultValue: 'query_arxiv_papers',
      isOptional: true,
    },
    description: {
      name: 'Description',
      type: string,
      control: 'textarea',
      description: 'The description of the tool.',
      defaultValue: 'Given a search query, fetch research papers from arXiv matching the query.',
      isOptional: true,
    },
  },

  outputSchema: {
    tool: {
      name: 'Tool',
      type: languageModelTool,
      description: 'A list of research papers matching the search query.',
    },
  },

  process: ({ input, trace }) => ({
    tool: {
      name: input.name ?? 'query_arxiv_papers',
      description: input.description ?? 'Given a search query, fetch research papers from arXiv matching the query.',
      schema: {
        type: 'object',
        required: ['query'],
        properties: {
          search_query: {
            type: 'string',
            description: 'The search query to fetch research papers from arXiv.',
          },
          start: {
            type: 'integer',
            description: 'The index of the first research paper to return.',
            default: 0,
          },
          max_results: {
            type: 'integer',
            description: 'The maximum number of research papers to return.',
            default: 10,
          },
        },
      } as JSONSchema4,
      call: async(data) => {
        const { search_query, start = 0, max_results = 10 } = data as unknown as ArxivToolInput
        trace({ type: 'request', data })

        // --- Fetch research papers from arXiv.
        const url = new URL('/api/query', 'https://export.arxiv.org')
        url.searchParams.append('search_query', search_query)
        url.searchParams.append('start', String(start))
        url.searchParams.append('max_results', String(max_results))
        const response = await fetch(url)
        if (!response.ok) throw new Error('The research papers could not be fetched.')

        // --- Return the fetched research papers as text.
        const text = await response.text()
        trace({ type: 'response', data: text })
        return text
      },
    },
  }),
})
