<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
import AppLayout from '~/components/app/AppLayout.vue'
import AppPage from '~/components/app/AppPage.vue'
import McpPoolList from '~/components/mcpPool/McpPool.List.vue'
import McpServerVerticalTabs from '~/components/mcpServer/McpServerVerticalTabs.vue'
import WorkspaceHeader from '~/components/workspace/WorkspaceHeader.vue'

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const pool = computed(() => route.params.pool as string)
const server = computed(() => route.params.server as string)

// --- When page changes, scroll to top smoothly.
const contentElement = ref<HTMLDivElement>()
watch(
  () => route.path,
  () => contentElement.value?.scrollTo({ top: 0, behavior: 'smooth' }),
)
</script>

<template>
  <AppLayout>
    <AppPage>
      <WorkspaceHeader />

      <!-- Content -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto divide-x divide-app">
        <div class="relative w-full">
          <div class="flex h-full w-full flex-row">

            <!-- Select -->
            <McpPoolList
              :workspace="workspace"
              class="b-r b-app h-full overflow-y-auto grow max-w-sm w-full"
            />

            <!-- Content -->
            <div ref="contentElement" class="flex flex-col h-full overflow-y-auto w-full">
              <NuxtPage class="grow" />
            </div>

            <!-- Server Panel Selector -->
            <McpServerVerticalTabs v-if="workspace && pool && server" />
          </div>
        </div>
      </div>
    </AppPage>
  </AppLayout>
</template>
