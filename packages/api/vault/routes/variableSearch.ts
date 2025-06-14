import type { ModuleVault } from '..'
import type { VaultVariableObject } from '../entities'
import { createHttpRoute } from '@unserved/server'
import { parseBoolean } from '@unshared/string/parseBoolean'
import { assert, createParser } from '@unshared/validation'
import { ModuleProject } from '../../project'
import { ModuleUser } from '../../user'
import { ModuleWorkspace } from '../../workspace'
import { getVault, searchVariableByProject, searchVariableByVault, searchVariableByWorkspace } from '../utils'

export function variableSearchByVault(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/vaults/:vault/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        vault: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }): Promise<VaultVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and vault with read permission and search the variables.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const vault = await getVault.call(this, { user, workspace, name: parameters.vault, permission: 'Read' })
      const variables = await searchVariableByVault.call(this, { vault, ...query })
      return variables.map(variable => variable.serialize({ withVault: query.withVault }))
    },
  )
}

export function variableSearchByWorkspace(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }): Promise<VaultVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace with read permission and search the variables.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Owner' })
      const variables = await searchVariableByWorkspace.call(this, { workspace, ...query })
      return variables.map(variable => variable.serialize({ withVault: query.withVault }))
    },
  )
}

export function variableSearchByProject(this: ModuleVault) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/variables',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
      }),
      parseQuery: createParser({
        search: [[assert.undefined], [assert.stringNotEmpty]],
        page: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        limit: [[assert.undefined], [assert.stringNotEmpty, assert.number]],
        order: [[assert.undefined], [assert.stringNotEmpty, assert.objectStrict]],
        withVault: [[assert.undefined], [assert.stringNotEmpty, parseBoolean]],
      }),
    },
    async({ event, query, parameters }): Promise<VaultVariableObject[]> => {
      const moduleUser = this.getModule(ModuleUser)
      const moduleProject = this.getModule(ModuleProject)
      const moduleWorkspace = this.getModule(ModuleWorkspace)
      const { user } = await moduleUser.authenticate(event)

      // --- Get the workspace and project with read permission and search the variables.
      const workspace = await moduleWorkspace.getWorkspace({ user, name: parameters.workspace, permission: 'Read' })
      const project = await moduleProject.getProject({ user, workspace, name: parameters.project, permission: 'Read' })
      const variables = await searchVariableByProject.call(this, { project, ...query })
      return variables.map(variable => variable.serialize({ withVault: query.withVault }))
    },
  )
}
