<script setup lang="ts">
import type { UUID } from 'node:crypto'
import type { FlowObject } from '~/server/flow'

defineProps<{
  flow: FlowObject
}>()

const emit = defineEmits<{
  flowDelete: [id: UUID]
}>()
</script>

<template>
  <Card outlined class-container="space-y-8">

    <!-- Name -->
    <h1 class="text-2xl font-bold">
      {{ flow.name }}
    </h1>

    <!-- Description -->
    <p class="text-sm text-gray-500">
      {{ flow.description }}
    </p>

    <!-- Actions -->
    <div class="flex items-center justify-between w-full gap-4">
      <Button
        label="Delete"
        outlined
        variant="danger"
        icon="i-carbon:delete"
        @click="() => emit('flowDelete', flow.id)"
      />
      <Button
        label="Edit"
        filled
        variant="primary"
        icon="i-carbon:edit"
        :to="{ name: 'FlowsEditor', params: { id: flow.id } }"
      />
    </div>
  </Card>
</template>
