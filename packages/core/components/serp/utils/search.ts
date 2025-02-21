import { createError } from '@nwrx/nano'
import { createClient } from '@unshared/client'

export interface SearchOptions {
  apiKey: string
  query: string
  location?: string
  googleDomain?: string
  gl?: string
  hl?: string
}

export interface SearchResult {
  organic_results: object[]
}

export async function search(options: SearchOptions): Promise<object[]> {
  const { apiKey, query, location, googleDomain, gl, hl } = options
  const client = createClient({ baseUrl: 'https://serpapi.com' })
  const results = await client.request('GET /search.json', {
    onFailure: async(response) => {
      const data = await response.json() as { error: string }
      throw createError({
        name: 'SERPAPI_SEARCH_TOOL_ERROR',
        message: data.error,
        context: options as Record<string, any>,
      })
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    query: {
      api_key: apiKey,
      q: query,
      location,
      google_domain: googleDomain,
      gl,
      hl,
    },
  }) as SearchResult

  return results.organic_results
}
