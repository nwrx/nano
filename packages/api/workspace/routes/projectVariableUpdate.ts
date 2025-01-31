import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'

export function projectVariableUpdate(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/variables/:name',
      parameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        name: assert.stringConstantCase.with('The name of the variable must be in constant case.'),
      }),
      body: createSchema({
        value: assert.stringNotEmpty.with('The value of the variable must not be a non-empty string.'),
      }),
    },
    async({ event, body, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, name } = parameters
      const { value } = body
      await this.updateProjectVariable({ workspace, project, name, value, user })
    },
  )
}
