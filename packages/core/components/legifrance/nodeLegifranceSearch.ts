import { defineComponent } from '@nwrx/core'
import { object, string } from '@nwrx/module-core/types'
import { categoryLegifrance } from '../categories'
import { getAccessToken } from '../utils/getAccessToken'
import { getCodes } from '../utils/getCodes'
import { search } from '../utils/search'

export const nodeLegifranceSearch = defineComponent({
  kind: 'legifrance/search',
  name: 'Legifrance Search',
  icon: 'https://api.iconify.design/flags:fr.svg',
  description: 'Search for legal documents on Legifrance',
  category: categoryLegifrance,

  inputs: {
    query: {
      type: string,
      name: 'Search',
      description: 'The search query',
      control: 'text',
    },
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
    code: {
      type: string,
      name: 'Code',
      description: 'The legislative code to search in',
      control: 'select',
      options: async(input, query) => {
        const { clientId, clientSecret } = input
        if (typeof clientId !== 'string') return []
        if (typeof clientSecret !== 'string') return []
        const accessToken = await getAccessToken({ clientId, clientSecret })
        const codes = await getCodes({ accessToken, query })
        return codes.map(code => ({
          value: code.id,
          label: code.title,
          icon: 'https://api.iconify.design/mdi:file-document.svg',
          description: new Date(code.updatedAt).toLocaleDateString(),
        }))
      },
    },
  },

  outputs: {
    documents: {
      type: object,
      name: 'Documents',
    },
  },

  process: async({ data }) => {
    const { clientId, clientSecret, code, query } = data
    const accessToken = await getAccessToken({ clientId, clientSecret })
    const documents = await search({ query, code, accessToken })
    return { documents }
  },
})
