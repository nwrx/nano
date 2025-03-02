<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType, ToggleValue } from '@unshared/vue'

const props = defineProps<BaseInputToggleProps<T, U> & {
  hint?: string
  label?: string
  icon?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

const model = useVModel(props as { modelValue: ToggleValue<T, U> }, 'modelValue', emit)
</script>

<template>
  <BaseInputToggle
    v-slot="{ isActive }"
    v-bind="props"
    v-model="model"
    eager
    as="div">

    <!-- Label -->
    <div
      :class="{
        '!tab-active': isActive,
        'tab-inactive': !isActive,
        'transition-colors': !isActive,
      }"
      class="
        tab flex items-center space-x-sm cursor-pointer
        w-full px-lg py-xs min-h-10
        hover:tab-hover
      ">

      <!-- Icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        class="text-lg"
      />

      <!-- Label -->
      <label class="text-base pointer-events-none select-none">
        <slot>{{ label }}</slot>
      </label>
    </div>
  </BaseInputToggle>
</template>
