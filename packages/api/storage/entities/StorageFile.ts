import { BaseEntity } from '@unserved/server'
import { UUID } from 'node:crypto'
import { Column, Entity, OneToMany } from 'typeorm'
import { StorageFileAssignment, StorageFileAssignmentObject } from './StorageFileAssignment'

/**
 * An asset is a digital file that can be used in the application. For example, an image,
 * a video, a document, etc. It is used to store the metadata and remote URL of the asset
 * in the database.
 */
@Entity({ name: 'StorageFile' })
export class StorageFile extends BaseEntity {

  /**
   * The path of the asset as if it was in a filesystem. It is used to determine the
   * directory structure of the asset.
   *
   * @example '/images'
   */
  @Column('varchar', { length: 255 })
  name: string

  /**
   * The MD5 hash of the asset. It is used to determine the integrity of the asset. It is
   * used to set the `ETag` header in the HTTP response and compare it with the client's
   * `If-None-Match` header. It also helps avoid duplicate assets in the database.
   */
  @Column('varchar', { length: 255, unique: true })
  hash: string

  /**
   * The MIME type of the asset. It is used to determine the type of the asset such as
   * image, video, document, etc. It is used to set the `type` attribute of the asset in
   * the HTML.
   *
   * @example 'image/jpeg'
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
   */
  @Column('varchar', { length: 255 })
  type: string

  /**
   * The size of the asset. It is used to determine the size of the asset in bytes. It is
   * used to set the `Content-Length` header in the HTTP response.
   *
   * @example 1024
   */
  @Column('int')
  size: number

  /**
   * If the file was uploaded from a remote URL, this field contains the URL of the remote
   * file. It is used to determine the source of the asset and the ability to download the
   * asset from the remote URL.
   */
  @Column('text')
  source?: string

  /**
   * A reference to the owner of the entity. It is used to determine who has the permission to
   * read, update, or delete the entity.
   */
  @OneToMany(() => StorageFileAssignment, owner => owner.file)
  assignments?: StorageFileAssignment[]

  /**
   * @returns The plain object representation of the entity.
   */
  serialize(): StorageFileObject {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      size: this.size,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      assignments: this.assignments?.map(x => x.serialize()),
    }
  }
}

/** Serialzed representation of the `StorageFile` entity. */
export interface StorageFileObject {
  id: UUID
  name: string
  type: string
  size: number
  createdAt: string
  updatedAt: string
  assignments?: StorageFileAssignmentObject[]
}
