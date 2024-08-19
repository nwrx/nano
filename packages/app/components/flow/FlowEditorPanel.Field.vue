<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <input
    v-model="model"
    :placeholder="label"
    class="
      outline-none px-2 py-1 rounded-md
      text-black/70
      hover:text-black/80
      focus:text-black/90
      border
      border-primary-100
      hover:border-primary-500
      focus:border-primary-600
      transition-all duration-100
    "
  />
</template>
