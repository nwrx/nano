import type { ModuleFlow } from '../index'
// import { ModuleUser } from '@unserved/module-user'
import { createRoute } from '@unserved/server'
import { setResponseStatus } from 'h3'
import { assertStringUuid, createParser } from 'unshared'

export function flowDelete(this: ModuleFlow) {
  return createRoute(
    {
      name: 'DELETE /api/flows/:id',
      parameters: createParser({
        id: assertStringUuid,
      }),
    },
    async({ event, parameters }) => {
      const { Flow } = this.entities
      const { id } = parameters

      // --- Check if the user has the right permissions.
      // const userModule = this.getModule(ModuleUser)
      // await userModule.a11n(event, { permissions: [this.permissions.FLOW_DELETE.id] })

      // --- Fetch the form.
      const flow = await Flow.findOne({ where: { id } })
      if (!flow) throw this.errors.FLOW_NOT_FOUND(id)

      // --- Delete the form.
      await flow.remove()
      setResponseStatus(event, 204)
    },
  )
}
