import type { MonitoringSessionEventPayload, MonitoringSessionState } from '@nwrx/api'
import { useAlerts, useClient } from '#imports'

export interface MonitoringSessionFilters {
  eventNames: string[]
  eventTypes: string[]
}

export function useMonitoringSession(workspace: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()

  const data = reactive<MonitoringSessionState>({
    projects: [],
    threads: [],
    events: [],
    nodeEvents: [],
  })

  const selection = reactive({
    project: undefined as string | undefined,
    flow: undefined as string | undefined,
    thread: undefined as string | undefined,
    event: undefined as string | undefined,
  })

  const channel = client.connect('WS /ws/workspaces/:workspace/monitoring', {
    parameters: { workspace: unref(workspace) },
    autoOpen: true,
    autoReconnect: true,
    reconnectDelay: 1000,
    reconnectLimit: 3,

    onMessage: (payload: MonitoringSessionEventPayload) => {
      switch (payload.event) {
        case 'init': {
          data.projects = payload.projects
          data.threads = payload.threads
          data.events = payload.events
          data.nodeEvents = payload.nodeEvents
          break
        }
        case 'threads:update': {
          data.threads = payload.threads
          data.events = []
          data.nodeEvents = []
          selection.event = undefined
          selection.thread = undefined
          break
        }
        // case 'threads:push': {
        //   data.threads.push(payload.thread)
        //   break
        // }
        case 'events:update': {
          data.events = payload.events
          data.nodeEvents = payload.nodeEvents
          break
        }
        // case 'events:push': {
        //   data.events.push(payload.events)
        //   data.nodeEvents.push(payload.nodeEvents)
        //   break
        // }
        case 'error': {
          const { message } = payload
          alerts.error(message)
          break
        }
      }
    },
  })

  return reactive({
    data,
    selection,
    channel,

    selectFlow: (project: string, name: string) => {
      if (selection.flow === name && selection.project === project) return
      channel.send({ event: 'selectFlow', project, name })
      selection.flow = name
      selection.project = project
    },

    selectThread: (thread: string) => {
      if (selection.thread === thread) return
      channel.send({ event: 'selectThread', thread })
      selection.thread = thread
    },

    selectEvent: (id: string) => {
      if (selection.event === id) return
      channel.send({ event: 'selectEvent', id })
      selection.event = id
    },

    setProjectFilter: (project: string) => {
      channel.send({ event: 'setProjectFilter', project })
    },

    setFlowFilter: (flow: string) => {
      channel.send({ event: 'setFlowFilter', flow })
    },

    setEventFilter: () => {
      channel.send({ event: 'setEventFilter' })
    },
  })
}
