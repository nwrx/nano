import { assertStringUuid, createSchema } from 'unshared'
import { createRoute } from '@unserved/server'
import { ModuleChain } from '..'

export function chainGet(this: ModuleChain) {
  return createRoute(
    {
      name: 'GET /api/chains/:id',
      parameters: createSchema({
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const { id } = parameters
      const { Chain } = this.entities

      // --- Check if the user has the right permissions.
      // const userModule = this.getModule(ModuleUser)
      // await userModule.a11n(event, {
      //   optional: true,
      //   permissions: [this.permissions.CHAIN_GET.id],
      // })

      // --- Fetch the chain.
      const chain = await Chain.findOne({ where: { id } })
      if (!chain) throw this.errors.CHAIN_NOT_FOUND(id)
      return chain.serialize()

    },
  )
}
