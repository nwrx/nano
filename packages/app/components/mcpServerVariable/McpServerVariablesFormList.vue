<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServerVariables } from '~/composables/useMcp'
import Variable from './McpServerVariablesFormList.Variable.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const variables = useMcpServerVariables(props)
variables.options.withVault = true
variables.options.withVariable = true
variables.options.withCreatedBy = true
variables.options.withUpdatedBy = true
onMounted(() => variables.fetchVariables())
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Card -->
    <div class="w-full rd b b-app bg-subtle divide-y divide-app">

      <!-- No Variables -->
      <AppPageFormEmpty
        v-if="variables.data.length === 0"
        :title="t('noVariablesTitle')"
        :text="t('noVariablesText')"
        icon="i-carbon:password"
      />

      <!-- List of Variables -->
      <Variable
        v-for="(variable, index) in variables.data"
        :key="index"
        :workspace="workspace"
        :pool="pool"
        :server="name"
        :variable="variable"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Environment Variables
  text: Manage environment variables that are configured for this MCP server during execution. You can edit variable values, link variables to vault secrets for secure storage, modify mount paths, or remove variables that are no longer needed.
  noVariablesTitle: No Variables
  noVariablesText: This server has no environment variables defined yet. Variables can be created using the dedicated creation form.
fr:
  title: Variables d'Environnement
  text: Gérez les variables d'environnement qui sont configurées pour ce serveur MCP lors de l'exécution. Vous pouvez modifier les valeurs des variables, lier les variables aux secrets du coffre-fort pour un stockage sécurisé, modifier les chemins de montage ou supprimer les variables qui ne sont plus nécessaires.
  noVariablesTitle: Aucune Variable
  noVariablesText: Ce serveur n'a pas encore de variables d'environnement définies. Les variables peuvent être créées en utilisant le formulaire de création dédié.
de:
  title: Umgebungsvariablen
  text: Verwalten Sie Umgebungsvariablen, die für diesen MCP-Server während der Ausführung konfiguriert sind. Sie können Variablenwerte bearbeiten, Variablen mit Tresorgeheimnissen für sichere Speicherung verknüpfen, Mount-Pfade ändern oder Variablen entfernen, die nicht mehr benötigt werden.
  noVariablesTitle: Keine Variablen
  noVariablesText: Dieser Server hat noch keine Umgebungsvariablen definiert. Variablen können über das spezielle Erstellungsformular erstellt werden.
es:
  title: Variables de Entorno
  text: Gestiona las variables de entorno que están configuradas para este servidor MCP durante la ejecución. Puedes editar valores de variables, vincular variables a secretos de bóveda para almacenamiento seguro, modificar rutas de montaje o eliminar variables que ya no son necesarias.
  noVariablesTitle: Sin Variables
  noVariablesText: Este servidor aún no tiene variables de entorno definidas. Las variables se pueden crear usando el formulario de creación dedicado.
zh:
  title: 环境变量
  text: 管理在执行期间为此 MCP 服务器配置的环境变量。您可以编辑变量值、将变量链接到保险库密钥以实现安全存储、修改挂载路径或删除不再需要的变量。
  noVariablesTitle: 无变量
  noVariablesText: 此服务器尚未定义任何环境变量。可以使用专用的创建表单来创建变量。
</i18n>
