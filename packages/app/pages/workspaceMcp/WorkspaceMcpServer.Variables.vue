<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import FormHeader from '~/components/mcpServer/McpServerFormHeader.vue'
import FormCreate from '~/components/mcpServerVariable/McpServerVariablesFormCreate.vue'
import FormList from '~/components/mcpServerVariable/McpServerVariablesFormList.vue'

definePageMeta({
  name: 'WorkspaceMcpServerVariables',
  path: '/:workspace/integrations/:pool/servers/:server/variables',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:password',
  groups: ['workspace-mcp-server'],
  title: {
    en: 'Variables',
    fr: 'Variables',
    de: 'Variablen',
    es: 'Variables',
    zh: '变量',
  },
  description: {
    en: 'Manage environment variables for your MCP server.',
    fr: 'Gérez les variables d\'environnement de votre serveur MCP.',
    de: 'Verwalten Sie Umgebungsvariablen für Ihren MCP-Server.',
    es: 'Administra las variables de entorno de tu servidor MCP.',
    zh: '管理您的MCP服务器的环境变量。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const selectedPool = computed(() => route.params.pool as string)
const selectedServer = computed(() => route.params.server as string)
</script>

<template>
  <div>
    <FormHeader
      :workspace="workspace"
      :pool="selectedPool"
      :name="selectedServer"
      class="sticky top-0 z-1"
    />
    <AppPageContainer contained>
      <FormCreate
        :workspace="workspace"
        :pool="selectedPool"
        :name="selectedServer"
      />
      <FormList
        :workspace="workspace"
        :pool="selectedPool"
        :name="selectedServer"
      />
    </AppPageContainer>
  </div>
</template>
