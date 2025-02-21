import { defineComponent } from '@nwrx/nano'
import { object, string } from '@nwrx/module-core/types'
import { categorySerpapi } from '../categories/categorySerpapi'
import { search } from '../utils/search'

export const nodeSerpapiSearch = defineComponent({
  kind: 'serpapi/search',
  name: 'Serpapi - Search',
  icon: 'https://api.iconify.design/carbon:ibm-cloud-kubernetes-service.svg',
  description: 'Perform a search using Serpapi.',
  category: categorySerpapi,

  inputs: {
    apiKey: {
      name: 'API Key',
      type: string,
      control: 'variable',
      description: 'The API key to authenticate with Serpapi.',
    },
    query: {
      name: 'Query',
      type: string,
      control: 'text',
      description: 'The search query.',
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

  outputs: {
    results: {
      name: 'Results',
      type: object,
      description: 'The search results from Serpapi.',
    },
  },

  process: async({ data }) => ({ results: await search(data) as Record<string, any> }),
})
