import { ThreadEventMap } from '@nwrx/nano'
import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Thread } from './Thread'

@Entity({ name: 'ThreadEvent' })
export class ThreadEvent<T extends keyof ThreadEventMap = keyof ThreadEventMap> extends BaseEntity {

  @JoinColumn()
  @ManyToOne(() => Thread, run => run.events, { nullable: false, onDelete: 'RESTRICT' })
  thread: Thread

  @Column('varchar', { length: 255 })
  event: T

  @Column('json', { default: '{}', transformer: transformerJson })
  data: ThreadEventMap[T]

  serialize(): ThreadEventObject {
    return {
      id: this.id,
      event: this.event,
      data: this.data,
      createdAt: this.createdAt.toISOString(),
    }
  }
}

export interface ThreadEventObject<T extends keyof ThreadEventMap = keyof ThreadEventMap> {
  id: string
  event: T
  data: ThreadEventMap[T]
  createdAt: string
}
