<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'

defineProps<{
  variable: VaultVariableObject
}>()
</script>

<template>
  <div class="flex items-center">
    <div class="i-carbon:password text-lg mr-2" />
    <div class="flex flex-col">
      <div class="text-sm font-medium">
        {{ variable.name }}
      </div>
      <div class="text-xs text-gray-500">
        {{ variable.vault }}
      </div>
    </div>
  </div>
</template>
