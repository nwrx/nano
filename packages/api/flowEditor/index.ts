import type { EditorSession } from './utils'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './utils/resolveComponent'
export type * from './utils/types'

export class ModuleFlowEditor extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  dependencies = [ModuleUser, ModuleProject]
  flowEditorSessions = new Map<string, EditorSession>()
}
