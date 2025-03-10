<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'

defineProps<{
  variable: VaultVariableObject
}>()
</script>

<template>
  <div>
    <div class="flex items-center space-x-xs">
      <BaseIcon icon="i-carbon:password" class="size-4" />
      <div class="text-base font-medium" v-text="variable.name" />
    </div>
  </div>
</template>
