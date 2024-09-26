import type { ModuleFlow } from '..'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assertStringNotEmpty, createParser } from '@unshared/validation'

export function flowSessionCreateAccessToken(this: ModuleFlow) {
  return createRoute(
    {
      name: 'POST /api/workspaces/projectOwner/:projectName/flows/:flowName/session',
      parameters: createParser({
        projectOwner: assertStringNotEmpty,
        projectName: assertStringNotEmpty,
        flowName: assertStringNotEmpty,
      }),
    },
    async({ event, parameters }) => {

      // --- Resolve the flow and check if the user has access to it.
      const flow = await this.resolveFlow(event, {
        projectOwner: parameters.projectOwner,
        projectName: parameters.projectName,
        flowName: parameters.flowName,
        permissions: ['Write'],
      })

      // --- Resolve the session and create an access token for the user.
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const session = await this.resolveFlowSession(flow.id)
      const accessToken = session.createAccessToken(user)
      return { accessToken }
    },
  )
}
