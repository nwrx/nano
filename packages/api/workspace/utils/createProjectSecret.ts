import type { Loose } from '@unshared/types'
import type { WorkspaceProjectSecret } from '../entities'
import type { ModuleWorkspace } from '../index'
import { toConstantCase } from '@unshared/string'
import { assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { createCipheriv, createHash, randomBytes } from 'node:crypto'

export const CREATE_PROJECT_SECRET_OPTIONS = createSchema({

  /** The workspace to create the project in. */
  workspace: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

  /** The project to create the secret for. */
  project: createSchema({ id: assertStringUuid, name: assertStringNotEmpty }),

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
  const { workspace, project, name, value } = CREATE_PROJECT_SECRET_OPTIONS(options)

  // --- Assert the user has access to the workspace and the project.
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
