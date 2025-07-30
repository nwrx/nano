<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'
import BOOKMARK_1_URL from '~/assets/bookmark-1.png'

defineProps<{
  // workspace: string
  // project: string
  flows: Array<FlowObject & { workspace: string; project: string }>
}>()

const routeLocation = useRouteLocation()
</script>

<template>
  <div class="grid cols-4 gap-md">
    <ProjectBookmarksItem
      v-for="flow in flows"
      :key="flow.name"
      v-bind="flow"
      :workspace="flow.workspace"
      :image-url="BOOKMARK_1_URL"
      class="pb-md"
    />
  </div>
</template>
