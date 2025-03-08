<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  project: string
  title?: string
  load?: boolean
}>()

const client = useClient()
const data = ref<ProjectObject>({} as ProjectObject)

// --- If `load` is true, load the user profile data from the API
watch(props, async() => {
  if (!props.load || !props.workspace || !props.project) return
  await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project', {
    data: {
      workspace: props.workspace,
      project: props.project,
    },
    onData: (user) => {
      data.value = user
    },
  })
}, { immediate: true })
</script>

<template>
  <div class="flex items-center p-sm space-x-md text-start font-normal">
    <div>
      <p class="font-medium" v-text="title ?? data.title" />
      <p class="text-sm text-subtle" v-text="data.name" />
    </div>
  </div>
</template>
