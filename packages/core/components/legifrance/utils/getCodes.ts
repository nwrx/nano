/* eslint-disable sonarjs/prefer-single-boolean-return */
import { ThreadError } from '@nwrx/nano'
import { client } from './client'

export interface GetCodesOptions {
  accessToken: string
  query?: string
}

export interface Code {
  id: string
  title: string
  state: string
  updatedAt: string
}

const ALL_CODES: Code[] = []

export async function getCodes({ accessToken, query }: GetCodesOptions): Promise<Code[]> {

  if (ALL_CODES.length === 0) {
    const response = await client.fetch('POST /list/code', {
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { pageNumber: 1, pageSize: 200, codeName: query },
    })

    // --- Handle errors
    if (response.status !== 200) {
      throw new ThreadError({
        name: 'PISTE_SEARCH_ERROR',
        message: await response.text(),
      })
    }

    // --- Parse response data.
    const data = await response.json()
    if (!data.results) return []
    const codes = data.results
      .map(code => ({
        id: code.id!,
        title: code.titre!,
        state: code.etat!,
        updatedAt: code.lastUpdate!,
      }))
    ALL_CODES.push(...codes)
  }

  if (!query) return ALL_CODES
  const queryLower = query.toLowerCase()
  return ALL_CODES.filter((code) => {
    if (code.id.toLowerCase().includes(queryLower)) return true
    if (code.title.toLowerCase().includes(queryLower)) return true
    return false
  })
}
