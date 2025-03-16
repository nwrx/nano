/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { ObjectLike } from '@unshared/types'
import type {
  EventConfirmRequest,
  // EventMessage,
  EventMessageDelta,
  EventMessageDeltaEnd,
  EventMessageDeltaStart,
  EventQuestion,
  EventRequest,
  EventRequestError,
  EventRequestResponse,
  EventResponse,
  EventToolError,
  EventToolRequest,
  EventToolResult,
  LanguageModelMessage,
} from '../components'
import type { EventMetadata } from '../utils'
import type { NodeState } from './addNode'

export type ThreadEventMap = {
  'start': [input: ObjectLike]
  'error': [error: Error]
  'abort': [metadata: EventMetadata]
  'input': [name: string, value: unknown]
  'done': [output: ObjectLike]

  // Node events.
  'nodeState': [nodeId: string, state: NodeState]
  'nodeError': [nodeId: string, error: Error]
  'nodeEvent': [nodeId: string, trace: Event]
  'nodeStart': [nodeId: string, data: ObjectLike]
  'nodeDone': [nodeId: string, result: ObjectLike]
  'nodeOutput': [nodeId: string, name: string, value: unknown]
  'nodeOutputDeltaStart': [nodeId: string, name: string]
  'nodeOutputDelta': [nodeId: string, name: string, value: string]
  'nodeOutputDeltaEnd': [nodeId: string, name: string]

  // Questions.
  'nodeResponse': [nodeId: string, event: EventResponse]
  'nodeQuestionRequest': [nodeId: string, event: EventQuestion]
  'nodeQuestionCancel': [nodeId: string, eventId: string]
  'nodeConfirmRequest': [nodeId: string, event: EventConfirmRequest]

  // Messages
  'nodeMessage': [nodeId: string, event: LanguageModelMessage]
  'nodeMessageDeltaStart': [nodeId: string, event: EventMessageDeltaStart]
  'nodeMessageDelta': [nodeId: string, event: EventMessageDelta]
  'nodeMessageDeltaEnd': [nodeId: string, event: EventMessageDeltaEnd]

  // Tools
  'nodeToolRequest': [nodeId: string, event: EventToolRequest]
  'nodeToolResponse': [nodeId: string, event: EventToolResult]
  'nodeToolError': [nodeId: string, event: EventToolError]

  // Fetch
  'nodeRequest': [nodeId: string, event: EventRequest]
  'nodeRequestResponse': [nodeId: string, event: EventRequestResponse]
  'nodeRequestError': [nodeId: string, event: EventRequestError]
}
