import type { FlowObject } from '../entities'
import type { ModuleFlow } from '../index'
import { ModuleUser } from '../..'
import { createHttpRoute } from '@unserved/server'
import { assertString, assertStringNotEmpty, assertStringNumber, assertUndefined, createParser } from '@unshared/validation'
import { ILike } from 'typeorm'

export function flowSearch(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'GET /api/flows',
      parseQuery: createParser({
        search: [[assertUndefined], [assertString]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        project: [[assertUndefined], [assertStringNotEmpty]],
      }),
    },
    async({ event, query }): Promise<FlowObject[]> => {
      const userModule = this.getModule(ModuleUser)
      await userModule.authenticate(event)

      // --- Deconstruct the query.
      const { search } = query
      const { limit = 10, page = 1 } = query

      // --- Fetch the chains.
      const { Flow } = this.getRepositories()
      const flows = await Flow.find({
        where: [
          { title: search ? ILike(`%${search}%`) : undefined },
          { name: search ? ILike(`%${search}%`) : undefined },
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
