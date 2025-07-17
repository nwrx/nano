import type { IconCollectionObject } from '@nwrx/nano-api'
import type { IconCollectionFetchOptions } from './types'
import { createResolvable } from '@unshared/functions/createResolvable'
import { getIconCollectionStatusBadge } from './getIconCollectionStatusBadge'
import { getIconCollectionStatusColor } from './getIconCollectionStatusColor'
import { getIconCollectionStatusIcon } from './getIconCollectionStatusIcon'

export interface UseIconCollectionOptions {
  name: string
}

export function createIconCollectionClient(parameters: UseIconCollectionOptions) {
  const { name } = parameters
  const client = useClient()
  const alerts = useAlerts()

  // --- Create reactive references for data and options.
  const data = ref({}) as Ref<IconCollectionObject>
  const options = ref<IconCollectionFetchOptions>({})

  // --- Computed properties for status display.
  const statusColor = computed(() => getIconCollectionStatusColor(data.value))
  const statusIcon = computed(() => getIconCollectionStatusIcon(data.value))
  const statusBadge = computed(() => getIconCollectionStatusBadge(data.value))

  // --- Lock the fetching process to prevent multiple requests at the same time.
  const fetchLock = createResolvable<void>()
  fetchLock.resolve()

  async function fetchCollection() {
    if (fetchLock.isPending) return fetchLock.promise
    fetchLock.reset()
    await client.requestAttempt(
      'GET /api/icons/collections/:name',
      {
        parameters: { name },
        query: { ...options.value },
        onData: (collectionData) => {
          data.value = { ...data.value, ...collectionData }
        },
        onEnd: () => fetchLock.resolve(),
      },
    )
  }

  async function installCollection() {
    await client.requestAttempt(
      'POST /api/icons/collections/:name',
      {
        parameters: { name },
        onSuccess: () => {
          alerts.success(localize({
            en: `The icon collection **${name}** has been installed successfully.`,
            fr: `La collection d'icônes **${name}** a été installée avec succès.`,
            de: `Die Icon-Sammlung **${name}** wurde erfolgreich installiert.`,
            es: `La colección de iconos **${name}** se ha instalado correctamente.`,
            zh: `图标集合 **${name}** 已成功安装。`,
          }))
        },
        onEnd: () => fetchCollection(),
      },
    )
  }

  async function uninstallCollection() {
    await client.requestAttempt(
      'DELETE /api/icons/collections/:name',
      {
        parameters: { name },
        onSuccess: () => {
          alerts.success(localize({
            en: `The icon collection **${name}** has been uninstalled successfully.`,
            fr: `La collection d'icônes **${name}** a été désinstallée avec succès.`,
            de: `Die Icon-Sammlung **${name}** wurde erfolgreich deinstalliert.`,
            es: `La colección de iconos **${name}** se ha desinstalado correctamente.`,
            zh: `图标集合 **${name}** 已成功卸载。`,
          }))
        },
      },
    )
  }

  async function enableCollection() {
    await client.requestAttempt(
      'POST /api/icons/collections/:name/enable',
      {
        parameters: { name },
        onSuccess: () => {
          alerts.success(localize({
            en: `The icon collection **${name}** has been enabled successfully.`,
            fr: `La collection d'icônes **${name}** a été activée avec succès.`,
            de: `Die Icon-Sammlung **${name}** wurde erfolgreich aktiviert.`,
            es: `La colección de iconos **${name}** se ha habilitado correctamente.`,
            zh: `图标集合 **${name}** 已成功启用。`,
          }))
        },
      },
    )
  }

  async function disableCollection() {
    await client.requestAttempt(
      'POST /api/icons/collections/:name/disable',
      {
        parameters: { name },
        onSuccess: () => {
          alerts.success(localize({
            en: `The icon collection **${name}** has been disabled successfully.`,
            fr: `La collection d'icônes **${name}** a été désactivée avec succès.`,
            de: `Die Icon-Sammlung **${name}** wurde erfolgreich deaktiviert.`,
            es: `La colección de iconos **${name}** se ha deshabilitado correctamente.`,
            zh: `图标集合 **${name}** 已成功禁用。`,
          }))
        },
      },
    )
  }

  return toReactive({
    data,
    // options,
    statusColor,
    statusIcon,
    statusBadge,
    fetchCollection,
    installCollection,
    uninstallCollection,
    enableCollection,
    disableCollection,
  })
}
