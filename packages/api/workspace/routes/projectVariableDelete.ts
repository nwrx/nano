import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'

export function projectVariableDelete(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/variables/:name',
      parameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        name: assert.stringConstantCase.with('The name of the variable must be in constant case.'),
      }),
    },
    async({ event, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const { user } = await userModule.authenticate(event)
      const { workspace, project, name } = parameters
      await this.deleteProjectVariable({ workspace, project, name, user })
    },
  )
}
