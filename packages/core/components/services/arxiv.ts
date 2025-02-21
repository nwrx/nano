import { defineComponent } from '../../utils'

export const arxiv = defineComponent(
  {
    isTrusted: true,
    title: 'Arxiv',
    icon: 'https://api.iconify.design/mdi:book-open-page-variant.svg',
    description: 'The **Arxiv Tool** node is designed to fetch research papers from arXiv based on a search query. The node requires a search query as input and returns a list of research papers matching the query.',
    inputs: {
      searchQuery: {
        type: 'string',
        description: 'The search query to fetch research papers from arXiv.',
      },
      start: {
        'type': 'integer',
        'description': 'The index of the first research paper to return.',
        'default': 0,
        'minimum': 0,
        'x-control': 'slider',
        'x-slider-min': 0,
        'x-slider-max': 100,
      },
      maxResults: {
        type: 'integer',
        description: 'The maximum number of research papers to return.',
        default: 10,
        minimum: 1,
        maximum: 100,
      },
    },
    outputs: {
      results: {
        type: 'string',
        description: 'A list of research papers matching the search query.',
      },
    },
  },
  async({ data }) => {
    const { searchQuery, start, maxResults } = data

    // --- Prepare the URL for the arXiv API.
    const url = new URL('/api/query', 'https://export.arxiv.org')
    url.search = new URLSearchParams({
      search_query: searchQuery,
      start: String(start),
      max_results: String(maxResults),
    }).toString()

    // --- Fetch the research papers from arXiv.
    const response = await fetch(url)
    if (!response.ok) throw new Error('The research papers could not be fetched.')
    return { results: await response.text() }
  },
)
