import type { Type } from '@nwrx/core'
import { defineComponent } from '@nwrx/core'
import { categoryBasic } from '../categories'
import { string } from '../types'

export const nodeFetch = defineComponent({
  kind: 'core/fetch',
  name: 'Fetch',
  icon: 'https://api.iconify.design/carbon:connect.svg',
  category: categoryBasic,
  description: 'Retrieve data from a remote HTTP resource and return the response as a string.',

  inputSchema: {
    baseApiURL: {
      name: 'URL',
      control: 'text',
      type: string,
      description: 'The base URL of the API endpoint to fetch data from.',
    },
    verb: {
      name: 'Method',
      control: 'select',
      type: string as Type<'DELETE' | 'GET' | 'PATCH' | 'POST'>,
      description: 'The HTTP method to use for the API call.',
      defaultValue: 'GET',
      isOptional: true,
      options: [
        {
          value: 'GET',
          label: 'GET',
          icon: 'https://api.iconify.design/carbon:download.svg',
        },
        {
          value: 'POST',
          label: 'POST',
          icon: 'https://api.iconify.design/carbon:upload.svg',
        },
        {
          value: 'PATCH',
          label: 'PATCH',
          icon: 'https://api.iconify.design/carbon:edit.svg',
        },
        {
          value: 'DELETE',
          label: 'DELETE',
          icon: 'https://api.iconify.design/carbon:delete.svg',
        },
      ],
    },
    query: {
      name: 'Query',
      description: 'Key-value pairs to be sent as query parameters in the API call.',
      control: 'map',
      type: string,
      isMap: true,
      isOptional: true,
    },
    body: {
      name: 'Body',
      description: 'Key-value pairs to be sent as the body in the API call. Only applicable for POST, PATCH, and DELETE methods.',
      control: 'map',
      type: string,
      isMap: true,
      isOptional: true,
    },
    headers: {
      name: 'Headers',
      description: 'Key-value pairs to be sent as headers in the API call.',
      control: 'map',
      type: string,
      isMap: true,
      isOptional: true,
    },
  },

  outputSchema: {
    response: {
      type: string,
      name: 'Response',
      description: 'The response body returned from the API call as a string.',
    },
  },

  process: async({ data }) => {
    const { baseApiURL, verb, query = {}, body = {}, headers = {} } = data
    const url = new URL(baseApiURL)

    // --- Add the query parameters to the URL.
    for (const [key, value] of Object.entries(query))
      url.searchParams.append(key, value)

    // --- Fetch the data from the API endpoint.
    const response = await fetch(url.toString(), {
      method: verb,
      headers: new Headers(headers),
      body: verb === 'GET' ? undefined : JSON.stringify(body),
    })

    // --- Handle errors and return the response body.
    if (!response.ok) throw new Error(`Failed to fetch data from the API: ${response.statusText}`)
    return { response: await response.text() }
  },
})
