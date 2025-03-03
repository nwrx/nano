<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsLogs',
  path: '/:workspace/settings/logs',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:data-view-alt',
  title: {
    en: 'Logs',
    fr: 'Journaux',
    de: 'Protokolle',
    es: 'Registros',
    zh: '日志',
  },
  description: {
    en: 'View and manage workspace logs and configure log forwarding.',
    fr: 'Visualisez et gérez les journaux de l\'espace de travail et configurez le transfert de journaux.',
    de: 'Sehen und verwalten Sie Arbeitsbereichsprotokolle und konfigurieren Sie die Protokollweiterleitung.',
    es: 'Ver y administrar registros del espacio de trabajo y configurar el reenvío de registros.',
    zh: '查看和管理工作区日志并配置日志转发。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)

// --- Log redirection settings
const redirectionEnabled = ref(false)
const redirectionType = ref<'lgtm' | 'syslog'>('syslog')
const redirectionHost = ref('')
const redirectionPort = ref(514)
const redirectionToken = ref('')

// --- Log data
const logs = ref<Array<{
  id: string
  timestamp: string
  level: 'error' | 'info' | 'warning'
  message: string
  source: string
  metadata?: Record<string, any>
}>>([])

const isLoading = ref(false)
const isStreaming = ref(false)
const streamLogs = ref(false)

// --- Stream logs in real-time
watch(streamLogs, (newValue) => {
  if (newValue)
    startLogStreaming()
  else
    stopLogStreaming()

})

function startLogStreaming() {
  if (isStreaming.value) return
  isStreaming.value = true
  // Implementation would connect to a WebSocket or SSE endpoint for real-time logs
}

function stopLogStreaming() {
  isStreaming.value = false
  // Implementation would disconnect from streaming endpoint
}

// --- Load logs
async function loadLogs(parameters = {}) {
  isLoading.value = true
  try {
    // Simulated API call - replace with actual implementation
    // const response = await api.getLogs(workspace.value, params)
    // logs.value = response.data

    // Placeholder for demo
    setTimeout(() => {
      logs.value = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'User logged in',
          source: 'auth-service',
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'warning',
          message: 'Rate limit approaching',
          source: 'api-gateway',
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'error',
          message: 'Database connection failed',
          source: 'db-service',
          metadata: { attempt: 3, nextRetry: 5000 },
        },
      ]
      isLoading.value = false
    }, 500)
  }
  catch (error) {
    console.error('Failed to load logs', error)
    isLoading.value = false
  }
}

