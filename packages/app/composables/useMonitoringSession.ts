import type { MonitoringSessionEventPayload, MonitoringSessionState } from '@nwrx/api'
import { useAlerts, useClient } from '#imports'

export function useMonitoringSession(workspace: MaybeRef<string>) {
  const client = useClient()
  const alerts = useAlerts()
  const session = client.connect('WS /ws/workspaces/:workspace/monitoring', {
    data: {
      workspace: unref(workspace),
    },
  })

  const data = reactive<MonitoringSessionState>({
    projects: [],
    threads: [],
    events: [],
    nodeEvents: [],
    selectedProject: undefined,
    selectedFlow: undefined,
    selectedThread: undefined,
    selectedEvent: undefined,
  })

  session.on('message', (payload: MonitoringSessionEventPayload) => {
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
        data.selectedEvent = undefined
        data.selectedThread = undefined
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
  })

  return reactive({
    data,

    selectFlow: (project: string, name: string) => {
      if (data.selectedFlow === name && data.selectedProject === project) return
      session.send({ event: 'selectFlow', project, name })
      data.selectedFlow = name
      data.selectedProject = project
    },

    selectThread: (thread: string) => {
      if (data.selectedThread === thread) return
      session.send({ event: 'selectThread', thread })
      data.selectedThread = thread
    },

    selectEvent: (id: string) => {
      if (data.selectedEvent === id) return
      session.send({ event: 'selectEvent', id })
      data.selectedEvent = id
    },

    setProjectFilter: (project: string) => {
      session.send({ event: 'setProjectFilter', project })
    },

    setFlowFilter: (flow: string) => {
      session.send({ event: 'setFlowFilter', flow })
    },

    setEventFilter: () => {
      session.send({ event: 'setEventFilter' })
    },
  })
}
