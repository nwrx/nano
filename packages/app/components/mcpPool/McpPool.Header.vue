<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'

defineProps<{
  pool: McpPoolObject
}>()
</script>

<template>
  <div class="flex flex-col items-start p-lg bg-subtle b-b b-app">
    <h3 class="text-2xl font-medium">
      {{ pool.title }}
    </h3>
    <p class="text-sm text-subtle">
      {{ pool.description }}
    </p>
  </div>
</template>
