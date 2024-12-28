/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import type {
  EventConfirmRequest,
  EventMessage,
  EventMessageDelta,
  EventMessageDeltaEnd,
  EventMessageDeltaStart,
  EventQuestion,
  EventRequest,
  EventRequestError,
  EventRequestResponse,
  EventToolError,
  EventToolRequest,
  EventToolResponse,
} from '../components'
import type { EventMetadata } from '../utils'
import type { EventResponse } from './sendResponse'

export type ThreadEventMap = {
  'start': [input: ObjectLike, metadata: EventMetadata]
  'error': [error: Error, metadata: EventMetadata]
  'abort': [metadata: EventMetadata]
  'input': [name: string, value: unknown, metadata: EventMetadata]
  'output': [name: string, value: unknown, metadata: EventMetadata]
  'done': [output: ObjectLike, metadata: EventMetadata]
  'nodeState': [nodeId: string, metadata: EventMetadata]
  'nodeError': [nodeId: string, error: Error, metadata: EventMetadata]
  'nodeEvent': [nodeId: string, trace: Event, metadata: EventMetadata]
  'nodeStart': [nodeId: string, data: ObjectLike, metadata: EventMetadata]
  'nodeDone': [nodeId: string, result: ObjectLike, metadata: EventMetadata]

  // Questions.
  'nodeResponse': [nodeId: string, event: EventResponse, metadata: EventMetadata]
  'nodeQuestionRequest': [nodeId: string, event: EventQuestion, metadata: EventMetadata]
  'nodeQuestionCancel': [nodeId: string, eventId: string, metadata: EventMetadata]
  'nodeConfirmRequest': [nodeId: string, event: EventConfirmRequest, metadata: EventMetadata]

  // Messages
  'nodeMessage': [nodeId: string, event: EventMessage, metadata: EventMetadata]
  'nodeMessageDelta': [nodeId: string, event: EventMessageDelta, metadata: EventMetadata]
  'nodeMessageDeltaStart': [nodeId: string, event: EventMessageDeltaStart, metadata: EventMetadata]
  'nodeMessageDeltaEnd': [nodeId: string, event: EventMessageDeltaEnd, metadata: EventMetadata]

  // Tools
  'nodeToolRequest': [nodeId: string, event: EventToolRequest, metadata: EventMetadata]
  'nodeToolResponse': [nodeId: string, event: EventToolResponse, metadata: EventMetadata]
  'nodeToolError': [nodeId: string, event: EventToolError, metadata: EventMetadata]

  // Fetch
  'nodeRequest': [nodeId: string, event: EventRequest, metadata: EventMetadata]
  'nodeRequestResponse': [nodeId: string, event: EventRequestResponse, metadata: EventMetadata]
  'nodeRequestError': [nodeId: string, event: EventRequestError, metadata: EventMetadata]
}
