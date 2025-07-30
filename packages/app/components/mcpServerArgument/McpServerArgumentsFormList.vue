<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import { useMcpServerArguments } from '~/composables/useMcp'
import Argument from './McpServerArgumentsFormList.Argument.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const args = useMcpServerArguments(props)
args.options.withVault = true
args.options.withVariable = true
args.options.withCreatedBy = true
args.options.withUpdatedBy = true
onMounted(args.fetchArguments)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">
    <div class="w-full rd b b-app bg-subtle divide-y divide-app">

      <!-- No Tools -->
      <AppPageFormEmpty
        v-if="args.data.length === 0"
        :title="t('noArgumentsTitle')"
        :text="t('noArgumentsText')"
        icon="i-carbon:code"
      />

      <!-- List of Arguments -->
      <Argument
        v-for="(argument, index) in args.data"
        :key="index"
        :workspace="workspace"
        :pool="pool"
        :server="name"
        :argument="argument"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Arguments
  text: Manage command line arguments that are passed to this MCP server during execution. You can edit argument values, link arguments to variables for dynamic values, modify the order of arguments, or remove arguments that are no longer needed.
  noArgumentsTitle: No Arguments
  noArgumentsText: This server has no command line arguments defined yet. Arguments can be created using the dedicated creation form.
fr:
  title: Arguments
  text: Gérez les arguments de ligne de commande qui sont passés à ce serveur MCP lors de l'exécution. Vous pouvez modifier les valeurs des arguments, lier les arguments aux variables pour des valeurs dynamiques, modifier l'ordre des arguments ou supprimer les arguments qui ne sont plus nécessaires.
  noArgumentsTitle: Aucun Argument
  noArgumentsText: Ce serveur n'a pas encore d'arguments de ligne de commande définis. Les arguments peuvent être créés en utilisant le formulaire de création dédié.
de:
  title: Argumente
  text: Verwalten Sie Kommandozeilenargumente, die an diesen MCP-Server während der Ausführung übergeben werden. Sie können Argumentwerte bearbeiten, Argumente mit Variablen für dynamische Werte verknüpfen, die Reihenfolge der Argumente ändern oder Argumente entfernen, die nicht mehr benötigt werden.
  noArgumentsTitle: Keine Argumente
  noArgumentsText: Dieser Server hat noch keine Kommandozeilenargumente definiert. Argumente können über das spezielle Erstellungsformular erstellt werden.
es:
  title: Argumentos
  text: Gestiona los argumentos de línea de comando que se pasan a este servidor MCP durante la ejecución. Puedes editar valores de argumentos, vincular argumentos a variables para valores dinámicos, modificar el orden de los argumentos o eliminar argumentos que ya no son necesarios.
  noArgumentsTitle: Sin Argumentos
  noArgumentsText: Este servidor aún no tiene argumentos de línea de comando definidos. Los argumentos se pueden crear usando el formulario de creación dedicado.
zh:
  title: 参数
  text: 管理在执行期间传递给此 MCP 服务器的命令行参数。您可以编辑参数值、将参数链接到变量以获取动态值、修改参数顺序或删除不再需要的参数。
  noArgumentsTitle: 无参数
  noArgumentsText: 此服务器尚未定义任何命令行参数。可以使用专用的创建表单来创建参数。
</i18n>
