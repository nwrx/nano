<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload<'node:error'>
}>()
</script>

<template>
  <div class="hint hint-danger">
    {{ event.message }}
  </div>
</template>
