import type { StoragePoolPermission } from '../utils'
import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User, UserObject } from '../../user'
import { StoragePool } from './StoragePool'

/**
 * A mapping of an `StoragePool` entity to a `User` entity. It
 * allows us to determine the ownership and permissions of the pool.
 */
@Entity({ name: 'StoragePoolAssignment' })
@Unique(['pool', 'user', 'permission'])
export class StoragePoolAssignment extends BaseEntity {

  /**
   * The `User` entity that owns the entity.
   */
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  /**
   * The `StoragePool` entity that is owned by the user.
   */
  @JoinColumn()
  @ManyToOne(() => StoragePool, pool => pool.assignments, { onDelete: 'CASCADE' })
  pool: StoragePool

  /**
   * The permission level of the user on the pool. If the user has the `OWNER` permission, they
   * can read, update, and delete the pool.
   */
  @Column('varchar', { length: 255 })
  permission: StoragePoolPermission

  /**
   * The user that created the assignment.
   */
  @ManyToOne(() => User, { nullable: false })
  createdBy?: User

  /**
   * The user that deleted the assignment.
   */
  @ManyToOne(() => User, { nullable: true })
  deletedBy?: User

  /**
   * @param options The options to use to serialize the entity.
   * @returns The plain object representation of the entity.
   */
  serialize(options: SerializeOptions = {}): StoragePoolAssignmentObject {
    const {
      withCreatedBy = false,
      withDeleted = false,
    } = options
    return {
      user: this.user.serialize(),
      permission: this.permission,
      createdAt: withCreatedBy ? this.createdAt.toISOString() : undefined,
      createdBy: withCreatedBy ? this.createdBy?.serialize() : undefined,
      deletedAt: withDeleted ? this.deletedAt?.toISOString() : undefined,
      deletedBy: withDeleted ? this.deletedBy?.serialize() : undefined,
    }
  }
}

interface SerializeOptions {
  withCreatedBy?: boolean
  withDeleted?: boolean
}

export interface StoragePoolAssignmentObject {
  user: UserObject
  permission: StoragePoolPermission
  createdAt?: string
  createdBy?: UserObject
  deletedAt?: string
  deletedBy?: UserObject
}
