import { setResponseStatus } from 'h3'
import { assertStringUuid, createParser } from 'unshared'
import { ModuleUser, createRoute } from '@unserved/server'
import { ModuleChain } from '..'

export function formDelete(this: ModuleChain) {
  return createRoute(
    {
      name: 'DELETE /api/chains/:id',
      parameters: createParser({
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const { Chain } = this.entities
      const { id } = parameters

      // --- Check if the user has the right permissions.
      const userModule = this.getModule(ModuleUser)
      await userModule.a11n(event, { permissions: [this.permissions.CHAIN_DELETE.id] })

      // --- Fetch the form.
      const chain = await Chain.findOne({ where: { id } })
      if (!chain) throw this.errors.CHAIN_NOT_FOUND(id)

      // --- Delete the form.
      await chain.remove()
      setResponseStatus(event, 204)
    },
  )
}
