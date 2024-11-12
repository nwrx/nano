import type { WorkspaceProjectObject } from '../../workspace'
import type { MonitoringFlowThreadEventObject, MonitoringFlowThreadNodeEventObject, MonitoringFlowThreadObject } from '../entities'

export interface MonitoringSessionState {
  projects: WorkspaceProjectObject[]
  threads: MonitoringFlowThreadObject[]
  events: MonitoringFlowThreadEventObject[]
  nodeEvents: MonitoringFlowThreadNodeEventObject[]
  selectedProject: string | undefined
  selectedFlow: string | undefined
  selectedThread: string | undefined
  selectedEvent: string | undefined
}

export interface MonitoringSessionEventMap {
  init: MonitoringSessionState
  'threads:update': { threads: MonitoringFlowThreadObject[] }
  'threads:push': { thread: MonitoringFlowThreadObject }
  'events:update': { events: MonitoringFlowThreadEventObject[]; nodeEvents: MonitoringFlowThreadNodeEventObject[] }
  'events:push': { events: MonitoringFlowThreadEventObject[]; nodeEvents: MonitoringFlowThreadNodeEventObject[] }
  'event:update': { event: MonitoringFlowThreadEventObject }
  error: { message: string; name: string }
}

export type MonitoringSessionEventName = keyof MonitoringSessionEventMap
export type MonitoringSessionEventPayload<K extends MonitoringSessionEventName = MonitoringSessionEventName> =
  { [P in K]: { event: P } & MonitoringSessionEventMap[P] }[K]
