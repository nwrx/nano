import type { ModuleWorkspace } from '../index'
import { ModuleUser } from '@nwrx/api'
import { createRoute } from '@unserved/server'
import { assertStringConstantCase, assertStringNotEmpty, assertStringUuid, createSchema } from '@unshared/validation'
import { createCipheriv, createHash } from 'node:crypto'

export function projectSecretCreate(this: ModuleWorkspace) {
  return createRoute(
    {
      name: 'POST /api/workspaces/:workspace/:project/secrets',
      parameters: createSchema({
        workspace: assertStringNotEmpty,
        project: assertStringUuid,
      }),
      body: createSchema({
        name: assertStringConstantCase,
        value: assertStringNotEmpty,
      }),
    },
    async({ event, body, parameters }) => {
      const user = await this.getModule(ModuleUser).authenticate(event)
      const { name, value } = body
      const { workspace, project } = parameters

      // --- Fetch the project.
      const workspaceResolved = await this.resolveWorkspace({ user, name: workspace, permission: 'Read' })
      const { id } = await this.resolveProject({ user, workspace: workspaceResolved, name: project, permission: 'WriteSecrets' })

      // --- Encrypt the value using the external secret key.
      const iv = Buffer.alloc(16, 0)
      const key = createHash('sha256').update(this.projectSecretKey).digest()
      const valueEncrypted = createCipheriv('aes-256-cbc', key, iv).setAutoPadding(true).update(value).toString('hex')

      // --- Create the secret.
      const { WorkspaceProject, WorkspaceProjectSecret } = this.getRepositories()
      const projectToUpdate = await WorkspaceProject.findOneByOrFail({ id })
      const secret = WorkspaceProjectSecret.create({ name, value: valueEncrypted, project: { id } })
      projectToUpdate.secrets!.push(secret)
    },
  )
}
