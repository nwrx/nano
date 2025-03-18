<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'

defineProps<{
  name?: string
  schema?: Schema
}>()
</script>

<template>
  <p class="text-sm truncate text-subtle shrink-0 mr-sm font-mono">
    {{ schema?.title || name || 'MISSING_SCHEMA_AND_NAME' }} ‒
  </p>
</template>
