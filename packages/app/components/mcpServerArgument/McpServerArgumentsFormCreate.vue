<script setup lang="ts">
import AppPageFormTabs from '~/components/app/AppPageForm.Tabs.vue'
import AppPageFormTabsItem from '~/components/app/AppPageForm.TabsItem.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import FromValue from './McpServerArgumentsFormCreate.FromValue.vue'
import FromVariable from './McpServerArgumentsFormCreate.FromVariable.vue'

defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
type Panel = 'createFromValue' | 'createFromVariable'
const currentPanel = ref<Panel>('createFromValue')
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Tabs -->
    <AppPageFormTabs>
      <AppPageFormTabsItem
        v-model="currentPanel"
        :label="t('createFromValue')"
        value="createFromValue"
        type="radio"
      />
      <AppPageFormTabsItem
        v-model="currentPanel"
        :label="t('createFromVariable')"
        value="createFromVariable"
        type="radio"
      />
    </AppPageFormTabs>

    <!-- Content -->
    <div class="w-full b b-app rd">
      <FromValue
        v-if="currentPanel === 'createFromValue'"
        :workspace="workspace"
        :pool="pool"
        :name="name"
      />
      <FromVariable
        v-else-if="currentPanel === 'createFromVariable'"
        :workspace="workspace"
        :pool="pool"
        :name="name"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Create Argument
  text: Command line arguments passed to the server process. These arguments are passed in order and can be used to configure the server behavior, provide configuration values, or specify runtime options.
  addArgument: Add a new argument to the list
  createFromValue: Insert argument
  createFromVariable: Link argument with variable
fr:
  title: Créer un Argument
  text: Arguments de ligne de commande passés au processus du serveur. Ces arguments sont passés dans l'ordre et peuvent être utilisés pour configurer le comportement du serveur, fournir des valeurs de configuration ou spécifier des options d'exécution.
  addArgument: Ajouter un nouvel argument à la liste
  createFromValue: Insérer un argument
  createFromVariable: Lier l'argument à une variable
de:
  title: Argument Erstellen
  text: Kommandozeilenargumente, die an den Serverprozess übergeben werden. Diese Argumente werden in der Reihenfolge übergeben und können verwendet werden, um das Verhalten des Servers zu konfigurieren, Konfigurationswerte bereitzustellen oder Laufzeitoptionen zu spezifizieren.
  addArgument: Neues Argument zur Liste hinzufügen
  createFromValue: Argument einfügen
  createFromVariable: Argument mit Variable verknüpfen
es:
  title: Crear Argumento
  text: Argumentos de línea de comando pasados al proceso del servidor. Estos argumentos se pasan en orden y pueden usarse para configurar el comportamiento del servidor, proporcionar valores de configuración o especificar opciones de tiempo de ejecución.
  addArgument: Agregar un nuevo argumento a la lista
  createFromValue: Insertar argumento
  createFromVariable: Vincular argumento con variable
zh:
  title: 创建参数
  text: 传递给服务器进程的命令行参数。这些参数按顺序传递，可用于配置服务器行为、提供配置值或指定运行时选项。
  addArgument: 添加新参数到列表
  createFromValue: 插入参数
  createFromVariable: 将参数链接到变量
</i18n>
