import { FlowError } from '@nwrx/core'
import { client } from './client'

export interface SearchOptions {
  query: string
  code: string
  accessToken: string
}

export interface SearchResult {
  id: string
  title: string
  date?: string
  status?: string
  sections: Record<string, string>
}

export async function search({ query, code, accessToken }: SearchOptions) {
  const response = await client.fetch('POST /search', {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: {
      fond: 'LODA_ETAT',
      recherche: {
        pageNumber: 1,
        pageSize: 10,
        operateur: 'OU',
        sort: 'PERTINENCE',
        typePagination: 'DEFAUT',
        filtres: [
          // {
          //   facette: 'CODE',
          //   valeurs: [code],
          // },
          // {
          //   facette: 'TEXT_LEGAL_STATUS',
          //   valeurs: ['VIGUEUR'],
          // },
        ],
        champs: [
          {
            typeChamp: 'ALL',
            operateur: 'ET',
            criteres: [
              {
                typeRecherche: 'UN_DES_MOTS',
                operateur: 'ET',
                valeur: query,
              },
            ],
          },
          {
            typeChamp: 'ALL',
            operateur: 'ET',
            criteres: [
              {
                typeRecherche: 'EXACTE',
                operateur: 'ET',
                valeur: code,
              },
            ],
          },
        ],
      },
    },
  })

  // --- Handle errors
  if (!response.ok) {
    const data = await response.json() as { message: string }
    throw new FlowError({
      name: 'PISTE_SEARCH_ERROR',
      message: data.message,
      data,
    })
  }

  // --- Process response into a more usable format.
  const data = await response.json()
  if (!data.results) throw new FlowError({ name: 'PISTE_SEARCH_ERROR', message: 'No results found' })
  const results: Record<string, SearchResult> = {}
  for (const result of data.results) {

    const id = result.titles?.[0].id
    const title = result.titles?.[0].title
    if (!id) continue
    if (!title) continue

    const sections: Record<string, string> = {}
    for (const section of result.sections ?? []) {
      if (!section.id) continue
      if (!section.extracts) continue
      const extracts = section.extracts.flatMap(extract => extract.values)
      sections[section.id] = [...new Set(extracts)].join('\n\n')
    }

    results[id] = {
      id,
      title,
      date: result.date,
      status: result.etat,
      sections,
    }
  }

  // --- Return the results
  return results
}
