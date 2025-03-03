<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType, ToggleValue } from '@unshared/vue'

const props = defineProps<BaseInputToggleProps<T, U> & {
  id?: string
  text?: string
  label?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: ToggleValue<T, U>] }>()

const model = useVModel(props as { modelValue: ToggleValue<T, U> }, 'modelValue', emit)
</script>

<template>
  <BaseInputToggle
    v-slot="{ isActive }"
    v-bind="props"
    v-model="model"
    as="div"
    class="flex items-start space-x-md cursor-pointer select-none group">

    <!-- Circle when active -->
    <div
      class="
        flex items-center justify-center shrink-0 size-4
        b b-primary-900 dark:b-primary-50 rd
        group-hover:b-2 transition duration-fast
      "
      :class="{
        'bg-primary-900 dark:bg-primary-50': isActive === true,
        '!rd-full': type === 'radio',
      }">
      <Transition>
        <BaseIcon v-if="isActive === true" icon="i-carbon:checkmark" class="dark:text-black text-white" />
        <BaseIcon v-else-if="isActive === 'mixed'" icon="i-carbon:close" class="dark:text-black text-white" />
      </Transition>
    </div>

    <!-- Label -->
    <div class="flex flex-col pointer-events-none -mt-xs">
      <label
        v-if="label"
        :for="id"
        class="text-base"
        :class="isActive === true ? 'font-semibold' : 'font-normal'"
        v-text="label"
      />

      <!-- Hint -->
      <div
        v-if="text"
        class="text-sm text-subtle"
        v-text="text"
      />
    </div>
  </BaseInputToggle>
</template>
