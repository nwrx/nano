import { BaseEntity } from '@unserved/server'
import { Entity, OneToMany } from 'typeorm'
// import { Flow } from '../../flow'
// import { User, UserObject } from '../../user'
import { ThreadEvent } from './ThreadEvent'

@Entity({ name: 'Thread' })
export class Thread extends BaseEntity {

  // @JoinColumn()
  // @ManyToOne(() => Flow, { onDelete: 'RESTRICT', nullable: false })
  // flow?: Flow

  @OneToMany(() => ThreadEvent, event => event.thread, { cascade: true })
  events?: ThreadEvent[]

  // @JoinColumn()
  // @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  // createdBy?: User

  serialize(): ThreadObject {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      // createdBy: this.createdBy?.serialize(),
      events: this.events?.map(event => event.serialize()),
    }
  }
}

export interface ThreadObject {
  id: string
  // createdBy?: UserObject
  createdAt: string
  events?: ThreadObject[]
}
