<script setup lang="ts">
import type { UUID } from 'node:crypto'
import type { FlowObject } from '~/server/flow'

defineProps<{ flows: FlowObject[] }>()

const emit = defineEmits<{
  flowCreate: []
  flowDelete: [id: UUID]
}>()
</script>

<template>
  <div class="flex flex-col">

    <!-- Toolbar -->
    <div class="flex items-center justify-between w-full p-4 bg-gray-200">
      <div>
        <p class="text-sm">All active chains</p>
        <h1 class="text-lg font-bold">Chains ({{ flows.length }})</h1>
      </div>

      <Button
        link
        label="Create Chain"
        icon-append="i-carbon:arrow-right"
        icon-expand
        @click="() => emit('flowCreate')"
      />
    </div>

    <!-- List of chains -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <FlowListCard
        v-for="flow in flows"
        :flow="flow"
        :emit="emit"
        @flowDelete="(id: UUID) => emit('flowDelete', id)"
      />
    </div>
  </div>
</template>
