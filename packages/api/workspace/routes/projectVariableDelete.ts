import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectVariableDelete(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'DELETE /api/workspaces/:workspace/:project/variables/:name',
      parseParameters: createSchema({
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
