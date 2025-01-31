import { client } from './client'

export interface GetCodeSectionsOptions {
  id: string
  accessToken: string
}

export async function getCodeSections({ accessToken, id }: GetCodeSectionsOptions) {
  const response = await client.fetch('POST /consult/legi/tableMatieres', {
    headers: { Authorization: `Bearer ${accessToken}` },
    body: {
      date: new Date().toISOString().split('T')[0],
      nature: 'CODE',
      textId: id,
    },
  })

  const data = await response.json()
  if (!data.sections) return []
  return data.sections
}
