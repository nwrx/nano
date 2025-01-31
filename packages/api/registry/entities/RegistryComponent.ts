import { Schema } from '@nwrx/core/utils'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from '../../user'
import { RegistryCategory } from './RegistryCategory'

@Entity({ name: 'RegistryComponent' })
export class RegistryComponent extends BaseEntity {

  /** The name of the component. */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /** The title of the component. */
  @Column('varchar', { length: 255 })
  title: string

  /** The icon of the component. */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /** The description of the component. */
  @Column('text', { default: '' })
  description: string

  /** The input properties of the component. */
  @Column('json', { default: '{}', transformer: transformerJson })
  inputs: Schema

  /** The output properties of the component. */
  @Column('json', { default: '{}', transformer: transformerJson })
  outputs: Schema

  /** The author of the component. */
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  createdBy: User

  /** The category of the component. */
  @ManyToOne(() => RegistryCategory, { onDelete: 'CASCADE', nullable: false })
  category: RegistryCategory
}
