<script setup lang="ts">
import { useMcpPool } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  name: string
}>()

const pool = useMcpPool(props)
onMounted(() => pool.fetchPool(true))
</script>

<template>
  <div class="flex flex-col items-start p-lg bg-subtle b-b b-app">
    <h3 class="text-2xl font-medium">
      {{ pool.data.title }}
    </h3>
    <p class="text-sm text-subtle">
      {{ pool.data.description }}
    </p>
  </div>
</template>
