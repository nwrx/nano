<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload<'thread:nodeError'>
}>()
</script>

<template>
  <div class="hint hint-danger select-text">
    <!-- Code -->
    <Badge
      v-if="event.code"
      :label="event.code"
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
