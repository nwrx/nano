<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'

defineProps<{
  name: string
  schema: Schema
  hideDash?: boolean
}>()
</script>

<template>
  <p class="flex items-center text-sm truncate text-subtle shrink-0 mr-sm font-mono gap-sm">

    <!-- Label -->
    <span>
      {{ schema.title || name || 'MISSING_SCHEMA_AND_NAME' }}
    </span>

    <!-- Separator -->
    <BaseIcon
      v-if="!hideDash"
      icon="i-carbon:arrow-right"
      class="w-3 h-3 shrink-0"
    />
  </p>
</template>
