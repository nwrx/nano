<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import VariableSearch from '~/components/vaultVariable/VariableSearch.vue'

const props = defineProps<{
  workspace: string
  pool: string
  server: string
  argument: McpServerArgumentObject
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const selectedVariable = ref<string>()

// --- Submit.
async function submit() {
  await client.requestAttempt(
    'PUT /api/workspaces/:workspace/pools/:pool/servers/:server/arguments/:position',
    {
      parameters: {
        workspace: props.workspace,
        pool: props.pool,
        server: props.server,
      },
      body: {
        position: props.argument.position,
        variable: selectedVariable.value,
      },
      onSuccess: () => {
        emit('submit')
        alerts.success(t('success'))
      },
    },
  )
}

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.argument.variable) return
  if (!props.argument.variable.vault) return
  selectedVariable.value = [
    props.argument.variable.vault.name,
    props.argument.variable.name,
  ].filter(Boolean).join('/')
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:password"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { position: props.argument.position, server: props.server })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    :disabled="!selectedVariable"
    @confirm="() => submit()">

    <!-- Search -->
    <VariableSearch
      v-model="selectedVariable"
      :workspace="workspace"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Link argument at position **#{position}** of server **{server}** to a variable.
  text: Select a variable from a vault to link to this server argument. The variable's value will be used when the server starts.
  confirm: Link variable
  cancel: Cancel
  success: Argument has been linked to variable successfully.
  searchLabel: Search variables
  searchPlaceholder: Search for variables by name
  searchHint: Type to search for variables in your vaults
  noVariables: No variables found matching your search
fr:
  title: Lier l'argument à la **position {position}** du serveur **{server}** à une variable
  text: Sélectionnez une variable d'un coffre-fort pour la lier à cet argument de serveur. La valeur de la variable sera utilisée au démarrage du serveur.
  confirm: Lier la variable
  cancel: Annuler
  success: L'argument a été lié à la variable avec succès.
  searchLabel: Rechercher des variables
  searchPlaceholder: Rechercher des variables par nom
  searchHint: Tapez pour rechercher des variables dans vos coffres-forts
  noVariables: Aucune variable trouvée correspondant à votre recherche
de:
  title: Argument an **Position {position}** des Servers **{server}** mit einer Variable verknüpfen
  text: Wählen Sie eine Variable aus einem Tresor aus, um sie mit diesem Serverargument zu verknüpfen. Der Wert der Variable wird beim Start des Servers verwendet.
  confirm: Variable verknüpfen
  cancel: Abbrechen
  success: Argument wurde erfolgreich mit Variable verknüpft.
  searchLabel: Variablen suchen
  searchPlaceholder: Nach Variablen nach Namen suchen
  searchHint: Tippen Sie, um nach Variablen in Ihren Tresoren zu suchen
  noVariables: Keine Variablen gefunden, die Ihrer Suche entsprechen
es:
  title: Vincular argumento en **posición {position}** del servidor **{server}** a una variable
  text: Seleccione una variable de una bóveda para vincular a este argumento del servidor. El valor de la variable se utilizará cuando el servidor se inicie.
  confirm: Vincular variable
  cancel: Cancelar
  success: El argumento se ha vinculado a la variable exitosamente.
  searchLabel: Buscar variables
  searchPlaceholder: Buscar variables por nombre
  searchHint: Escriba para buscar variables en sus bóvedas
  noVariables: No se encontraron variables que coincidan con su búsqueda
zh:
  title: 将服务器 **{server}** 的 **位置 {position}** 的参数链接到变量
  text: 从保险库中选择一个变量来链接到此服务器参数。服务器启动时将使用该变量的值。
  confirm: 链接变量
  cancel: 取消
  success: 参数已成功链接到变量。
  searchLabel: 搜索变量
  searchPlaceholder: 按名称搜索变量
  searchHint: 输入以在您的保险库中搜索变量
  noVariables: 未找到与您的搜索匹配的变量
</i18n>
