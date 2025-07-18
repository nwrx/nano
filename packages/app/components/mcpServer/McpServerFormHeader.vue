<!-- eslint-disable vue/no-dupe-keys -->
<script setup lang="ts">
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const server = useMcpServer(props)
onMounted(() => server.fetchServer(true))
</script>

<template>
  <div class="flex flex-col justify-center items-start p-lg bg-subtle b-b b-app min-h-32">
    <h3 v-if="server" class="text-2xl font-medium">
      {{ server.data.title }}
    </h3>
    <p v-if="server" class="text-sm text-subtle">
      {{ server.data.description }}
    </p>
  </div>
</template>
