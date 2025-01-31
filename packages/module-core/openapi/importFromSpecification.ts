import type { FlowNodeDefinition } from '@nwrx/core'
import type { OpenAPI } from 'openapi-types'
import { resolveDocument } from '@unshared/client/openapi'
import { withTemporaryFiles } from '@unshared/fs'
import { toSlug } from '@unshared/string'
import { readFile, writeFile } from 'node:fs/promises'
import postmanToOpenapi from 'postman-to-openapi'
import YAML from 'yaml'
import { createNode } from './createNode'

export interface ImportFromSpecificationOptions {

  /** The kind of the module. */
  kind?: string

  /** The color of the category and nodes. */
  color?: string

  /** The icon of the category and nodes. */
  icon?: string

  /** The name of the category. */
  name?: string

  /** Ignore operations that do not have an operation ID. */
  ignoreUnnamed?: boolean
}

export async function importFromSpecificationUrl(url: string, options: ImportFromSpecificationOptions = {}) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Failed to fetch OpenAPI specification from ${url}.`)
  const data = await response.json() as object
  return importFromSpecification(data, options)
}

export function importFromSpecification(data: object, options: ImportFromSpecificationOptions = {}) {
  const document = resolveDocument(data) as OpenAPI.Document
  const logo = ('x-logo' in document.info ? document.info['x-logo'] : {}) as Record<string, string>

  // --- Iterate over each path and operation in the document.
  const nodes: Record<string, FlowNodeDefinition> = {}
  for (const path in document.paths) {
    const pathObject = document.paths[path] as Record<string, OpenAPI.Operation>
    for (const method in pathObject) {
      const operation = pathObject[method]
      if (options.ignoreUnnamed && !operation.operationId) continue
      // @ts-expect-error: ignore
      const node = createNode(document, { ...operation, path, method }, { moduleKind: options.kind })
      nodes[node.kind] = {
        ...node,
        icon: options.icon ?? logo.url,
        category: {
          kind: toSlug(document.info.title),
          name: options.name ?? document.info.title,
          icon: options.icon ?? logo.url,
          color: options.color ?? logo.backgroundColor,
        },
      }
    }
  }

  return nodes
}

export async function importFromPostmanCollection(id: string, options: ImportFromSpecificationOptions = {}) {
  const url = new URL(`collections/${id}`, 'https://www.postman.com/')
  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Failed to fetch Postman collection from ${id}.`)
  const data = await response.json() as object

  // --- Convert the Postman collection to an OpenAPI specification.
  // --- We must do some weird shananigans since the `postman-to-openapi` package
  // --- only supports input and output files, and we need to use the data directly.
  const document = await withTemporaryFiles(2, async(input, output) => {
    await writeFile(input, JSON.stringify(data))
    await postmanToOpenapi(input, output)
    const documentJson = await readFile(output, 'utf8')
    return YAML.parse(documentJson) as object
  })

  // --- Import the OpenAPI specification.
  return importFromSpecification(document, options)
}
