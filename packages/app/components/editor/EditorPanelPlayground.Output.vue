<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/api'
import { vMarkdown } from '#imports'

defineProps<{
  event: EditorSessionServerMessage<'thread:output'>
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
