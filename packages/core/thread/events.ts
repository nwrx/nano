/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import type { ActionNotification, EventConfirmRequest, EventMetadata, EventQuestion } from '../utils'
import type { Node } from './addNode'
import type { EventConfirmation } from './sendConfirmation'
import type { EventResponse } from './sendResponse'

export interface ThreadEventFetchRequest {
  id: string
  url: string
  body?: ObjectLike
  method?: string
  headers?: ObjectLike
}

export interface ThreadEventFetchResponse {
  id: string
  json?: ObjectLike
  text?: string
  status: number
  statusText: string
}

export interface ThreadEventFetchError {
  id: string
  status: number
  statusText: string
}

export type ThreadEventMap = {
  'start': [input: ObjectLike, metadata: EventMetadata]
  'error': [error: Error, metadata: EventMetadata]
  'abort': [metadata: EventMetadata]
  'input': [name: string, value: unknown, metadata: EventMetadata]
  'output': [name: string, value: unknown, metadata: EventMetadata]
  'done': [output: ObjectLike, metadata: EventMetadata]
  'nodeState': [id: string, metadata: EventMetadata]
  'nodeAction': [id: string, event: ActionNotification, metadata: EventMetadata]
  'nodeError': [id: string, error: Error, metadata: EventMetadata]
  'nodeEvent': [id: string, trace: Event, metadata: EventMetadata]
  'nodeStart': [id: string, data: ObjectLike, metadata: EventMetadata]
  'nodeDone': [id: string, result: ObjectLike, metadata: EventMetadata]
  'nodeResponse': [id: string, event: EventResponse, metadata: EventMetadata]
  'nodeQuestionRequest': [id: string, event: EventQuestion, metadata: EventMetadata]
  'nodeQuestionCancel': [id: string, eventId: string, metadata: EventMetadata]
  'nodeConfirmRequest': [id: string, event: EventConfirmRequest, metadata: EventMetadata]
  'nodeToolCallRequest': [id: string, event: ThreadEventToolCallRequest, metadata: EventMetadata]
  'nodeToolCallResponse': [id: string, event: ThreadEventToolCallResponse, metadata: EventMetadata]
  'nodeToolCallError': [id: string, event: ThreadEventToolCallError, metadata: EventMetadata]
  'nodeFetchRequest': [id: string, event: ThreadEventFetchRequest, metadata: EventMetadata]
  'nodeFetchResponse': [id: string, event: ThreadEventFetchResponse, metadata: EventMetadata]
  'nodeFetchError': [id: string, event: ThreadEventFetchError, metadata: EventMetadata]
}
