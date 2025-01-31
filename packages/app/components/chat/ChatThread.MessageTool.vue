<script setup lang="ts">
defineProps<{
  id: string
  content: Record<string, unknown>
  isDone?: boolean
  toolName?: string
  toolMessage?: string
}>()
</script>

<template>
  <div>
    <div class="text-right text-xs text-emphasized">
      {{ toolName }}
    </div>
    <div class="flex items-center space-x-md bg-subtle b b-app p-md rd">

      <!-- Icon -->
      <BaseIcon
        :icon="!isDone ? 'i-line-md:loading-loop' : 'i-carbon:checkmark-outline'"
        :class="!isDone ? 'text-warning' : 'text-success'"
        class="size-5"
      />

      <p class="text-base">
        {{ toolMessage }}
      </p>
    </div>
  </div>
</template>
