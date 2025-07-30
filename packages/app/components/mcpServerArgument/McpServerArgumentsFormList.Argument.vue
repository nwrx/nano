<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import ArgumentCard from './McpServerArgumentCard.vue'
import Actions from './McpServerArgumentsActions.vue'

defineProps<{
  workspace: string
  pool: string
  server: string
  argument: McpServerArgumentObject
}>()
</script>

<template>
  <div class="flex items-center p-md gap-md">

    <!-- Argument Card -->
    <ArgumentCard
      :argument="argument"
      :inline="true"
      class="grow"
    />

    <!-- Actions -->
    <Actions
      :workspace="workspace"
      :name="pool"
      :server="server"
      :argument="argument"
    />
  </div>
</template>
