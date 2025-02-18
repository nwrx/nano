import type { EditorSession } from './utils'
import { ModuleBase } from '@unserved/server'
import { ModuleProject } from '../project'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils/editorSessionServerMessage'
export type * from './utils/searchCategories'
export type * from './utils/serializeComponent'
export type * from './utils/serializeComponentInstance'
export type * from './utils/serializeInputSchema'
export type * from './utils/serializeOutputSchema'
export type * from './utils/serializeSession'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleFlowOptions {}

/**
 * The `ModuleFlow` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleFlow extends ModuleBase implements ModuleFlowOptions {
  constructor(_options: ModuleFlowOptions = {}) { super() }
  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleProject]

  /** A map of flow editor sessions. */
  flowEditorSessions = new Map<string, EditorSession>()

  /** Resolve a flow entity from the database. */
  getFlow = UTILS.getFlow.bind(this)
}
