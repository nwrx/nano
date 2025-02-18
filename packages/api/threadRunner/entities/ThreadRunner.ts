import { BaseEntity, transformerDate } from '@unserved/server'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'ThreadRunner' })
export class ThreadRunner extends BaseEntity {

  /**
   * The unique token used to authenticate the thread runner. This token is
   * provided by the thread runner when it is claimed by the API. This token
   * is used to make authenticated requests to the thread runner.
   *
   * @example "00000000-0000-0000-0000-000000000000"
   */
  @Column('varchar', { length: 255, unique: true })
  token: string

  /**
   * The base URL of the thread runner. This URL is used to make requests to
   * the thread runner and must be unique across all runners. It is used to
   * identify which runner is responsible for running specific threads.
   *
   * @example "http://localhost:3000"
   */
  @Column('varchar', { length: 255, nullable: false, unique: true })
  baseUrl: string

  /**
   * The last time the thread runner was pinged. This is used to determine if
   * the thread runner is still alive and responding to requests. If the thread
   * runner does not respond to a ping request within a certain time frame, it
   * is considered dead and will be removed from the list of active runners.
   */
  @Column('varchar', { transformer: transformerDate, length: 255 })
  lastSeenAt: Date

  /**
   * The user responsible for creating the thread runner. This user is the
   */

  /**
   * @returns The serialized representation of the thread runner.
   */
  serialize(): ThreadRunnerObject {
    return {
      baseUrl: this.baseUrl,
      createdAt: this.createdAt.toISOString(),
      lastSeenAt: this.lastSeenAt.toISOString(),
    }
  }
}

export interface ThreadRunnerObject {
  baseUrl: string
  createdAt: string
  lastSeenAt: string
}
