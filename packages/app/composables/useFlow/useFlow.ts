import type { ModuleFlow } from '@nwrx/nano-api'
import type { FlowObject, FlowSchema } from '@nwrx/nano-api'
import type { UseFlow } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'

const DEFAULT_FLOW_SCHEMA: FlowSchema = {
  title: '',
  description: '',
  inputs: [],
  outputs: [],
  nodes: [],
}

const DEFAULT_FLOW_OBJECT: FlowObject = {
  name: '',
  title: '',
  description: '',
}

export const useFlow = createCachedComposable(
  (parameters: UseFlow.UseOptions) => {
    const { workspace, project, name } = parameters
    const client = useClient<ModuleFlow>()
    const alerts = useAlerts()
    const data = ref({ ...DEFAULT_FLOW_OBJECT }) as Ref<FlowObject>
    const schema = ref({ ...DEFAULT_FLOW_SCHEMA }) as Ref<FlowSchema>
    const lock = createResolvable<void>()
    const subscribers = ref(0)
    let abortController = new AbortController()
    lock.resolve()

    return toReactive({
      data,
      schema,

      links: {
        editor: { name: 'FlowEditor', params: { workspace, project, name } },
        settings: { name: 'FlowSettings', params: { workspace, project, name } },
      },

      fetchFlow: async() => {
        if (lock.isPending) return lock.promise
        lock.reset()
        await client.requestAttempt(
          'GET /workspaces/:workspace/projects/:project/flows/:flow',
          {
            parameters: { workspace, project, flow: name },
            onData: flow => data.value = flow,
            onEnd: () => lock.resolve(),
          },
        )
      },

      fetchSchema: async() => {
        await client.requestAttempt(
          'GET /workspaces/:workspace/projects/:project/flows/:flow/schema',
          {
            parameters: { workspace, project, flow: name },
            onData: flowSchema => schema.value = flowSchema,
          },
        )
      },

      updateFlow: async(options: Partial<FlowObject>) => {
        await client.requestAttempt(
          'PUT /workspaces/:workspace/projects/:project/flows/:flow',
          {
            parameters: { workspace, project, flow: name },
            body: options,
            onSuccess: () => {
              data.value = { ...data.value, ...options }
              alerts.success(localize({
                en: `The "${name}" flow has been updated successfully`,
                fr: `Le flux "${name}" a été mis à jour avec succès`,
                de: `Der Flow "${name}" wurde erfolgreich aktualisiert`,
                es: `El flujo "${name}" se ha actualizado correctamente`,
                zh: `"${name}" 流程已成功更新`,
              }))
            },
          },
        )
      },

      renameFlow: async(rename: string) => {
        await client.requestAttempt(
          'PUT /workspaces/:workspace/projects/:project/flows/:flow/name',
          {
            parameters: { workspace, project, flow: name },
            body: { name: rename },
            onSuccess: () => {
              alerts.success(localize({
                en: `The "${name}" flow has been renamed successfully`,
                fr: `Le flux "${name}" a été renommé avec succès`,
                de: `Der Flow "${name}" wurde erfolgreich umbenannt`,
                es: `El flujo "${name}" se ha renombrado correctamente`,
                zh: `"${name}" 流程已成功重命名`,
              }))
            },
          },
        )
      },

      removeFlow: async() => {
        await client.requestAttempt(
          'DELETE /workspaces/:workspace/projects/:project/flows/:flow',
          {
            parameters: { workspace, project, flow: name },
            onSuccess: () => {
              alerts.success(localize({
                en: `The "${data.value.name}" flow has been removed successfully`,
                fr: `Le flux "${data.value.name}" a été supprimé avec succès`,
                de: `Der Flow "${data.value.name}" wurde erfolgreich entfernt`,
                es: `El flujo "${data.value.name}" se ha eliminado correctamente`,
                zh: `"${data.value.name}" 流程已成功删除`,
              }))
            },
          },
        )
      },

      duplicateFlow: async(newName: string) => {
        await client.requestAttempt(
          'POST /workspaces/:workspace/projects/:project/flows/:flow/duplicate',
          {
            parameters: { workspace, project, flow: name },
            body: { name: newName },
            onSuccess: () => {
              alerts.success(localize({
                en: `The "${newName}" flow has been duplicated successfully`,
                fr: `Le flux "${newName}" a été dupliqué avec succès`,
                de: `Der Flow "${newName}" wurde erfolgreich dupliziert`,
                es: `El flujo "${newName}" se ha duplicado correctamente`,
                zh: `"${newName}" 流程已成功复制`,
              }))
            },
          },
        )
      },

      subscribeToEvents: () => {
        subscribers.value++
        if (subscribers.value > 1) return
        void client.requestAttempt(
          'GET /workspaces/:workspace/projects/:project/flows/:flow/events',
          {
            signal: abortController.signal,
            parameters: { workspace, project, flow: name },
            onData: ({ data: event }) => {
              if (event.event === 'flow.updated') {
                Object.assign(data.value, event.data)
                data.value = { ...data.value } // Trigger reactivity
              }
              else if (event.event === 'flow.renamed') {
                data.value.name = event.data.name
                data.value = { ...data.value } // Trigger reactivity
              }
              else if (event.event === 'flow.removed') {
                data.value = {} as FlowObject // Clear flow data
              }
            },
            onEnd: () => {
              subscribers.value = 0 // Reset subscribers count on end
            },
          },
        ).catch((error: Error) => {
          if (error.name === 'AbortError') return
        })
      },

      unsubscribeFromEvents: () => {
        subscribers.value--
        if (subscribers.value > 0) return
        abortController.abort()
        abortController = new AbortController()
      },
    })
  },
  {
    cacheKey: ({ workspace, project, name }) => [workspace, project, name].join('/'),
    isPersistent: true,
  },
)
