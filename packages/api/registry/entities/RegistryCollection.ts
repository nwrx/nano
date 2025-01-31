import { BaseEntity } from '@unserved/server'
import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from '../../user'

@Entity({ name: 'RegistryCollection' })
export class RegistryCollection extends BaseEntity {

  /** The name of the collection. */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /** The title of the collection. */
  @Column('varchar', { length: 255 })
  title: string

  /** The icon of the collection. */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /** The description of the collection. */
  @Column('text', { default: '' })
  description: string

  /** The author of the collection. */
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  createdBy: User
}
