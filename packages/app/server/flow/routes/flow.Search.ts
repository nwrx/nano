import type { FlowObject } from '../entities'
import type { ModuleFlow } from '../index'
import { ModuleUser } from '@unserved/module-user'
import { createRoute } from '@unserved/server'
import { assertString, assertStringNumber, assertUndefined, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'

export function flowSearch(this: ModuleFlow) {
  return createRoute(
    {
      name: 'GET /api/flows',
      query: createParser({
        search: [[assertUndefined], [assertString]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt]],
      }),
    },
    async({ event, query }): Promise<FlowObject[]> => {

      // --- Check if the user has the right permissions.
      const userModule = this.getModule(ModuleUser)
      await userModule.a11n(event, {
        optional: true,
        permissions: [this.permissions.FLOW_SEARCH.id],
      })

      // --- Deconstruct the query.
      const { search } = query
      const { limit = 10, page = 1 } = query

      // --- Fetch the chains.
      const { Flow } = this.entities
      const flows = await Flow.find({
        where: [
          { name: search ? ILike(`%${search}%`) : undefined },
          { slug: search ? ILike(`%${search}%`) : undefined },
        ],
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: (page - 1) * limit,
      })

      // --- Return the form entities.
      return flows.map(chain => chain.serialize())
    },
  )
}
