<script setup lang="ts">
import type { InputSocketJSON, OutputSocketJSON } from '@nwrx/api'

const props = defineProps<{
  modelValue?: object
  socket?: InputSocketJSON | OutputSocketJSON
  depth?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const cellStyle = computed(() => ({
  width: `${155 - (props.depth ?? 0) * 5}px`,
}))
</script>

<template>
  <div class="font-mono">
    <div v-for="(value, key) in model" :key="key" class="flex">
      <div :style="cellStyle" class="shrink-0 py-xs px-sm truncate b-r b-editor">
        {{ key }}
      </div>
      <div class="w-full py-xs px-sm truncate">
        {{ value }}
      </div>
    </div>
  </div>
</template>
