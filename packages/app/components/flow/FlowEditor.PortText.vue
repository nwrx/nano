<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})
</script>

<template>
  <input
    v-model="model"
    :placeholder="name"
    :class="{
      'font-medium italic': model,
    }"
    class="
      w-full text-start px-2 py-0.5 outline-none
      border appearance-none rounded
      transition-colors duration-200

      bg-primary-50
      hover:bg-primary-100
      focus:bg-primary-100

      border-transparent
      hover:border-primary-300
      focus:border-primary-500

      placeholder-black/50
    "
  />
</template>
