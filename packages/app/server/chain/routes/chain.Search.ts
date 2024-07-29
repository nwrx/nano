import { ILike } from 'typeorm'
import { assertString, assertStringNumber, assertUndefined, createParser } from 'unshared'
import { ModuleUser, createRoute } from '@unserved/server'
import { ModuleChain } from '..'

export function chainSearch(this: ModuleChain) {
  return createRoute(
    {
      name: 'GET /api/chains',
      query: createParser({
        search: [[assertUndefined], [assertString]],
        page: [[assertUndefined], [assertStringNumber, Number.parseInt]],
        limit: [[assertUndefined], [assertStringNumber, Number.parseInt]],
      }),
    },
    async({ event, query }) => {

      // --- Check if the user has the right permissions.
      const userModule = this.getModule(ModuleUser)
      await userModule.a11n(event, {
        optional: true,
        permissions: [this.permissions.CHAIN_SEARCH.id],
      })

      // --- Deconstruct the query.
      const { search } = query
      const { limit = 10, page = 1 } = query

      // --- Fetch the chains.
      const { Chain } = this.entities
      const chains = await Chain.find({
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
      return chains.map(chain => chain.serialize())
    },
  )
}
