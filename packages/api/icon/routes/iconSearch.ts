import type { ModuleIcon } from '..'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { searchIcons } from '../utils'

export function iconSearch(this: ModuleIcon) {
  return createHttpRoute(
    {
      name: 'GET /api/icons',
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
        limit: [[assert.undefined], [assert.stringNumber, Number.parseInt]],
      }),
    },
    async({ query }): Promise<string[]> => {
      const icons = await searchIcons.call(this, query)
      return icons.map(x => x.serialize())
    },
  )
}
