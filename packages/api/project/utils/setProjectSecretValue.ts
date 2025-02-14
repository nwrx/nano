import type { CipherGCMTypes } from 'node:crypto'
import type { ProjectSecret } from '../entities'
import { createCipheriv, randomBytes, scrypt } from 'node:crypto'
import { ERRORS } from './errors'

export interface CreateSecretCipherOptions {
  secret: string
  algorithm: CipherGCMTypes
}

export interface SecretCipher {
  iv: string
  salt: string
  cipher: string
}

export async function setProjectSecretValue(entity: ProjectSecret, value: string, options: CreateSecretCipherOptions): Promise<void> {
  const { secret, algorithm } = options

  // --- Ensure a key is provided and that the algorithm is GCM.
  // --- We only support GCM because it provides authenticated encryption
  // --- and allows us to verify the integrity of the encrypted data.
  const isGCM = ['aes-256-gcm', 'aes-128-gcm', 'aes-192-gcm'].includes(algorithm)
  if (!isGCM) throw ERRORS.PROJECT_SECRET_ENCRYPTION_ALGORITHM_NOT_SUPPORTED(algorithm)
  if (!secret) throw ERRORS.PROJECT_SECRET_ENCRYPTION_KEY_REQUIRED()

  // --- Encrypt the secret value.
  const iv = randomBytes(16)
  const salt = randomBytes(32)
  const key = await new Promise<Buffer>((resolve, reject) => {
    scrypt(secret, salt, 32, (error, key) => {
      if (error) return reject(error)
      resolve(key)
    })
  })

  // --- Create a cipher using the algorithm, key, and iv.
  const cipher = createCipheriv(algorithm, key, iv)
  const d1 = cipher.update(value, 'utf8', 'base64')
  const d2 = cipher.final('base64')

  // --- Update the entity with the encrypted value.
  entity.iv = iv.toString('base64')
  entity.tag = cipher.getAuthTag().toString('base64')
  entity.salt = salt.toString('base64')
  entity.cipher = d1 + d2
  entity.algorithm = algorithm
}
