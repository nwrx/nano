<script setup lang="ts">
const props = defineProps<{
  modelValue?: string[]
  value: string
  icon: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <BaseInputToggle
    v-model="model"
    as="div"
    eager
    :value="value"
    type="checkbox"
    class="
      w-8 h-8 flex items-center justify-center cursor-pointer
      !selected:bg-prominent
      hover:bg-subtle
    ">
    <BaseIcon :icon="icon" />
  </BaseInputToggle>
</template>
