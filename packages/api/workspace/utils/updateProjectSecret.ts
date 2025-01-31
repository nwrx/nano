import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'

/** A parser for the update project secret options. */
export const UPDATE_PROJECT_SECRET_OPTIONS = createSchema({

  /** The user responsible for updating the project secret. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to update the project in. */
  workspace: assertStringNotEmpty,

  /** The project to update the secret for. */
  project: assertStringNotEmpty,

  /** The name of the secret to update. */
  name: assertStringNotEmpty,

  /** The new value of the secret to update. */
  value: assertStringNotEmpty,
})

/** The options to update the project secret with. */
export type UpdateProjectSecretOptions = Loose<ReturnType<typeof UPDATE_PROJECT_SECRET_OPTIONS>>

/**
 * Update the secret for the project with the given name. The function will update
 * the secret with the given name and value and assign the user to the secret with
 * the given permission level. The function will throw an error if the secret does not
 * exist in the project.
 *
 * @param options The options to update the project secret with.
 * @returns The updated secret value.
 */
export async function updateProjectSecret(this: ModuleWorkspace, options: UpdateProjectSecretOptions): Promise<void> {
  const { WorkspaceProjectSecret } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name, value } = UPDATE_PROJECT_SECRET_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can update the secret.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })
  const secret = await WorkspaceProjectSecret.findOneByOrFail({ project, name })

  // --- Encrypt the secret value.
  const iv = randomBytes(16)
  const key = createHash('sha256').update(this.projectSecretKey).digest()
  const cipher = createCipheriv(this.projectSecretCypherAlgorithm, key, iv).update(value).toString('hex')
  const cipherOptions = { algorithm: this.projectSecretCypherAlgorithm, iv: iv.toString('base64') }

  // --- Update and return the secret.
  secret.cipher = cipher
  secret.options = cipherOptions
  await WorkspaceProjectSecret.save(secret)
}
