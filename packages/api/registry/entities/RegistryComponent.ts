import { Schema } from '@nwrx/nano/utils'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, ManyToOne, Unique } from 'typeorm'
import { User } from '../../user'
import { RegistryCollection } from './RegistryCollection'

@Entity({ name: 'RegistryComponent' })
@Unique(['collection', 'name', 'version'])
export class RegistryComponent extends BaseEntity {

  /**
   * The collection that the component is associated with.
   *
   * @example Collection { name: 'notion', title: 'Notion', ... }
   */
  @ManyToOne(() => RegistryCollection, { onDelete: 'CASCADE', nullable: false })
  collection: RegistryCollection

  /**
   * The name of the component.
   *
   * @example 'notion-get-block'
   */
  @Column('varchar', { length: 255, unique: true })
  name: string

  /**
   * The version of the component. By default, the version is set to `draft`, which indicates
   * that the component is in development and not yet released. This allows use to store
   * multiple versions of the component in the registry and provide users with the ability
   * to select the version they want to use.
   *
   * @example '1.0.0'
   */
  @Column('varchar', { length: 255, default: 'draft' })
  version: string

  /**
   * The title of the component.
   *
   * @example 'Get Block'
   */
  @Column('varchar', { length: 255 })
  title: string

  /**
   * The description of the component.
   *
   * @example 'This component is used to get a block from Notion.'
   */
  @Column('text', { default: '' })
  description: string

  /**
   * The icon of the component.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar', { length: 255, default: '' })
  icon: string

  /**
   * The input properties of the component.
   *
   * @example { blockId: { type: 'string', required: true } }
   */
  @Column('text', { default: '{}', transformer: transformerJson })
  inputs: Schema

  /**
   * The output properties of the component.
   *
   * @example { block: { type: 'object', required: true } }
   */
  @Column('text', { default: '{}', transformer: transformerJson })
  outputs: Schema

  /**
   * The author of the component.
   *
   * @example User { ... }
   */
  @ManyToOne(() => User, { nullable: false })
  createdBy: User

  /**
   * The environment used in the code of the component. Additionally, the `environment`
   * property may reference built-in components using the `<native/core/component-name>`
   * syntax.
   *
   * @example 'javascript'
   */
  @Column('varchar', { default: 'javascript' })
  environment: 'builtin' | 'javascript' | 'typescript'

  /**
   * The code of the component. This code will be executed in an isolated environment
   * and can be used to perform custom logic that may not be possible with the built-in
   * components.
   *
   * @example 'console.log("Hello, world!")'
   */
  @Column('text', { default: '' })
  code: string
}
