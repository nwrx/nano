import type { ModuleFlow } from '../index'
import { createRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string'
import { assertStringNotEmpty, assertStringNumber, assertUndefined, createSchema } from '@unshared/validation'
import { ILike } from 'typeorm'

export function moduleSearch(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/modules',
      query: createSchema({
        search: [[assertUndefined], [assertStringNotEmpty]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        withNodes: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
        withTypes: [[assertUndefined], [assertStringNotEmpty, parseBoolean]],
      }),
    },
    async({ query }) => {
      const { FlowModule } = this.entities
      const {
        search,
        page = 1,
        limit = 10,
        withNodes = false,
        withTypes = false,
      } = query

      // --- Search for modules by name or description.
      const flowModules = await FlowModule.find({
        where: [
          { name: search ? ILike(`%${search}%`) : undefined },
          { description: search ? ILike(`%${search}%`) : undefined },
        ],
        take: limit,
        skip: (page - 1) * limit,
      })

      // --- Return the serialized modules.
      return Promise.all(flowModules.map(module => module.serialize({
        withNodes,
        withTypes,
      })))
    },
  )
}
