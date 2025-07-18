<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import VariableSearch from '~/components/vaultVariable/VariableSearch.vue'
import { useMcpServerVariables } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
  variable: McpServerVariableObject
}>()

// --- Model.
const { t } = useI18n()
const variables = useMcpServerVariables(props)
const selectedVariable = ref<string>()
const mountAtPath = ref<string>()

// --- State.
const isOpen = defineModel({ default: false })
watch(isOpen, () => {
  if (!isOpen.value) return
  if (!props.variable.variable) return
  if (!props.variable.variable.vault) return
  selectedVariable.value = [
    props.variable.variable.vault.name,
    props.variable.variable.name,
  ].filter(Boolean).join('/')
  mountAtPath.value = props.variable.mountAtPath
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:password"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name: variable.name, server: name })"
    :text="t('text')"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    :disabled="!selectedVariable"
    @confirm="() => {
      variables.updateVariable(variable.name, {
        variable: selectedVariable,
        mountAtPath,
      })
    }">

    <!-- Search variable -->
    <div class="space-y-4">
      <VariableSearch
        v-model="selectedVariable"
        :workspace="workspace"
      />

      <!-- Mount Path -->
      <InputText
        v-model="mountAtPath"
        :label="t('mountAtPathLabel')"
        :placeholder="t('mountAtPathPlaceholder')"
        :hint="t('mountAtPathHint')"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Link variable **{name}** of server **{server}** to a vault variable.
  text: Select a variable from a vault to link to this environment variable. The vault variable's value will be used when the server starts.
  confirm: Link variable
  cancel: Cancel
  success: Variable has been linked to vault variable successfully.
  searchLabel: Search variables
  searchPlaceholder: Search for variables by name
  searchHint: Type to search for variables in your vaults
  noVariables: No variables found matching your search
  mountAtPathLabel: Mount at path
  mountAtPathPlaceholder: /path/to/mount (optional)
  mountAtPathHint: Optional path where the variable should be mounted in the container.
fr:
  title: Lier la variable **{name}** du serveur **{server}** à une variable de coffre-fort
  text: Sélectionnez une variable d'un coffre-fort pour la lier à cette variable d'environnement. La valeur de la variable du coffre-fort sera utilisée au démarrage du serveur.
  confirm: Lier la variable
  cancel: Annuler
  success: La variable a été liée à la variable du coffre-fort avec succès.
  searchLabel: Rechercher des variables
  searchPlaceholder: Rechercher des variables par nom
  searchHint: Tapez pour rechercher des variables dans vos coffres-forts
  noVariables: Aucune variable trouvée correspondant à votre recherche
  mountAtPathLabel: Monter au chemin
  mountAtPathPlaceholder: /chemin/vers/montage (optionnel)
  mountAtPathHint: Chemin optionnel où la variable doit être montée dans le conteneur.
de:
  title: Variable **{name}** des Servers **{server}** mit einer Tresorvariable verknüpfen
  text: Wählen Sie eine Variable aus einem Tresor aus, um sie mit dieser Umgebungsvariable zu verknüpfen. Der Wert der Tresorvariable wird beim Start des Servers verwendet.
  confirm: Variable verknüpfen
  cancel: Abbrechen
  success: Variable wurde erfolgreich mit Tresorvariable verknüpft.
  searchLabel: Variablen suchen
  searchPlaceholder: Nach Variablen nach Namen suchen
  searchHint: Tippen Sie, um nach Variablen in Ihren Tresoren zu suchen
  noVariables: Keine Variablen gefunden, die Ihrer Suche entsprechen
  mountAtPathLabel: Bei Pfad mounten
  mountAtPathPlaceholder: /pfad/zum/mounten (optional)
  mountAtPathHint: Optionaler Pfad, wo die Variable im Container gemountet werden soll.
es:
  title: Vincular variable **{name}** del servidor **{server}** a una variable de bóveda
  text: Seleccione una variable de una bóveda para vincular a esta variable de entorno. El valor de la variable de la bóveda se utilizará cuando el servidor se inicie.
  confirm: Vincular variable
  cancel: Cancelar
  success: La variable se ha vinculado a la variable de bóveda exitosamente.
  searchLabel: Buscar variables
  searchPlaceholder: Buscar variables por nombre
  searchHint: Escriba para buscar variables en sus bóvedas
  noVariables: No se encontraron variables que coincidan con su búsqueda
  mountAtPathLabel: Montar en ruta
  mountAtPathPlaceholder: /ruta/para/montar (opcional)
  mountAtPathHint: Ruta opcional donde la variable debe montarse en el contenedor.
zh:
  title: 将服务器 **{server}** 的变量 **{name}** 链接到保险库变量
  text: 从保险库中选择一个变量来链接到此环境变量。服务器启动时将使用保险库变量的值。
  confirm: 链接变量
  cancel: 取消
  success: 变量已成功链接到保险库变量。
  searchLabel: 搜索变量
  searchPlaceholder: 按名称搜索变量
  searchHint: 输入以在您的保险库中搜索变量
  noVariables: 未找到与您的搜索匹配的变量
  mountAtPathLabel: 挂载路径
  mountAtPathPlaceholder: /path/to/mount（可选）
  mountAtPathHint: 变量应在容器中挂载的可选路径。
</i18n>
