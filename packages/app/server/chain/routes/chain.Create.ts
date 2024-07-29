import { assertNil, assertString, createSchema } from 'unshared'
import { createRoute, toSlug } from '@unserved/server'
import { ModuleChain } from '../'

export function chainCreate(this: ModuleChain) {
  return createRoute(
    {
      name: 'POST /api/chains',
      body: createSchema({
        name: [[assertNil], [assertString]],
        slug: [[assertNil], [assertString]],
      }),
    },
    async({ body }) => {

      // --- Check if the user has the right permissions.
      // const userModule = this.getModule(ModuleUser)
      // await userModule.a11n(event, { permissions: [this.permissions.CHAIN_CREATE.id] })

      // --- Create and save the form.
      const { Chain } = this.entities
      const chain = Chain.create()
      chain.name = body.name ?? 'New Chain'
      chain.slug = toSlug(body.slug ?? chain.name)

      // --- Save the form.
      await chain.save()
      return chain.serialize()
    },
  )
}
