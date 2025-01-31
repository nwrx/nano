import { BaseEntity, transformerJson } from '@unserved/server'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { FlowRun } from './FlowRun'

/**
 * A `FlowRunEvent` is used to log the events that occurred during the execution
 * of a flow. It is used to store the information about the event such as the
 * type, message, etc.
 */
@Entity({ name: 'FlowRunEvent' })
export class FlowRunEvent extends BaseEntity {

  /**
   * The type of the event.
   *
   * @example 'info'
   */
  @Column('varchar', { length: 255 })
  event: string

  /**
   * The data associated with the event.
   *
   * @example { message: 'Flow started' }
   */
  @Column('json', { default: '{}', transformer: transformerJson })
  data: Record<string, unknown>

  /**
   * The flow run that the event is part of.
   *
   * @example FlowRun { ... }
   */
  @JoinColumn()
  @ManyToOne(() => FlowRun, run => run.events, { onDelete: 'CASCADE' })
  run: FlowRun

  /**
   * @returns The object representation of the event.
   */
  serialize(): FlowRunEventObject {
    return {
      id: this.id,
      event: this.event,
      data: this.data,
    }
  }
}

export interface FlowRunEventObject {
  id: string
  event: string
  data: Record<string, unknown>
}
