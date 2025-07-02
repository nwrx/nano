<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps } from '@unshared/vue/BaseInputToggle'
import type { ToggleType, ToggleValue } from '@unshared/vue/useBaseInputToggle'
import { BaseInputToggle } from '@unshared/vue/BaseInputToggle'

const props = defineProps<BaseInputToggleProps<T, U> & {
  id?: string
  text?: string
  label?: string
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
        relative flex flex-col p-lg cursor-pointer select-none group
        b bg-app h-full rd
        hover:border-prominent transition duration-fast
      "
      :class="{
        'bg-subtle b-prominent': isActive === true,
        'bg-app b-app': isActive !== true,
      }">

      <!-- Icon -->
      <div class="flex justify-center mb-md">
        <BaseIcon
          v-if="icon"
          :icon="icon"
          class="size-8 text-prominent"
        />
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center text-center space-y-xs">
        <!-- Label -->
        <label
          v-if="label"
          :for="id"
          class="text-base font-medium pointer-events-none text-app"
          :class="{ 'font-semibold text-active': isActive === true }"
          v-text="label"
        />

        <!-- Description -->
        <div
          v-if="text"
          class="text-sm text-subtle pointer-events-none"
          :class="{ 'text-emphasized': isActive === true }"
          v-text="text"
        />
      </div>

      <!-- Active indicator -->
      <div
        v-if="isActive === true"
        class="absolute top-sm right-sm">
        <div
          class="
            flex items-center justify-center size-5
            bg-prominent rd-full
          ">
          <BaseIcon icon="i-carbon:checkmark" class="size-3 text-app" />
        </div>
      </div>
    </div>
  </BaseInputToggle>
</template>
