import type { EventStream } from '@unserved/server'
import type { H3Event } from 'h3'
import { createEventStream } from '@unserved/server'

export namespace IconCollectionEventData {
  export interface InstallStart {
    event: 'installStart'
    collection: string
  }
  export interface InstallDone {
    event: 'installDone'
    collection: string
  }

  export interface InstallIconStart {
    event: 'installIconStart'
    collection: string
    icon: string
    totalIcons: number
    currentIcon: number
  }

  export interface InstallIconDone {
    event: 'installIconDone'
    collection: string
    icon: string
    totalIcons: number
    currentIcon: number
  }

  export interface InstallError {
    event: 'installError'
    collection: string
    error: string
  }
}

export type IconCollectionEvents =
  | IconCollectionEventData.InstallDone
  | IconCollectionEventData.InstallIconDone
  | IconCollectionEventData.InstallIconStart
  | IconCollectionEventData.InstallStart

export class IconCollectionEventBus {
  constructor() {}

  peers = new Set<EventStream<IconCollectionEvents>>()

  subscribe(event: H3Event): EventStream<IconCollectionEvents> {
    const eventStream = createEventStream<IconCollectionEvents>(event)
    this.peers.add(eventStream)
    eventStream.h3EventStream.onClosed(() => this.peers.delete(eventStream))
    return eventStream
  }

  async broadcast(event: IconCollectionEvents): Promise<void> {
    for (const peer of this.peers) await peer.sendMessage(event)
  }
}
