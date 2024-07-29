<script setup lang="ts">
import type { UUID } from 'node:crypto'
import type { ChainObject } from '~/server/chain'

defineProps<{ chains: ChainObject[] }>()

const emit = defineEmits<{
  chainCreate: []
  chainDelete: [id: UUID]
}>()
</script>

<template>
  <div class="flex flex-col">

    <!-- Toolbar -->
    <div class="p-4 w-full">
      <div class="flex items-center justify-between w-full p-4 bg-gray-200">
        <div>
          <p class="text-sm text-gray-500">All active chains</p>
          <h1 class="text-lg font-bold">Chains ({{ chains.length }})</h1>
        </div>

        <Button label="Create Chain" @click="() => emit('chainCreate')" />
      </div>
    </div>

    <!-- List of chains -->
    <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div
        v-for="chain in chains"
        :key="chain.id"
        class="
        flex flex-col items-center justify-center w-full
        bg-white border border-gray-200 p-4 gap-4
        ">

        <!-- Name -->
        <h1>{{ chain.name }}</h1>

        <!-- Actions -->
        <div class="flex items-center justify-center w-full gap-4">
          <Button label="Edit" :to="{ name: 'ChainEdit', params: { id: chain.id } }" />
          <Button label="Delete" @click="() => emit('chainDelete', chain.id)" />
        </div>
      </div>
    </div>
  </div>
</template>
