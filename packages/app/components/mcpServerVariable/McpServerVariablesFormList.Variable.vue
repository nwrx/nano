<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import VariableCard from './McpServerVariableCard.vue'
import Actions from './McpServerVariablesActions.vue'

defineProps<{
  workspace: string
  pool: string
  server: string
  variable: McpServerVariableObject
}>()
</script>

<template>
  <div class="flex items-center p-md gap-md">

    <!-- Icon -->
    <VariableCard
      :variable="variable"
      :inline="true"
      class="grow"
    />

    <!-- Actions -->
    <Actions
      :workspace="workspace"
      :name="pool"
      :server="server"
      :variable="variable"
    />
  </div>
</template>
