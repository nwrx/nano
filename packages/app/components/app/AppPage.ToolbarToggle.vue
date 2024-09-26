<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType } from '@unshared/vue'

const props = defineProps<{
  icon: string
} & BaseInputToggleProps<T, U>>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const model = useVModel(props, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <BaseInputToggle
    v-bind="props"
    v-model="model"
    as="div"
    eager
    class="
      flex items-center justify-center p-2
      rounded cursor-pointer
      transition-all duration-100

      text-black/60
      hover:text-black
      selected:text-black

      bg-transparent
      hover:bg-primary-100/30
      selected:bg-primary-100/80
      hover:selected:bg-primary-100/80
    ">

    <!-- Icon -->
    <BaseIcon :icon="icon" class="w-6 h-6" />
  </BaseInputToggle>
</template>
