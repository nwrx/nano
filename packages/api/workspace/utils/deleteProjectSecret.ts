import type { ModuleWorkspace } from '../index'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'

/** A parser for the delete project secret options. */
export const DELETE_PROJECT_SECRET_OPTIONS = createSchema({

  /** The user responsible for deleting the project secret. */
  user: createSchema({ id: assertStringUuid }),

  /** The workspace to delete the project secret from. */
  workspace: assertStringNotEmpty,

  /** The project to delete the secret from. */
  project: assertStringNotEmpty,

  /** The name of the secret to delete. */
  name: assertStringNotEmpty,
})

/** The options to delete the project secret with. */
export type DeleteProjectSecretOptions = ReturnType<typeof DELETE_PROJECT_SECRET_OPTIONS>

/**
 * Delete a secret from a project.
 *
 * @param options The options required to delete the secret.
 * @returns A promise that resolves when the secret is deleted.
 */
export async function deleteProjectSecret(this: ModuleWorkspace, options: DeleteProjectSecretOptions): Promise<void> {
  const { WorkspaceProjectSecret } = this.getRepositories()
  const { user, workspace: workspaceName, project: projectName, name } = DELETE_PROJECT_SECRET_OPTIONS(options)

  // --- Resolve the workspace and project and check if the user can delete the secret.
  const workspace = await this.resolveWorkspace({ user, name: workspaceName, permission: 'Read' })
  const project = await this.resolveProject({ workspace, name: projectName, permission: 'WriteSecrets' })

  // --- Delete the secret.
  await WorkspaceProjectSecret.delete({ project, name })
}
