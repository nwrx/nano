<script setup lang="ts">
import RecordsEntry from './Records.Entry.vue'

defineProps<{
  entries?: Array<{
    icon?: string
    title?: string
    fields: Array<{ label: string; value?: number | string }>
  }>
}>()

defineSlots<{
  default?: []
}>()
</script>

<template>
  <div class="b b-app w-full rd divide-y divide-app bg-subtle">
    <slot name="default">
      <RecordsEntry
        v-for="(entry, index) in entries"
        :key="index"
        :icon="entry.icon"
        :title="entry.title"
        :fields="entry.fields"
      />
    </slot>
  </div>
</template>
