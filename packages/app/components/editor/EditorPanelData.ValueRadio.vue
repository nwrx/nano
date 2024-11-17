<script setup lang="ts">
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  modelValue?: unknown
  options?: SocketListOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <!-- Generate a two state inline radio selector -->
  <div
    class="flex items-center grow  bg-red"
    :class="{ 'cursor-pointer': emit }">

    <!-- Radio / Iterate over options -->
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex items-center space-x-xs grow">

      <!-- Label -->
      <p v-text="option.label" />
    </div>

  </div>
</template>
