import { BaseEntity } from '@unserved/server'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'RegistryCategory' })
export class RegistryCategory extends BaseEntity {

  /** The name of the category. */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /** The title of the category. */
  @Column('varchar', { length: 255 })
  title: string

  /** The icon of the category. */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /** The description of the category. */
  @Column('text', { default: '' })
  description: string

  /** The color of the category. */
  @Column('varchar', { length: 255, default: '#888888' })
  color: string
}
