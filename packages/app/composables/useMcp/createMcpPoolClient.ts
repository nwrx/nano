import type { McpPoolObject, McpPoolStatus } from '@nwrx/nano-api'
import type { McpPoolFetchOptions, McpPoolUpdateOptions } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { sleep } from '@unshared/functions/sleep'
// import { getMcpPoolStatusIcon } from './getMcpPoolStatusIcon'

export interface UseMcpPoolOptions {
  workspace: string
  name: string
}

export function createMcpPoolClient(parameters: UseMcpPoolOptions) {
  const { workspace, name: pool } = parameters
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const data = ref<McpPoolObject>({} as McpPoolObject)
  const options = ref<McpPoolFetchOptions>({})
  const isLoading = ref(false)

  // --- Lock the fetching process to prevent multiple requests at the same time.
  const isFetching = createResolvable<void>()
  isFetching.resolve()

  async function fetchPool(allowCache = false) {
    if (!allowCache && data.value.name === pool) return
    if (isFetching.isPending) return isFetching.promise
    isFetching.reset()
    await client.requestAttempt('GET /api/workspaces/:workspace/pools/:pool', {
      parameters: { workspace, pool },
      query: { ...options.value },
      onData: (poolData) => { data.value = { ...data.value, ...poolData } },
      onEnd: () => { isFetching.resolve() },
    })
  }

  async function updatePool(options: McpPoolUpdateOptions = {}) {
    isLoading.value = true
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool',
      {
        parameters: { workspace, pool },
        body: { ...options },
        onSuccess: async() => {
          await fetchPool()
          alerts.success(localize({
            en: `The pool **${pool}** has been updated successfully.`,
            fr: `Le pool **${pool}** a été mis à jour avec succès.`,
            de: `Der Pool **${pool}** wurde erfolgreich aktualisiert.`,
            es: `El pool **${pool}** se ha actualizado correctamente.`,
            zh: `池 **${pool}** 已成功更新。`,
          }))
        },
        onEnd: () => {
          isLoading.value = false
        },
      },
    )
  }

  async function renamePool(newName: string) {
    const oldName = unref(pool)
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool/name',
      {
        parameters: { workspace, pool },
        body: { name: newName },
        onSuccess: async() => {
          alerts.success(localize({
            en: `Pool name changed from **${oldName}** to **${newName}**`,
            fr: `Le nom du pool a été changé de **${oldName}** à **${newName}**`,
            de: `Poolname wurde von **${oldName}** zu **${newName}** geändert`,
            es: `El nombre del pool ha cambiado de **${oldName}** a **${newName}**`,
            zh: `池名称已从 **${oldName}** 更改为 **${newName}**`,
          }))

          // --- Get the route and replace the pool name in the URL if it exists
          const route = useRoute()
          const router = useRouter()
          if (route.params.pool !== oldName) return
          await router.replace({ name: route.name, params: { ...route.params, pool: newName } })
        },
      },
    )
  }

  async function enablePool() {
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/enable',
      {
        parameters: { workspace, pool },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The pool **${pool}** has been enabled successfully.`,
            fr: `Le pool **${pool}** a été activé avec succès.`,
            de: `Der Pool **${pool}** wurde erfolgreich aktiviert.`,
            es: `El pool **${pool}** se ha habilitado correctamente.`,
            zh: `池 **${pool}** 已成功启用。`,
          }))
          await fetchPool()
        },
      },
    )
  }

  async function disablePool() {
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/disable',
      {
        parameters: { workspace, pool },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The pool **${pool}** has been disabled successfully.`,
            fr: `Le pool **${pool}** a été désactivé avec succès.`,
            de: `Der Pool **${pool}** wurde erfolgreich deaktiviert.`,
            es: `El pool **${pool}** se ha deshabilitado correctamente.`,
            zh: `池 **${pool}** 已成功禁用。`,
          }))
          await fetchPool()
        },
      },
    )
  }

  async function removePool() {
    await client.requestAttempt(
      'DELETE /api/workspaces/:workspace/pools/:pool',
      {
        parameters: { workspace, pool },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The pool **${pool}** has been removed successfully.`,
            fr: `Le pool **${pool}** a été supprimé avec succès.`,
            de: `Der Pool **${pool}** wurde erfolgreich entfernt.`,
            es: `El pool **${pool}** se ha eliminado correctamente.`,
            zh: `池 **${pool}** 已成功删除。`,
          }))

          // --- If the route contains the pool name, redirect to the workspace MCP page
          const route = useRoute()
          const router = useRouter()
          if (route.params.pool !== unref(pool)) return
          await router.replace({ name: 'WorkspaceMcp', params: { workspace: route.params.workspace } })
        },
      },
    )
  }

  /***************************************************************************/
  /* Status                                                                  */
  /***************************************************************************/

  const status = ref({}) as Ref<McpPoolStatus>

  async function fetchStatus() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools/:pool/status',
      {
        parameters: { workspace, pool },
        onData: (statusData) => { status.value = statusData },
      },
    )
  }

  async function synchronizePool() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/synchronize',
      {
        parameters: { workspace, pool },
        onSuccess: async() => {
          await fetchStatus()
          alerts.success(localize({
            en: `The pool **${pool}** has been synchronized successfully.`,
            fr: `Le pool **${pool}** a été synchronisé avec succès.`,
            de: `Der Pool **${pool}** wurde erfolgreich synchronisiert.`,
            es: `El pool **${pool}** se ha sincronizado correctamente.`,
            zh: `池 **${pool}** 已成功同步。`,
          }))
        },
      },
    )
  }

  return toReactive({
    data,
    status,
    options,
    isLoading,
    linkTo: { name: 'WorkspaceMcpPool', params: { workspace, pool } },
    // statusIcon: getMcpPoolStatusIcon(data.value),
    // statusColor: getMcpPoolStatusIcon(data.value),

    fetchPool,
    updatePool,
    renamePool,
    enablePool,
    disablePool,
    removePool,
    fetchStatus,
    synchronizePool,
  })
}
