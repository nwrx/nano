/* eslint-disable unicorn/no-null */
import type { Encrypted } from '../../utils'
import type { StoragePoolType } from '../utils'
import { BaseEntity, transformerDate, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { User, UserObject } from '../../user'
import { Workspace } from '../../workspace'
import { StoragePoolAssignment } from './StoragePoolAssignment'

/**
 * A `StorageLocation` entity represents a location and it's associated adapter name
 * where files can be stored. It can be a local file system, an S3 bucket, or any other
 * storage adapter.
 */
@Entity({ name: 'StoragePool' })
@Unique(['name', 'workspace'])
export class StoragePool<T extends StoragePoolType = StoragePoolType> extends BaseEntity {

  /**
   * The name of the storage. It should be unique across the workspace.
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * A description of the pool. This is used to provide more information
   * about the pool and its purpose.
   *
   * @example 'Storage pool for document files.'
   */
  @Column('text')
  description = ''

  /**
   * The name of the storage adapter that is used to store files in this location.
   */
  @Column('varchar', { length: 255 })
  type: T

  /**
   * The configuration object that is used to initialize the storage adapter.
   */
  @Column('text', { transformer: transformerJson })
  configuration: Encrypted

  /**
   * The workspace that the pool belongs to. Variables within the workspace can
   * be stored in the pool and accessed by the workspace members. When the workspace
   * is not specified, the pool is considered a global pool.
   *
   * @example Workspace { ... }
   */
  @JoinColumn()
  @ManyToOne(() => Workspace, { nullable: true })
  workspace?: Workspace

  /**
   * The assignments of the storage pool. This is used to assign the storage pool to
   * different entities such as files, vaults, etc.
   */
  @OneToMany(() => StoragePoolAssignment, assignment => assignment.pool, { eager: true })
  assignments?: StoragePoolAssignment[]

  /**
   * The date at witch the pool was disabled. If the pool is disabled, it will
   * no longer be accessible to the workspace members.
   */
  @Column('varchar', { nullable: true, transformer: transformerDate })
  disabledAt: Date | null = null

  /**
   * The user that disabled the pool.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  disabledBy?: User

  /**
   * The user that created the pool.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  createdBy?: User

  /**
   * The user that updated the pool.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User

  /**
   * The user that deleted the pool.
   *
   * @example User { ... }
   */
  @JoinColumn()
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User

  /**
   * @param options The options to use to serialize the entity.
   * @returns The plain object representation of the entity.
   */
  serialize(options: SerializeOptions = {}): StoragePoolObject {
    const {
      withCreatedBy = false,
      withUpdatedBy = false,
      withDisabledBy = false,
      withDeleted = false,
    } = options
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      disabledAt: this.disabledAt ? this.disabledAt.toISOString() : undefined,
      disabledBy: withDisabledBy ? this.disabledBy?.serialize() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      updatedBy: withUpdatedBy ? this.updatedBy?.serialize() : undefined,
      updatedAt: withUpdatedBy ? this.updatedAt.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
    }
  }
}

interface SerializeOptions {
  withCreatedBy?: boolean
  withUpdatedBy?: boolean
  withDisabledBy?: boolean
  withDeleted?: boolean
}

export interface StoragePoolObject {
  name: string
  type: StoragePoolType
  description: string
  disabledAt?: string
  disabledBy?: UserObject
  createdBy?: UserObject
  createdAt?: string
  updatedBy?: UserObject
  updatedAt?: string
  deletedBy?: UserObject
  deletedAt?: string
}
