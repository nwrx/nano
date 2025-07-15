<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps } from '@unshared/vue/BaseInputToggle'
import type { ToggleType, ToggleValue } from '@unshared/vue/useBaseInputToggle'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { BaseInputToggle } from '@unshared/vue/BaseInputToggle'

const props = defineProps<BaseInputToggleProps<T, U> & {
  icon?: string
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
        flex flex-col items-center justify-center size-16 cursor-pointer
        b-2 b-transparent hover:b-active
      "
      :class="{
        'bg-active b-prominent': isActive === true,
      }">
      <BaseIcon
        :icon="icon"
        class="size-6"
        :class="{ 'text-active': isActive }"
      />
    </div>
  </BaseInputToggle>
</template>
