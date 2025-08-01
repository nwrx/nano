import type { EditorSession } from './utils'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export type * from './utils/clientEvent'
export type * from './utils/serverEvent'
export type * from './utils/types'

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlowEditor extends ModuleBase {
  errors = UTILS.ERRORS
  routes = ROUTES
  dependencies = [ModuleUser, ModuleProject]
  flowEditorSessions = new Map<string, EditorSession>()
}
