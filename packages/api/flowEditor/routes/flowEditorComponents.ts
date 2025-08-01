import type { ModuleFlowEditor } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { CORE_COMPONENT_GROUPS, CORE_COMPONENTS } from '../utils'

export function flowEditorComponents(this: ModuleFlowEditor) {
  return createHttpRoute(
    {
      name: 'GET /api/workspaces/:workspace/projects/:project/flows/:name/components',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty.withMessage('Workspace name is required.'),
        project: assert.stringNotEmpty.withMessage('Project name is required.'),
        name: assert.stringNotEmpty.withMessage('Flow name is required.'),
      }),
    },
    () => ({
      components: [...CORE_COMPONENTS],
      groups: [...CORE_COMPONENT_GROUPS],
    }),
  )
}
