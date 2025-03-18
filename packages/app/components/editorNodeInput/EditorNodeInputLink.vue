<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'

defineProps<{
  name?: string
  schema?: Schema
}>()
</script>

<template>
  <div class="truncate px-sm py-xs font-mono text-sm">
    <span class="text-sm">
      {{ schema?.title || name || 'MISSING_INPUT_SCHEMA_AND_NAME' }}
    </span>
  </div>
</template>
