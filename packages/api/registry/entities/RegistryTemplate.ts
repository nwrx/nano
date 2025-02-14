import { FlowV1 } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, Unique } from 'typeorm'

@Entity({ name: 'RegistryTemplate' })
@Unique('Unique', ['name', 'project'])
export class RegistryTemplate extends BaseEntity {

  @Column('varchar', { unique: false })
  name: string

  @Column('varchar')
  title: string

  @Column('text')
  description: string

  @Column('json', { default: '{"version":"1"}', transformer: transformerJson })
  data: FlowV1 = { version: '1', nodes: {}, metadata: {} }

  serialize(options: SerializeOptions = {}): FlowObject {
    return {
      id: this.id,
      name: this.name,
      title: this.title,
      description: this.description,
      data: options.withData ? this.data : undefined,
    }
  }
}

interface SerializeOptions {
  withData?: boolean
}
export interface FlowObject {
  id: string
  name: string
  title: string
  description?: string
  data?: FlowV1
}
