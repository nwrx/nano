import type { StoragePool } from '../entities'
import type { ModuleStorage } from '../index'
import { IsNull } from 'typeorm'
import { encrypt } from '../../utils'

/**
 * Get the public storage pool. This function will automatically create the
 * public storage pool if it does not exist.
 *
 * @returns The public storage pool.
 * @example
 *
 * // Get the public storage pool.
 * const publicPool = await getPublicPool.call(storageModule)
 *
 * // Get the adapter for the public pool.
 * const publicPoolAdapter = await getPoolAdapter.call(storageModule, publicPool)
 * const file = await StorageFile.findOneBy({ id: 'some-file-id' })
 * const result = await publicPoolAdapter.download(file)
 */
export async function getPublicPool(this: ModuleStorage): Promise<StoragePool> {
  if (this.publicPool) return this.publicPool
  if (!this.publicPoolType) throw new Error('No public storage pool configured')
  if (!this.publicPoolConfiguration) throw new Error('No public storage pool configuration provided')

  // --- If the pool does not exist, create and return it.
  // --- First, serialize the configuration and encrypt it.
  const configurationJson = JSON.stringify(this.publicPoolConfiguration)
  const configuration = await encrypt(
    configurationJson,
    this.encryptionKey,
    this.encryptionAlgorithm,
  )

  // --- Check if the public pool exists in the database.
  const { StoragePool } = this.getRepositories()
  const pool = await StoragePool.findOneBy({ workspace: IsNull(), name: 'default' })

  // --- Create the public pool entity.
  if (!pool) {
    const publicPool = StoragePool.create({ name: 'default', type: this.publicPoolType, configuration })
    const savedPool = await StoragePool.save(publicPool)
    this.publicPool = savedPool
    return savedPool
  }

  // --- If the pool exists, update its configuration if it has changed.
  pool.configuration = configuration
  const updatedPool = await StoragePool.save(pool)
  this.publicPool = updatedPool
  return updatedPool
}
