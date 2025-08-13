import type { ModuleFlowEditor } from '../index'
import { createHttpRoute } from '@unserved/server'
import { assert, createParser } from '@unshared/validation'
import { CORE_COMPONENT_GROUPS, CORE_COMPONENTS } from '../utils'

export function flowEditorComponents(this: ModuleFlowEditor) {
  return createHttpRoute(
    {
      name: 'GET /workspaces/:workspace/projects/:project/flows/:flow/components',
      parseParameters: createParser({
        workspace: assert.stringNotEmpty,
        project: assert.stringNotEmpty,
        flow: assert.stringNotEmpty,
      }),
    },
    () => ({
      components: [...CORE_COMPONENTS],
      groups: [...CORE_COMPONENT_GROUPS],
    }),
  )
}
