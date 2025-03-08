<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'

defineProps<{
  variable: VaultVariableObject
}>()
</script>

<template>
  <div v-if="variable" class="flex space-x-sm items-center">
    <Badge
      class="badge-success"
      icon="i-carbon:locked"
      :label="variable.name"
    />
  </div>
</template>
