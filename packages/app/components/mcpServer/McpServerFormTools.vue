<script setup lang="ts">
import type { McpServerObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Button from '~/components/base/Button.vue'

const props = defineProps<{
  server: McpServerObject
  workspace: string
  pool: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const isLoading = ref(false)
const tools = computed(() => {
  if (!props.server) return []
  if (!props.server.tools) return []
  return props.server.tools
})

// --- Fetch server tools
async function refreshTools() {
  if (isLoading.value) return
  isLoading.value = true
  await client.requestAttempt('GET /api/workspaces/:workspace/pools/:pool/servers/:server/tools', {
    parameters: {
      workspace: props.workspace,
      pool: props.pool,
      server: props.server.name,
    },
    onSuccess: () => {
      alerts.success(t('refreshSuccess'))
    },
    onEnd: () => {
      isLoading.value = false
      emit('refresh')
    },
  })
}
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Tools List -->
    <div class="b b-app w-full bg-subtle rd">

      <!-- No Tools -->
      <div v-if="tools.length === 0" class="text-center p-lg text-subtle">
        <div class="mb-md">
          <BaseIcon icon="i-carbon:tools" class="size-12 mx-auto opacity-50" />
        </div>
        <p class="text-lg font-medium mb-sm">
          {{ t('noToolsTitle') }}
        </p>
        <p class="text-sm">
          {{ t('noToolsText') }}
        </p>
      </div>

      <!-- Lines -->
      <template v-else>
        <div
          v-for="tool in server.tools"
          :key="tool.name"
          class="
          flex items-center px-xs
          b b-transparent b-t-app
          hover:b-active hover:b
        ">

          <!-- Tool -->
          <div class="font-mono whitespace-nowrap">
            <span class="text-subtle hidden lg:inline">{{ server.name }}.</span>
            <span class="text-app font-semibold">{{ tool.name }}</span>
          </div>

          <!-- Spacer -->
          <span class="flex-1 min-w-16" />

          <!-- Description -->
          <span class="text-subtle line-clamp-1">{{ tool.description }}</span>
        </div>
      </template>
    </div>

    <!-- Actions -->
    <div class="w-full flex items-center justify-between pt-md">
      <Button
        :loading="isLoading"
        icon-prepend="i-carbon:renew"
        :label="t('refreshTools')"
        @click="() => refreshTools()"
      />

      <div class="flex items-center space-x-sm text-sm text-subtle">
        <BaseIcon icon="i-carbon:information" class="size-4" />
        <span>{{ t('toolsCount', { count: tools.length }) }}</span>
      </div>
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Server Tools
  text: View the tools and capabilities exposed by this MCP server instance
  noToolsTitle: No Tools Available
  noToolsText: This MCP server doesn't expose any tools or the server is not running
  refreshTools: Refresh Tools
  toolsCount: '{count} tool(s) available'
  refreshSuccess: Tools refreshed successfully
</i18n>
