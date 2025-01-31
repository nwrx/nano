import { importFromSpecificationUrl } from './importFromSpecification'

export interface Provider {
  apis: Record<string, { swaggerUrl: string }>
}

export async function importFromProvider(url: string) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Failed to fetch provider from ${url}.`)
  const provider = await response.json() as Provider
  const apis = provider.apis
  const nodes = {}
  for (const name in apis) {
    const { swaggerUrl } = apis[name]
    const specNodes = await importFromSpecificationUrl(swaggerUrl)
    Object.assign(nodes, specNodes)
  }
  return nodes
}
