import type {
  McpServerObject,
  McpServerStatus,
} from '@nwrx/nano-api'
import type {
  McpServerFetchOptions,
  McpServerFetchToolsOptions,
  McpServerUpdateOptions,
  McpServerUpdateSpecOptions,
} from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { sleep } from '@unshared/functions/sleep'
import { getMcpServerStatusBadge } from './getMcpServerStatusBadge'
import { getMcpServerStatusIcon } from './getMcpServerStatusIcon'
import { useMcpPools } from './useMcpPools'

export interface UseMcpServerOptions {
  workspace: string
  pool: string
  name: string
}

export function createMcpServerClient(parameters: UseMcpServerOptions) {
  const { workspace, pool, name: server } = parameters
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const fullName = [pool, server].join('/')
  const data = ref({}) as Ref<McpServerObject>
  const options = ref<McpServerFetchOptions>({})
  const isLoading = ref(false)

  // --- Lock the fetching process to prevent multiple requests at the same time.
  const fetchLock = createResolvable<void>()
  fetchLock.resolve()

  async function fetchServer(allowCache = false) {
    if (allowCache && data.value.name === server) return
    if (fetchLock.isPending) return fetchLock.promise
    fetchLock.reset()
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools/:pool/servers/:server',
      {
        parameters: { workspace, pool, server },
        query: { ...options.value },
        onData: (serverData) => { data.value = { ...data.value, ...serverData } },
        onEnd: () => { fetchLock.resolve() },
      },
    )
  }

  async function triggerPoolUpdate() {
    const pools = useMcpPools({ workspace })
    await pools.fetchPools()
  }

  async function updateServer(options: Partial<McpServerUpdateOptions> = {}) {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool/servers/:server',
      {
        parameters: { workspace, pool, server },
        body: { ...options },
        onSuccess: async() => {
          await fetchServer()
          alerts.success(localize({
            en: `The server **${fullName}** has been updated successfully.`,
            fr: `Le serveur **${fullName}** a été mis à jour avec succès.`,
            de: `Der Server **${fullName}** wurde erfolgreich aktualisiert.`,
            es: `El servidor **${fullName}** se ha actualizado correctamente.`,
            zh: `服务器 **${fullName}** 已成功更新。`,
          }))
        },
      },
    )
  }

  async function updateSpecifications(options: Partial<McpServerUpdateSpecOptions> = {}) {
    isLoading.value = true
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/spec',
      {
        parameters: { workspace, pool, server },
        body: { ...options },
        onSuccess: async() => {
          await fetchServer()
          alerts.success(localize({
            en: `The server **${fullName}** specifications have been updated successfully.`,
            fr: `Les spécifications du serveur **${fullName}** ont été mises à jour avec succès.`,
            de: `Die Spezifikationen des Servers **${fullName}** wurden erfolgreich aktualisiert.`,
            es: `Las especificaciones del servidor **${fullName}** se han actualizado correctamente.`,
            zh: `服务器 **${fullName}** 的规格已成功更新。`,
          }))
        },
        onEnd: () => {
          isLoading.value = false
        },
      },
    )
  }

  async function renameServer(newName: string) {
    const oldName = unref(server)
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/name',
      {
        parameters: { workspace, pool, server },
        body: { name: newName },
        onSuccess: async() => {
          alerts.success(localize({
            en: `Server name changed from **${oldName}** to **${newName}**`,
            fr: `Le nom du serveur a été changé de **${oldName}** à **${newName}**`,
            de: `Servername wurde von **${oldName}** zu **${newName}** geändert`,
            es: `El nombre del servidor ha cambiado de **${oldName}** a **${newName}**`,
            zh: `服务器名称已从 **${oldName}** 更改为 **${newName}**`,
          }))

          // --- Get the route and replace the server name in the URL if it exists
          const route = useRoute()
          const router = useRouter()
          if (route.params.server !== oldName) return
          await router.replace({ name: route.name, params: { ...route.params, server: newName } })
        },
      },
    )
  }

  async function enableServer() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/servers/:server/enable',
      {
        parameters: { workspace, pool, server },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The server **${fullName}** has been enabled successfully.`,
            fr: `Le serveur **${fullName}** a été activé avec succès.`,
            de: `Der Server **${fullName}** wurde erfolgreich aktiviert.`,
            es: `El servidor **${fullName}** se ha habilitado correctamente.`,
            zh: `服务器 **${fullName}** 已成功启用。`,
          }))
          await fetchServer()
          await triggerPoolUpdate()
        },
      },
    )
  }

  async function disableServer() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/servers/:server/disable',
      {
        parameters: { workspace, pool, server },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The server **${fullName}** has been disabled successfully.`,
            fr: `Le serveur **${fullName}** a été désactivé avec succès.`,
            de: `Der Server **${fullName}** wurde erfolgreich deaktiviert.`,
            es: `El servidor **${fullName}** se ha deshabilitado correctamente.`,
            zh: `服务器 **${fullName}** 已成功禁用。`,
          }))
          await fetchServer()
          await triggerPoolUpdate()
        },
      },
    )
  }

  async function removeServer() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'DELETE /api/workspaces/:workspace/pools/:pool/servers/:server',
      {
        parameters: { workspace, pool, server },
        onSuccess: async() => {
          alerts.success(localize({
            en: `The server **${fullName}** has been removed successfully.`,
            fr: `Le serveur **${fullName}** a été supprimé avec succès.`,
            de: `Der Server **${fullName}** wurde erfolgreich entfernt.`,
            es: `El servidor **${fullName}** se ha eliminado correctamente.`,
            zh: `服务器 **${fullName}** 已成功删除。`,
          }))

          // --- If the route contains the server name, redirect to the pool page
          const route = useRoute()
          const router = useRouter()
          if (route.params.server !== unref(server)) return
          await router.replace({ name: 'WorkspaceMcp', params: { ...route.params } })
          await triggerPoolUpdate()
        },
      },
    )
  }

  /***************************************************************************/
  /* Status                                                                  */
  /***************************************************************************/

  const status = ref({
    currentConnections: 0,
    localSpec: {},
    remoteSpec: {},
  }) as Ref<McpServerStatus>

  async function fetchStatus() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools/:pool/servers/:server/status',
      {
        parameters: { workspace, pool, server },
        onData: (statusData) => { status.value = statusData },
      },
    )
  }

  async function syncronizeServer() {
    await sleep(CONSTANTS.niceDelay)
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/servers/:server/apply',
      {
        parameters: { workspace, pool, server },
        onSuccess: async() => {
          await fetchStatus()
          alerts.success(localize({
            en: `The server **${fullName}** has been synchronized successfully.`,
            fr: `Le serveur **${fullName}** a été synchronisé avec succès.`,
            de: `Der Server **${fullName}** wurde erfolgreich synchronisiert.`,
            es: `El servidor **${fullName}** se ha sincronizado correctamente.`,
            zh: `服务器 **${fullName}** 已成功同步。`,
          }))
        },
      },
    )
  }

  /***************************************************************************/
  /* Tools                                                                   */
  /***************************************************************************/

  async function fetchTools(options: McpServerFetchToolsOptions = {}) {
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools/:pool/servers/:server/tools',
      {
        parameters: { workspace, pool, server },
        query: { ...options },
        onData: ({ tools }) => {
          data.value.tools = tools
        },
      },
    )
  }

  return toReactive({
    data,
    status,
    options,
    fullName,
    linkTo: { name: 'WorkspaceMcpServer', params: { workspace, pool, server } },
    statusIcon: getMcpServerStatusIcon(data.value),
    statusColor: getMcpServerStatusIcon(data.value),
    statusBadge: getMcpServerStatusBadge(data.value),

    fetchServer,
    updateServer,
    updateSpecifications,
    renameServer,
    enableServer,
    disableServer,
    removeServer,
    fetchStatus,
    syncronizeServer,
    fetchTools,
  })
}
