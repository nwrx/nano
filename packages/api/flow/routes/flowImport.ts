import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, assertString, assertStringNotEmpty, assertUndefined, createSchema } from '@unshared/validation'
import * as YAML from 'yaml'
import { ModuleUser } from '../../user'
import { randomName } from '../../utils'
import { ModuleWorkspace } from '../../workspace'

export function flowImport(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/import',
      parseParameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseFormData: createSchema({
        file: assert.instance(File),
      }),
    },
    async({ event, formData, parameters }) => {
      const userModule = this.getModule(ModuleUser)
      const workspaceModule = this.getModule(ModuleWorkspace)
      const { user } = await userModule.authenticate(event)
      const { workspace: workspaceName, project: projectName } = parameters
      const { file } = formData

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await workspaceModule.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
      const project = await workspaceModule.resolveProject({ user, workspace, name: projectName, permission: 'Write' })

      // --- Parse the file content.
      const text = await file.text()
      let data: Record<string, unknown>
      if (file.type === 'application/json') data = JSON.parse(text) as Record<string, unknown>
      else if (file.type === 'application/x-yaml') data = YAML.parse(text) as Record<string, unknown>
      else throw new Error('Invalid file type. Only JSON and YAML files are supported.')

      // --- Ensure the data is valid.
      const { name = randomName(), title = name, description } = createSchema({
        name: [[assertUndefined], [assertStringNotEmpty, toSlug]],
        title: [[assertUndefined], [assertString]],
        description: [[assertUndefined], [assertString]],
      })(data)

      // --- Parse the file and save the flow.
      const { Flow } = this.getRepositories()
      const flow = Flow.create({ name, title, description, project, data })
      await Flow.save(flow)
      return flow.serialize()
    },
  )
}
