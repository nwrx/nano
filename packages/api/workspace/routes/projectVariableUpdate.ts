import type { ModuleWorkspace } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createSchema } from '@unshared/validation'
import { ModuleUser } from '../../user'

export function projectVariableUpdate(this: ModuleWorkspace) {
  return createHttpRoute(
    {
      name: 'PUT /api/workspaces/:workspace/:project/variables/:name',
      parseParameters: createSchema({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        name: assert.stringConstantCase.with('The name of the variable must be in constant case.'),
      }),
      parseBody: createSchema({
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
