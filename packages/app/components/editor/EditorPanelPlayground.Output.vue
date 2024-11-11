<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
import { vMarkdown } from '#imports'

defineProps<{
  event: FlowSessionEventPayload<'thread:output'>
}>()
</script>

<template>
  <div>
    <div class="text-xs text-emphasized">
      {{ event.name }}
    </div>
    <div
      v-markdown="String(event.value)"
      class="markdown"
    />
  </div>
</template>
