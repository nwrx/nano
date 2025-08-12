<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps } from '@unshared/vue/BaseInputToggle'
import type { ToggleType, ToggleValue } from '@unshared/vue/useBaseInputToggle'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { BaseInputToggle } from '@unshared/vue/BaseInputToggle'

const props = defineProps<BaseInputToggleProps<T, U> & {
  icon?: string
  small?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: ToggleValue<T, U>] }>()

const model = useVModel(props as { modelValue: ToggleValue<T, U> }, 'modelValue', emit)
</script>

<template>
  <BaseInputToggle
    v-slot="{ isActive }"
    v-bind="props"
    v-model="model"
    as="div">
    <div
      class="
        flex flex-col items-center justify-center cursor-pointer
        b b-transparent hover:b-active
      "
      :class="{
        'bg-active b-prominent': isActive === true,
        'size-16': !small,
        'size-12': small,
      }">
      <BaseIcon
        :icon="icon"
        :class="{
          'text-active': isActive,
          'size-6': !small,
          'size-4': small,
        }"
      />
    </div>
  </BaseInputToggle>
</template>
