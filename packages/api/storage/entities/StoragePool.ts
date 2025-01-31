import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Unique } from 'typeorm'

export type StoragePoolType =
  | 'AzureBlobStorage'
  | 'GoogleCloudStorage'
  | 'LocalFileSystem'
  | 'S3Compatible'
  // | 'Dropbox'
  // | 'OneDrive'
  // | 'GoogleDrive'
  // | 'Box'
  // | 'FTP'
  // | 'SFTP'
  // | 'WebDAV'
  // | 'OwnCloud'
  // | 'NextCloud'
  // | 'Git'
  // | 'GitLab'
  // | 'GitHub'

/**
 * A `StorageLocation` entity represents a location and it's associated adapter name
 * where files can be stored. It can be a local file system, an S3 bucket, or any other
 * storage adapter.
 */
@Entity({ name: 'StoragePool' })
@Unique(['name'])
export class StoragePool extends BaseEntity {

  /**
   * The name of the storage location. It should be unique across all storage locations.
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The name of the storage adapter that is used to store files in this location.
   */
  @Column('varchar', { length: 255 })
  type: StoragePoolType

  /**
   * The configuration object that is used to initialize the storage adapter.
   */
  @Column('text', { transformer: transformerJson })
  config: Record<string, any>

  /**
   * @returns The plain object representation of the entity.
   */
  serialize(): StoragePoolObject {
    return {
      name: this.name,
      type: this.type,
      config: this.config,
    }
  }
}

/** Serialized representation of the `StorageLocation` entity. */
export interface StoragePoolObject {
  name: string
  type: StoragePoolType
  config: Record<string, any>
}
