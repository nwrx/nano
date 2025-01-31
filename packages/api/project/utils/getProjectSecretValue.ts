import type { ProjectSecret } from '../entities'
import { createDecipheriv, scrypt } from 'node:crypto'
import { ERRORS } from './errors'

export async function getProjectSecretValue(entity: ProjectSecret, secret: string): Promise<string> {

  // --- Ensure a key is provided.
  if (!secret) throw ERRORS.PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED()

  // --- Decrypt the secret value.
  const iv = Buffer.from(entity.iv, 'base64')
  const salt = Buffer.from(entity.salt, 'base64')
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(secret, salt, 32, (error, key) => {
      if (error) return reject(error)
      resolve(key)
    })
  })

  // --- Create a decipher using the algorithm, key, and iv.
  const tag = Buffer.from(entity.tag, 'base64')
  const decipher = createDecipheriv(entity.algorithm, key, iv)
  decipher.setAuthTag(tag)
  const d1 = decipher.update(entity.cipher, 'base64', 'utf8')
  const d2 = decipher.final('utf8')
  return d1 + d2
}
