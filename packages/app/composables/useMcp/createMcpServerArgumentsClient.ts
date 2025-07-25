import type { McpServerArgumentObject } from '@nwrx/nano-api'
import type {
  McpServerArgumentCreateOptions,
  McpServerArgumentsFetchOptions,
  McpServerArgumentUpdateOptions,
} from './types'
import { createResolvable } from '@unshared/functions/createResolvable'

export interface UseMcpServerOptions {
  workspace: string
  pool: string
  name: string
}

export function createMcpServerArgumentsClient(parameters: UseMcpServerOptions) {
  const { workspace, pool, name: server } = parameters
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const fullName = [pool, server].join('/')
  const data = ref([]) as Ref<McpServerArgumentObject[]>
  const options = ref<McpServerArgumentsFetchOptions>({})

  // --- Lock the fetching process to prevent multiple requests at the same time.
  const lock = createResolvable<void>()
  lock.resolve()

  /***************************************************************************/
  /* Arguments                                                               */
  /***************************************************************************/

  async function fetchArguments() {
    if (lock.isPending) return lock.promise
    lock.reset()
    await client.requestAttempt(
      'GET /api/workspaces/:workspace/pools/:pool/servers/:server/arguments',
      {
        parameters: { workspace, pool, server },
        query: { ...options.value },
        onData: (argumentsData) => { data.value = argumentsData },
        onEnd: () => { lock.resolve() },
      },
    )
  }

  async function createArguments(options: McpServerArgumentCreateOptions) {
    await client.requestAttempt(
      'POST /api/workspaces/:workspace/pools/:pool/servers/:server/arguments',
      {
        parameters: { workspace, pool, server },
        body: { ...options },
        onSuccess: async() => {
          await fetchArguments()
          alerts.success(localize({
            en: `The argument has been added successfully to the server **${fullName}**.`,
            fr: `L'argument a été ajouté avec succès au serveur **${fullName}**.`,
            de: `Das Argument wurde erfolgreich zum Server **${fullName}** hinzugefügt.`,
            es: `El argumento se ha añadido correctamente al servidor **${fullName}**.`,
            zh: `参数已成功添加到服务器 **${fullName}**。`,
          }))
        },
      },
    )
  }

  async function updateArgument(position: number, options: McpServerArgumentUpdateOptions) {
    await client.requestAttempt(
      'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
      {
        parameters: { workspace, pool, server, position },
        body: { ...options },
        onSuccess: async() => {
          await fetchArguments()
          alerts.success(localize({
            en: `The argument at position **${position}** has been updated successfully.`,
            fr: `L'argument à la position **${position}** a été mis à jour avec succès.`,
            de: `Das Argument an Position **${position}** wurde erfolgreich aktualisiert.`,
            es: `El argumento en la posición **${position}** se ha actualizado correctamente.`,
            zh: `位置 **${position}** 的参数已成功更新。`,
          }))
        },
      },
    )
  }

  async function removeArgument(position: number) {
    await client.requestAttempt(
      'DELETE /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
      {
        parameters: { workspace, pool, server, position },
        onSuccess: async() => {
          await fetchArguments()
          alerts.success(localize({
            en: `The argument at position **${position}** has been removed successfully.`,
            fr: `L'argument à la position **${position}** a été supprimé avec succès.`,
            de: `Das Argument an Position **${position}** wurde erfolgreich entfernt.`,
            es: `El argumento en la posición **${position}** se ha eliminado correctamente.`,
            zh: `位置 **${position}** 的参数已成功删除。`,
          }))
        },
      },
    )
  }

  return toReactive({
    data,
    options,
    fetchArguments,
    createArguments,
    updateArgument,
    removeArgument,
  })
}
