<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType } from '@unshared/vue'

const props = defineProps<{
  label?: string
  icon?: string
} & BaseInputToggleProps<T, U>>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <BaseInputToggle
    v-bind="props"
    v-model="model"
    as="div"
    class="
      flex flex-col items-center justify-center aspect-1/1
      cursor-pointer rounded
      transition-all duration-100

      bg-primary-100
      border-primary-500
      text-black
      border

      bg-opacity-20
      hover:bg-opacity-50
      selected:bg-opacity-50
      selected:hover:bg-opacity-100

      border-opacity-10
      hover:border-opacity-50
      selected:border-opacity-70
      selected:hover:border-opacity-100

      text-opacity-50
      hover:text-opacity-80
      selected:text-opacity-80
      selected:text-primary-500
      selected:hover:text-opacity-100
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="w-16 h-16 shrink-0"
    />

    <!-- Label -->
    <span
      class="text-xs"
      v-text="label"
    />

  </BaseInputToggle>
</template>
