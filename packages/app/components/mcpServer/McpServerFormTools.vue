<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Button from '~/components/base/Button.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
server.options.withTools = true
onMounted(server.fetchServer)

// --- Return an empty array if tools are not available.
const tools = computed(() => {
  if (!server.data.tools) return []
  return server.data.tools
})
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Tools List -->
    <div class="b b-app w-full bg-subtle rd">

      <!-- No Tools -->
      <AppPageFormEmpty
        v-if="tools.length === 0"
        :title="t('noToolsTitle')"
        :text="t('noToolsText')"
        icon="i-carbon:tools"
      />

      <!-- Lines -->
      <template v-else>
        <div
          v-for="tool in tools"
          :key="tool.name"
          class="
          flex items-center px-xs
          b b-transparent b-t-app
          first:rd-t last:rd-b
          hover:b-active hover:b
        ">

          <!-- Tool -->
          <div class="text-xs font-mono">
            <span class="text-subtle hidden lg:inline">{{ server.data.name }}.</span>
            <span class="text-app font-semibold">{{ tool.name }}</span>
          </div>

          <!-- Spacer -->
          <span class="flex-1 min-w-16" />

          <!-- Description -->
          <span class="text-xs text-subtle line-clamp-1">{{ tool.description }}</span>
        </div>
      </template>
    </div>

    <!-- Actions -->
    <div class="w-full flex items-center justify-between pt-md">
      <Button
        icon-prepend="i-carbon:renew"
        :label="t('fetchTools')"
        @click="() => server.fetchTools({ refresh: true })"
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
  fetchTools: Refresh Tools
  toolsCount: '{count} tool(s) available'
  refreshSuccess: Tools refreshed successfully
</i18n>
