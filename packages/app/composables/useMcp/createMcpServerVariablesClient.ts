import type { McpServerVariableObject, } from '@nwrx/nano-api'
import type { McpServerVariablesFetchOptions, McpServerVariableCreateOptions, McpServerVariableUpdateOptions } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'

export interface UseMcpServerOptions {
  workspace: string
  pool: string
  name: string
}

export function createMcpServerVariablesClient(parameters: UseMcpServerOptions) {
  const { workspace, pool, name: server } = parameters
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const fullName = [pool, server].join('/')
  const data = ref([]) as Ref<McpServerVariableObject[]>
  const options = ref<McpServerVariablesFetchOptions>({})

  // --- Lock the fetching process to prevent multiple requests at the same time.
  const lock = createResolvable<void>()
  lock.resolve()

  /***************************************************************************/
  /* Variables                                                               */
  /***************************************************************************/

  async function fetchVariables() {
    if (lock.isPending) return lock.promise
    lock.reset()
    await client.requestAttempt(
      'GET /workspaces/:workspace/pools/:pool/servers/:server/variables',
      {
        parameters: { workspace, pool, server },
        query: { ...options.value },
        onData: (variablesData) => { data.value = variablesData },
        onEnd: () => { lock.resolve() },
      },
    )
  }

  async function createVariable(options: Omit<McpServerVariableCreateOptions, 'name'>) {
    await client.requestAttempt(
      'POST /workspaces/:workspace/pools/:pool/servers/:server/variables',
      {
        parameters: { workspace, pool, server },
        body: { ...options },
        onSuccess: async() => {
          await fetchVariables()
          const names = options.variables.map(variable => variable.name).join(', ')
          alerts.success(localize({
            en: `The variable **${names}** has been added successfully to the server **${fullName}**.`,
            fr: `La variable **${names}** a été ajoutée avec succès au serveur **${fullName}**.`,
            de: `Die Variable **${names}** wurde erfolgreich zum Server **${fullName}** hinzugefügt.`,
            es: `La variable **${names}** se ha añadido correctamente al servidor **${fullName}**.`,
            zh: `变量 **${names}** 已成功添加到服务器 **${fullName}**。`,
          }))
        },
      },
    )
  }

  async function updateVariable(name: string, options: McpServerVariableUpdateOptions) {
    await client.requestAttempt(
      'PUT /workspaces/:workspace/pools/:pool/servers/:server/variables/:name',
      {
        parameters: { workspace, pool, server, name },
        body: { ...options },
        onSuccess: async() => {
          await fetchVariables()
          alerts.success(localize({
            en: `The variable **${name}** has been updated successfully.`,
            fr: `La variable **${name}** a été mise à jour avec succès.`,
            de: `Die Variable **${name}** wurde erfolgreich aktualisiert.`,
            es: `La variable **${name}** se ha actualizado correctamente.`,
            zh: `变量 **${name}** 已成功更新。`,
          }))
        },
      },
    )
  }

  async function removeVariable(name: string) {
    await client.requestAttempt(
      'DELETE /workspaces/:workspace/pools/:pool/servers/:server/variables/:variable',
      {
        parameters: { workspace, pool, server, variable: name },
        onSuccess: async() => {
          await fetchVariables()
          alerts.success(localize({
            en: `The variable **${name}** has been removed successfully.`,
            fr: `La variable **${name}** a été supprimée avec succès.`,
            de: `Die Variable **${name}** wurde erfolgreich entfernt.`,
            es: `La variable **${name}** se ha eliminado correctamente.`,
            zh: `变量 **${name}** 已成功删除。`,
          }))
        },
      },
    )
  }

  return toReactive({
    data,
    options,
    fetchVariables,
    createVariable,
    updateVariable,
    removeVariable,
  })
}
