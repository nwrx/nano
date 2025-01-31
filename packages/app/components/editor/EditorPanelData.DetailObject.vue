<script setup lang="ts">
import type { InputSocketJSON } from '@nwrx/api'
import type { ResultSocket } from '@nwrx/core'

const props = defineProps<{
  modelValue?: object
  socket?: InputSocketJSON | ResultSocket
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <div class="font-mono">

    <div v-for="(value, key) in model" :key="key" class="flex">

      <!-- Key -->
      <div class="w-140px shrink-0 py-xs px-sm truncate b-r b-editor">
        {{ key }}
      </div>

      <!-- Value -->
      <div class="w-full py-xs px-sm truncate">
        {{ value }}
      </div>
    </div>
  </div>
</template>
