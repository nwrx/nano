import type { ModuleFlow } from '../index'
import { createHttpRoute } from '@unserved/server'
import { toSlug } from '@unshared/string'
import { assert, assertString, assertStringNotEmpty, assertUndefined, createParser } from '@unshared/validation'
import * as YAML from 'yaml'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getRandomName } from '../utils'

export function flowImport(this: ModuleFlow) {
  return createHttpRoute(
    {
      name: 'POST /workspaces/:workspace/projects/:project/import',
      parseParameters: createParser({
        workspace: assertStringNotEmpty,
        project: assertStringNotEmpty,
      }),
      parseFormData: createParser({
        file: assert.instanceOf(File),
      }),
    },
    async({ event, formData, parameters }) => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)
      const { file } = formData

      // --- Resolve the workspace and project and assert the user has access to them.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Write' })

      // --- Parse the file content.
      const text = await file.text()
      let data: Record<string, unknown>
      if (file.type === 'application/json') data = JSON.parse(text) as Record<string, unknown>
      else if (file.type === 'application/x-yaml') data = YAML.parse(text) as Record<string, unknown>
      else throw new Error('Invalid file type. Only JSON and YAML files are supported.')

      // --- Ensure the data is valid.
      const { name, title = name, description } = createParser({
        name: [[assertUndefined, getRandomName], [assertStringNotEmpty, toSlug]],
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
