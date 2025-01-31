import { BaseEntity } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm'
import { User, UserObject } from '../../user'
import { StorageFile } from './StorageFile'

/**
 * A mapping of an `StorageFile` entity to a `User` entity. It
 * allows us to determine the ownership and permissions of the file.
 */
@Entity({ name: 'StorageFileAssignment' })
@Unique(['file', 'user', 'permission'])
export class StorageFileAssignment extends BaseEntity {

  /**
   * The `User` entity that owns the entity.
   */
  @JoinColumn()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  /**
   * The `StorageFile` entity that is owned by the user.
   */
  @JoinColumn()
  @ManyToOne(() => StorageFile, file => file.assignments, { onDelete: 'CASCADE' })
  file: StorageFile

  /**
   * The permission level of the user on the file. If the user has the `OWNER` permission, they
   * can read, update, and delete the file.
   */
  @Column('varchar', { length: 255 })
  permission: 'EDIT' | 'OWNER' | 'READ'

  /**
   * @returns The plain object representation of the entity.
   */
  serialize(): StorageFileAssignmentObject {
    return {
      user: this.user.serialize(),
      permission: this.permission,
    }
  }
}

/** Serialzed representation of the `StorageFolderOwner` entity. */
export interface StorageFileAssignmentObject {
  user: UserObject
  permission: 'EDIT' | 'OWNER' | 'READ'
}
