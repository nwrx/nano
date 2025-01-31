import type { ModuleFlow } from '../'
import { createRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assertNil, assertString, createSchema } from '@unshared/validation'

export function chainCreate(this: ModuleFlow) {
  return createRoute(
    {
      name: 'POST /api/flows',
      body: createSchema({
        name: [[assertNil], [assertString]],
        slug: [[assertNil], [assertString]],
      }),
    },
    async({ body }) => {

      // --- Check if the user has the right permissions.
      // const userModule = this.getModule(ModuleUser)
      // await userModule.a11n(event, { permissions: [this.permissions.FLOW_CREATE.id] })

      // --- Create and save the form.
      const { Flow } = this.entities
      const flow = Flow.create()
      flow.name = body.name ?? 'New Chain'
      flow.slug = body.slug ? toSlug(body.slug) : flow.id

      // --- Save the form.
      await flow.save()
      return flow.serialize()
    },
  )
}
