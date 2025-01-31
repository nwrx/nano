import type { Thread } from '@nwrx/nano'
import type { Peer } from 'crossws'
import type { UUID } from 'node:crypto'
import type { User } from '../../user'
import type { ChatThread } from '../entities'
import type { ChatMessageData, ModuleChat } from '../index'
import type { ChatClientMessage } from './chatClientMessage'
import type { ChatServerMessage } from './chatServerMessage'
import { env } from 'node:process'
import { ModuleFlow } from '../../flow'

export interface ChatSessionOptions {
  workspace: string
  user: User
}

export class ChatSession {
  constructor(public moduleThread: ModuleChat, public options: ChatSessionOptions) {}

  peers: Peer[] = []
  thread: Thread | undefined
  chat: ChatThread | undefined

  subscribe(peer: Peer) {
    const isSubscribed = this.peers.some(p => p.id === peer.id)
    if (isSubscribed) return
    this.peers.push(peer)
  }

  unsubscribe(peer: Peer) {
    const index = this.peers.findIndex(p => p.id === peer.id)
    if (index !== -1) this.peers.splice(index, 1)
  }

  broadcast(message: ChatServerMessage) {
    for (const peer of this.peers) peer.send(message)
  }

  async createThread(project: string, name: string) {
    const { workspace, user } = this.options
    const flowModule = this.moduleThread.getModule(ModuleFlow)
    const flow = await flowModule.resolveFlow({ workspace, project, name, user, permission: 'Execute' })
    this.thread = flowModule.loadThreadFromJson(flow)

    // --- Create thread entity
    const { ChatThread } = this.moduleThread.getRepositories()
    const { data, title, description } = flow
    this.chat = ChatThread.create({ flow, data, createdBy: user, title, description, messages: [] })
    return this.chat
  }

  async openThread(id: UUID) {
    const flowModule = this.moduleThread.getModule(ModuleFlow)
    const { ChatThread } = this.moduleThread.getRepositories()
    const chat = await ChatThread.findOne({ where: { id }, relations: { flow: true, messages: true } })
    if (!chat) throw new Error(`Chat with id "${id}" not found.`)
    this.thread = flowModule.loadThreadFromJson(chat.flow)
    this.chat = chat
    return this.chat
  }

  async addMessage(data: ChatMessageData) {
    if (!this.chat) throw new Error('The chat thread does not exist.')
    const { ChatThread, ChatMessage } = this.moduleThread.getRepositories()
    const message = ChatMessage.create({ data })
    this.chat.messages = this.chat.messages ? [...this.chat.messages, message] : [message]
    await ChatThread.save(this.chat)
    this.broadcast({
      event: 'message',
      id: message.id,
      data: message.data,
      createdAt: message.createdAt.toUTCString(),
    })
    return message.data
  }

  async onMessage(peer: Peer, payload: ChatClientMessage) {
    try {

      /***************************************************************************/
      /* Lifecycle                                                               */
      /***************************************************************************/

      if (payload.event === 'createThread') {
        const { project, name } = payload
        const thread = await this.createThread(project, name)
        this.broadcast({
          event: 'threadOpened',
          id: thread.id,
          title: thread.title,
          summary: thread.description,
          messages: thread.messages!.map(message => message.serialize()),
        })
      }

      if (payload.event === 'openThread') {
        const { id } = payload
        const thread = await this.openThread(id)
        this.broadcast({
          event: 'threadOpened',
          id: thread.id,
          title: thread.title,
          summary: thread.description,
          messages: thread.messages!.map(message => message.serialize()),
        })
      }

      /***************************************************************************/
      /* Input                                                                   */
      /***************************************************************************/

      if (payload.event === 'message') {
        if (!this.thread) throw new Error('The thread does not exist.')
        const { message } = payload
        const { user } = this.options

        // --- Add user message to chat.
        await this.addMessage({
          role: 'user',
          name: user.username,
          content: message,
        })

        this.thread.on('output', (name, content) => this.addMessage({ role: 'assistant', name, content: String(content) }))
        this.thread.on('error', error => this.addMessage({ role: 'assistant', name: 'Error', content: error.message }))

        this.thread.on('nodeTrace', (_, trace) => this.addMessage({
          role: 'assistant',
          name: 'Node Trace',
          content: JSON.stringify(trace, null, 2),
        }))

        await this.thread.start({ Message: message })
      }
    }
    catch (error) {
      this.broadcast({
        event: 'error',
        message: (error as Error).message,
        stack: env.NODE_ENV === 'production' ? undefined : (error as Error).stack,
      })
    }
  }
}

export function createSession(this: ModuleChat, options: ChatSessionOptions) {
  return new ChatSession(this, options)
}
