import type { Loose } from '@unshared/types'
import type { ModuleWorkspace, WorkspaceProjectSecret } from '..'
import { toConstantCase } from '@unshared/string'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'

/** A parser for the create project secret options. */
export const CREATE_PROJECT_SECRET_OPTIONS = createSchema({

  /** The user responsible for creating the project secret. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to create the project in. */
  workspace: assertStringNotEmpty,

  /** The project to create the secret for. */
  project: assertStringNotEmpty,

  /** The name of the secret to create. */
  name: [assertStringNotEmpty, toConstantCase],

  /** The value of the secret to create. */
  value: assertStringNotEmpty,
})

/** The options to create the project secret with. */
export type CreateProjectSecretOptions = Loose<ReturnType<typeof CREATE_PROJECT_SECRET_OPTIONS>>

/**
 * Create a new secret for the project with the given name and value. The function
 * will create a new secret with the given name and value and assign the user to
 * the secret with the given permission level. The function will throw an error if
 * the secret already exists in the project.
 *
 * @param options The options to create the project secret with.
 * @returns The newly created secret value.
 */
export async function createProjectSecret(this: ModuleWorkspace, options: CreateProjectSecretOptions): Promise<WorkspaceProjectSecret> {
  const { WorkspaceProjectSecret } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name, value } = CREATE_PROJECT_SECRET_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can create the secret.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })
  const secret = await WorkspaceProjectSecret.findOneBy({ project, name })
  if (secret) throw this.errors.PROJECT_SECRET_NAME_TAKEN(workspace.name, project.name, name)

  // --- Encrypt the secret value.
  const iv = randomBytes(16)
  const key = createHash('sha256').update(this.projectSecretKey).digest()
  const cipher = createCipheriv(this.projectSecretCypherAlgorithm, key, iv).update(value).toString('hex')
  const cipherOptions = { algorithm: this.projectSecretCypherAlgorithm, iv: iv.toString('base64') }

  // --- Create and return the secret.
  return WorkspaceProjectSecret.create({ project, name, cipher, options: cipherOptions })
}
