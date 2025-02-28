import type { Schema } from '@nwrx/nano/utils'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { User } from '../../user'
import { RegistryCategory, RegistryCategoryObject } from './RegistryCategory'
import { RegistryCollection, RegistryCollectionObject } from './RegistryCollection'

export type RegistryComponentEnvironment =
  | 'builtin'
  | 'ecmascript2024'
  | 'nanoflow1'
  | 'python39'
  | 'typescript'

@Entity({ name: 'RegistryComponent' })
@Index(['collection', 'name', 'version', 'deletedAt'], { unique: true })
export class RegistryComponent extends BaseEntity {

  /**
   * The collection that the component is associated with.
   *
   * @example Collection { name: 'notion', title: 'Notion', ... }
   */
  @ManyToOne(() => RegistryCollection, { nullable: false })
  collection: RegistryCollection

  /**
   * The categories that the component is associated with.
   *
   * @example RegistryCategory { name: 'storage', ... }
   */
  @JoinTable({ name: 'RegistryComponentCategory' })
  @ManyToMany(() => RegistryCategory)
  categories: RegistryCategory[] | undefined

  /**
   * The author of the component.
   *
   * @example User { ... }
   */
  @ManyToOne(() => User)
  createdBy: null | undefined | User

  /**
   * The name of the component.
   *
   * @example 'notion-get-block'
   */
  @Column('varchar')
  name: string

  /**
   * The version of the component. By default, the version is set to `draft`, which indicates
   * that the component is in development and not yet released. This allows use to store
   * multiple versions of the component in the registry and provide users with the ability
   * to select the version they want to use.
   *
   * @example '1.0.0'
   */
  @Column('varchar')
  version = '1.0.0'

  /**
   * The title of the component.
   *
   * @example 'Get Block'
   */
  @Column('varchar')
  title: string

  /**
   * The description of the component.
   *
   * @example 'This component is used to get a block from Notion.'
   */
  @Column('text')
  description = ''

  /**
   * The icon of the component.
   *
   * @example 'https://example.com/icon.png'
   */
  @Column('varchar')
  icon = ''

  /**
   * The input properties of the component.
   *
   * @example { blockId: { type: 'string', required: true } }
   */
  @Column('text', { transformer: transformerJson })
  inputs: Record<string, Schema> = {}

  /**
   * The output properties of the component.
   *
   * @example { block: { type: 'object', required: true } }
   */
  @Column('text', { transformer: transformerJson })
  outputs: Record<string, Schema> = {}

  /**
   * The environment used in the code of the component. Additionally, the `environment`
   * property may reference built-in components using the `<nanoworks/core/component-name>`
   * syntax.
   *
   * @example 'javascript'
   */
  @Column('varchar')
  environment: RegistryComponentEnvironment = 'builtin'

  /**
   * The code of the component. This code will be executed in an isolated environment
   * and can be used to perform custom logic that may not be possible with the built-in
   * components.
   *
   * @example 'console.log("Hello, world!")'
   */
  @Column('text')
  code = '<BUILTIN>'

  /**
   * @param options The serialization options.
   * @returns The serialized representation of the component.
   */
  serialize(options: SerializeOptions = {}): RegistryComponentObject {
    const { withInputs, withOutputs, withCategories, withCollection, ...serializeCollectionOptions } = options
    return {
      name: this.name,
      version: this.version,
      title: this.title,
      description: this.description,
      icon: this.icon,
      environment: this.environment,
      inputs: withInputs ? this.inputs : undefined,
      outputs: withOutputs ? this.outputs : undefined,
      collection: withCollection ? this.collection.serialize(serializeCollectionOptions) : undefined,
      categories: withCategories ? this.categories?.map(category => category.serialize()) : undefined,
    }
  }
}

interface SerializeOptions {
  withInputs?: boolean
  withOutputs?: boolean
  withCategories?: boolean
  withCollection?: boolean
}

export interface RegistryComponentObject {
  name: string
  version: string
  title: string
  description: string
  icon: string
  environment: RegistryComponentEnvironment
  inputs?: Record<string, Schema>
  outputs?: Record<string, Schema>
  collection?: RegistryCollectionObject
  categories?: RegistryCategoryObject[]
}
