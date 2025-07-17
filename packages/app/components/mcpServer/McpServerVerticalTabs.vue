<script setup lang="ts">
import type { RouteRecordNormalized } from 'vue-router'
import VerticalTabsButton from '~/components/base/VerticalTabs.Button.vue'
import VerticalTabs from '~/components/base/VerticalTabs.vue'

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const pool = computed(() => route.params.pool as string)
const server = computed(() => route.params.server as string)

// --- Ensure `WorkspaceMcpServer` is always first.
const groupRoutes = useRouteGroup('workspace-mcp-server')
const groupRoutesSorted = computed(() => groupRoutes.toSorted((a, b) => {
  if (a.name === 'WorkspaceMcpServer') return -1
  if (b.name === 'WorkspaceMcpServer') return 1
  return 0
}))

// --- Get if selected route is active.
function isRouteActive(thisRoute: RouteRecordNormalized) {
  return route.name === thisRoute.name
    && route.params.workspace === workspace.value
    && route.params.pool === pool.value
    && route.params.server === server.value
}
</script>

<template>
  <VerticalTabs class="b-l b-app">
    <!--
      <VerticalTabsButton value="settings" icon="i-carbon:settings" />
      <VerticalTabsButton value="container" icon="i-carbon:container-runtime" />
      <VerticalTabsButton value="variables" icon="i-carbon:value-variable" />
      <VerticalTabsButton value="arguments" icon="i-carbon:terminal" />
      <VerticalTabsButton value="status" icon="i-carbon:container-runtime-monitor" />
      <VerticalTabsButton value="tools" icon="i-carbon:tools" />
    -->

    <VerticalTabsButton
      v-for="groupRoute in groupRoutesSorted"
      :key="groupRoute.name"
      :value="groupRoute.name"
      :icon="groupRoute.meta.icon"
      :is-active="isRouteActive(groupRoute)"
      :to="{
        name: groupRoute.name,
        params: { workspace, pool, server },
      }"
    />
  </VerticalTabs>
</template>
