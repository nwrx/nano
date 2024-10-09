import { ModuleBase } from '@unserved/server'
import { ModuleFlow } from '../flow'
import { ModuleUser } from '../user'
import * as ENTITIES from './entities'
import * as ROUTES from './routes'
import * as UTILS from './utils'

export * from './entities'
export type * from './utils'

export interface ModuleWorkspaceOptions {

  /**
   * The secret key used to encrypt the secret variables in the flows. This key
   * is defined in the environment variables and should be kept secret. If the
   * key is changed, the existing secrets will not be accessible.
   *
   * @default 'CHANGE_ME'
   */
  projectSecretKey?: string

  /**
   * The cypher algorithm used to encrypt the secret variables in the flows. The
   * algorithm is used to encrypt and decrypt the secrets using the secret key.
   *
   * @default 'aes-256-ctr'
   */
  projectSecretCypherAlgorithm?: string
}

/**
 * The `ModuleWorkspace` module is used to manage the workflows and modules in the
 * application. The module is used to create, import, edit, and delete workflows and
 * modules in the application.
 */
export class ModuleWorkspace extends ModuleBase implements ModuleWorkspaceOptions {
  constructor(options: ModuleWorkspaceOptions = {}) {
    super()
    if (options.projectSecretKey) this.projectSecretKey = options.projectSecretKey
    if (options.projectSecretCypherAlgorithm) this.projectSecretCypherAlgorithm = options.projectSecretCypherAlgorithm
  }

  errors = UTILS.ERRORS
  routes = ROUTES
  entities = ENTITIES
  dependencies = [ModuleUser, ModuleFlow]

  projectSecretKey = ''
  projectSecretCypherAlgorithm = 'aes-256-ctr'

  assignWorkspace = UTILS.assignWorkspace.bind(this)
  createProject = UTILS.createProject.bind(this)
  createProjectSecret = UTILS.createProjectSecret.bind(this)
  createProjectVariable = UTILS.createProjectVariable.bind(this)
  createWorkspace = UTILS.createWorkspace.bind(this)
  removeProjectSecret = UTILS.removeProjectSecret.bind(this)
  removeProjectVariable = UTILS.removeProjectVariable.bind(this)
  resolveWorkspace = UTILS.resolveWorkspace.bind(this)
  resolveProject = UTILS.resolveProject.bind(this)
  searchProjects = UTILS.searchProjects.bind(this)
  updateProjectSecret = UTILS.updateProjectSecret.bind(this)
  updateProjectVariable = UTILS.updateProjectVariable.bind(this)

  initialize(): Promise<void> {
    if (!this.projectSecretKey) throw new Error('The project secret key is required.')
    return Promise.resolve()
  }
}
