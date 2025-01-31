import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { createDecipheriv, createHash } from 'node:crypto'

/** A parser for the get project secret options. */
export const READ_PROJECT_SECRET_OPTIONS = createSchema({

  /** The user responsible for getting the project secret. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to get the project secret in. */
  workspace: assertStringNotEmpty,

  /** The project to get the secret for. */
  project: assertStringNotEmpty,

  /** The name of the secret to get. */
  name: assertStringNotEmpty,
})

/** The options to get the project secret with. */
export type ReadProjectSecretOptions = Loose<ReturnType<typeof READ_PROJECT_SECRET_OPTIONS>>

/**
 * Get the secret for the project with the given name. The function will return the
 * secret with the given name if it exists in the project. The function will throw
 * an error if the secret does not exist in the project.
 *
 * @param options The options to get the project secret with.
 * @returns The secret value.
 */
export async function readProjectSecret(this: ModuleWorkspace, options: ReadProjectSecretOptions): Promise<string> {
  const { WorkspaceProjectSecret } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name } = READ_PROJECT_SECRET_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can get the secret.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })
  const secret = await WorkspaceProjectSecret.findOneBy({ project, name })
  if (!secret) throw this.errors.PROJECT_SECRET_NOT_FOUND(workspace.name, project.name, name)

  // --- Decrypt the secret value.
  const key = createHash('sha256').update(this.projectSecretKey).digest()
  const iv = Buffer.from(secret.options.iv, 'base64')
  return createDecipheriv(secret.options.algorithm, key, iv).update(secret.cipher, 'hex').toString('utf8')
}
