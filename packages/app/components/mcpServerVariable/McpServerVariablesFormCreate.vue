<script setup lang="ts">
import AppPageFormTabs from '~/components/app/AppPageForm.Tabs.vue'
import AppPageFormTabsItem from '~/components/app/AppPageForm.TabsItem.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import FromValue from './McpServerVariablesFormCreate.FromValue.vue'
import FromVariable from './McpServerVariablesFormCreate.FromVariable.vue'

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
  title: Create Environment Variable
  text: Environment variables passed to the server process. These variables can be used to configure the server behavior, provide API keys, connection strings, or other configuration values.
  createFromValue: Insert variable
  createFromVariable: Link variable with vault
fr:
  title: Créer une Variable d'Environnement
  text: Variables d'environnement passées au processus du serveur. Ces variables peuvent être utilisées pour configurer le comportement du serveur, fournir des clés API, des chaînes de connexion ou d'autres valeurs de configuration.
  createFromValue: Insérer une variable
  createFromVariable: Lier une variable avec le coffre-fort
de:
  title: Umgebungsvariable Erstellen
  text: Umgebungsvariablen, die an den Serverprozess übergeben werden. Diese Variablen können verwendet werden, um das Verhalten des Servers zu konfigurieren, API-Schlüssel, Verbindungszeichenfolgen oder andere Konfigurationswerte bereitzustellen.
  createFromValue: Variable einfügen
  createFromVariable: Variable mit Tresor verknüpfen
es:
  title: Crear Variable de Entorno
  text: Variables de entorno pasadas al proceso del servidor. Estas variables pueden usarse para configurar el comportamiento del servidor, proporcionar claves API, cadenas de conexión u otros valores de configuración.
  createFromValue: Insertar variable
  createFromVariable: Vincular variable con bóveda
zh:
  title: 创建环境变量
  text: 传递给服务器进程的环境变量。这些变量可用于配置服务器行为、提供API密钥、连接字符串或其他配置值。
  createFromValue: 插入变量
  createFromVariable: 将变量与保险库链接
</i18n>
