import type { Loose } from '@unshared/types'
import type { ModuleWorkspace } from '..'
import { assertStringNotEmpty, assertStringUuid, assertUndefined, createSchema } from '@unshared/validation'

/** A parser for the remove project secret options. */
export const REMOVE_PROJECT_SECRET_OPTIONS = createSchema({

  /** The user responsible for deleting the project secret. */
  user: [[assertUndefined], [createSchema({ id: assertStringUuid })]],

  /** The workspace to remove the secret in. */
  workspace: assertStringNotEmpty,

  /** The project to remove the secret for. */
  project: assertStringNotEmpty,

  /** The name of the secret to remove. */
  name: assertStringNotEmpty,
})

/** The options to remove the project secret with. */
export type RemoveProjectSecretOptions = Loose<ReturnType<typeof REMOVE_PROJECT_SECRET_OPTIONS>>

/**
 * Remove the secret for the project with the given name. The function will remove
 * the secret with the given name and assign the user to the secret with the given
 * permission level. The function will throw an error if the secret does not exist
 * in the project.
 *
 * @param options The options to remove the project secret with.
 * @returns The removed secret value.
 */
export async function removeProjectSecret(this: ModuleWorkspace, options: RemoveProjectSecretOptions): Promise<void> {
  const { WorkspaceProjectSecret } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name } = REMOVE_PROJECT_SECRET_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can remove the secret.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })
  const secret = await WorkspaceProjectSecret.findOneByOrFail({ project, name })

  // --- Unset the secret value and options.
  secret.cipher = ''
  secret.options = { algorithm: '', iv: '' }
  await WorkspaceProjectSecret.save(secret)

  // --- Soft remove the secret.
  await WorkspaceProjectSecret.softRemove(secret)
}