// --- Export logs
function exportLogs() {
  // Implementation would generate and download a log file
  const logData = JSON.stringify(logs.value, null, 2)
  const blob = new Blob([logData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${workspace.value}-logs-${new Date().toISOString()}.json`
  document.body.append(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// --- Clear logs
function clearLogs() {
  // Implementation would call an API to clear logs
  logs.value = []
}

// --- Save redirection settings
async function saveRedirectionSettings() {
  // Implementation would save the redirection settings to the backend
  // await api.saveLogRedirection(workspace.value, {
  //   enabled: redirectionEnabled.value,
  //   type: redirectionType.value,
  //   host: redirectionHost.value,
  //   port: redirectionPort.value,
  //   token: redirectionToken.value,
  // })
}

// --- Initialize
onMounted(() => {
  loadLogs()
})
</script>

<template>
  <AppPageContainer contained>
    <!-- Log Redirection Section -->
    <AppPageForm
      :title="t('logs.redirection.title')"
      :text="t('logs.redirection.text')">

      <div class="mb-4">
        <Checkbox
          v-model="redirectionEnabled"
          :text="t('logs.redirection.text')"
          :label="t('logs.redirection.enable')"
        />
      </div>

      <div v-if="redirectionEnabled" class="space-y-4">
        <Tabs>
          <TabsItem
            v-model="redirectionType"
            value="syslog"
            :label="t('logs.redirection.syslog')"
          />
          <TabsItem
            v-model="redirectionType"
            value="lgtm"
            :label="t('logs.redirection.lgtm')"
          />
        </Tabs>

        <div class="flex space-x-4">
          <InputText
            v-model="redirectionHost"
            class="flex-1"
            :label="t('logs.redirection.host')"
            :placeholder="t('logs.redirection.hostPlaceholder')"
          />
          <InputText
            v-model="redirectionPort"
            class="w-32"
            type="number"
            :label="t('logs.redirection.port')"
            :placeholder="t('logs.redirection.portPlaceholder')"
          />
        </div>

        <div v-if="redirectionType === 'lgtm'">
          <InputText
            v-model="redirectionToken"
            :label="t('logs.redirection.token')"
            :placeholder="t('logs.redirection.tokenPlaceholder')"
            type="password"
          />
        </div>

        <Button @click="saveRedirectionSettings">
          {{ t('logs.redirection.save') }}
        </Button>
      </div>
    </AppPageForm>

    <!-- Log History Section -->
    <AppPageForm
      :title="t('logs.history.title')"
      :text="t('logs.history.text')">

      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
          <Checkbox
            v-model="streamLogs"
            :text="t('logs.history.stream')"
            :label="t('logs.history.stream')"
          />
          <div v-if="isStreaming" class="flex items-center">
            <div class="w-2 h-2 bg-success rounded-full animate-pulse mr-2" />
            <span class="text-sm text-subtle">{{ t('logs.history.streaming') }}</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <Button :loading="isLoading" @click="loadLogs">
            <BaseIcon icon="i-carbon:renew" size="sm" class="mr-1" />
            {{ t('logs.history.refresh') }}
          </Button>
        </div>
      </div>

      <div class="bg-subtle dark:bg-layout-emphasized rounded-md p-2 h-80 overflow-auto">
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <BaseIcon icon="i-carbon:cloud-loading" size="xl" class="animate-spin" />
        </div>
        <div v-else-if="logs.length === 0" class="flex justify-center items-center h-full text-subtle">
          {{ t('logs.history.empty') }}
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="log in logs"
            :key="log.id"
            class="p-2 rounded-md text-sm font-mono"
            :class="{
              'bg-app dark:bg-layout-subtle': log.level === 'info',
              'bg-warning dark:bg-warning': log.level === 'warning',
              'bg-danger dark:bg-danger': log.level === 'error',
            }">
            <div class="flex justify-between">
              <span
                :class="{
                  'text-primary dark:text-layout': log.level === 'info',
                  'text-warning dark:text-warning': log.level === 'warning',
                  'text-danger dark:text-danger': log.level === 'error',
                }">
                {{ log.level.toUpperCase() }}
              </span>
              <span class="text-xs text-subtle">
                {{ new Date(log.timestamp).toLocaleString() }}
              </span>
            </div>
            <div class="mt-1">
              [{{ log.source }}] {{ log.message }}
            </div>
            <div v-if="log.metadata" class="mt-1 text-xs">
              <pre class="whitespace-pre-wrap">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </AppPageForm>

    <!-- Log Actions Section -->
    <AppPageForm :title="t('logs.actions.title')" :text="t('logs.actions.text')">
      <AppPageFormActions class="b-app">
        <AppPageFormAction
          icon="i-carbon:download"
          class="b-app"
          class-button="button-success"
          :title="t('logs.actions.export.title')"
          :label="t('logs.actions.export.label')"
          :text="t('logs.actions.export.text')"
        />
        <AppPageFormAction
          icon="i-carbon:trash-can"
          class="b-app"
          class-button="button-danger"
          :title="t('logs.actions.clear.title')"
          :label="t('logs.actions.clear.label')"
          :text="t('logs.actions.clear.text')"
        />
      </AppPageFormActions>
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  logs:
    redirection:
      title: Log Redirection
      text: Configure your logs to be forwarded to an external logging service. This will allow you to centralize and manage logs from multiple sources in one place for easier monitoring and analysis.
      enable: Enable log forwarding
      syslog: Syslog
      lgtm: LGTM Stack
      host: Host
      hostPlaceholder: e.g., logs.example.com
      port: Port
      portPlaceholder: e.g., 514
      token: Access Token
      tokenPlaceholder: Enter your LGTM access token
      save: Save Configuration
    history:
      title: Log History
      text: View real-time and historical logs from your workspace.
      stream: Stream logs in real-time
      streaming: Live streaming
      refresh: Refresh
      empty: No logs found
    actions:
      export:
        title: Export the workspace logs
        text: Download a copy of your workspace logs. The raw log data will be saved as a JSON file.
        label: Export
      clear:
        title: Clear all logs from the workspace
        text: Permanently delete all logs that originated from this workspace. If you proceed, this action cannot be undone.
        label: Clear All
</i18n>
