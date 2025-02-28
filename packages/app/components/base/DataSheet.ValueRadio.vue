<script setup lang="ts">
import type { SchemaOption } from '@nwrx/nano/utils'

const props = defineProps<{
  modelValue?: unknown
  options?: SchemaOption[]
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <div class="flex items-center grow  bg-red" :class="{ 'cursor-pointer': model }">
    <div v-for="(option, index) in options" :key="index" class="flex items-center space-x-xs grow">
      <p v-text="option.label" />
    </div>
  </div>
</template>
