<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload<'thread:nodeError'>
}>()
</script>

<template>
  <div class="hint hint-danger">
    {{ event.message }}
  </div>
</template>
