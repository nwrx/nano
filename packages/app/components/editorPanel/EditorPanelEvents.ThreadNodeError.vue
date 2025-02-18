<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/nano-api'

defineProps<{
  event: EditorSessionServerMessage & { event: 'thread:nodeError' }
}>()
</script>

<template>
  <div class="hint hint-danger select-text">
    <!-- Code -->
    <Badge
      v-if="event.name"
      :label="event.name"
      class="badge-sm badge-danger mb-xs font-mono"
    />

    <!-- Error -->
    <p class="text-sm">
      <slot>
        {{ event.message }}
      </slot>
    </p>
  </div>
</template>
