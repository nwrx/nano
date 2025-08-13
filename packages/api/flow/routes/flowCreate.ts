import type { ModuleFlow } from '..'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, createParser, createRuleMap } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { createFlow, getRandomName } from '../utils'

export function flowCreate(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/projects/:project/flows',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      parseBody: createParser(
        [assert.undefined],
        [createRuleMap({
          name: [[assert.undefined, getRandomName], [assert.stringNotEmpty, toSlug]],
        })],
      ),
    },
    async({ event, parameters, body }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const workspace = await moduleWorkspace.getWorkspace({ name: parameters.workspace, user, permission: 'Read' })
      const project = await moduleProject.getProject({ name: parameters.project, workspace, user, permission: 'Write' })
      const flow = await createFlow.call(this, { workspace, project, user, isPublic: false, ...body })
      return flow.serialize()
    },
  )
}
