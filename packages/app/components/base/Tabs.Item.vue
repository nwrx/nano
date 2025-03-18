<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType, ToggleValue } from '@unshared/vue'

const props = defineProps<BaseInputToggleProps<T, U> & {
  hint?: string
  label?: string
  icon?: string
  classTab?: string
  classLabel?: string
  classIcon?: string
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
      :class="[classTab, isActive ? '!tab-active' : 'tab-inactive']"
      class="tab flex items-center space-x-sm w-full hover:tab-hover">

      <!-- Icon -->
      <BaseIcon
        v-if="icon"
        :icon="icon"
        :class="classIcon"
      />

      <!-- Label -->
      <label class="pointer-events-none select-none" :class="classLabel">
        <slot>{{ label }}</slot>
      </label>
    </div>
  </BaseInputToggle>
</template>
