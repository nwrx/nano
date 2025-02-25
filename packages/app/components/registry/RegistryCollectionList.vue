<script setup lang="ts">
import type { RegistryCollectionObject } from '@nwrx/nano-api'

defineProps<{
  collections: RegistryCollectionObject[]
}>()
</script>

<template>
  <div class="w-full">
    <RegistryCollectionListItem
      v-for="(collection, index) in collections"
      :key="collection.name"
      :collection="collection"
      :is-first="index === 0"
      :is-last="index === collections.length - 1"
    />
  </div>
</template>
