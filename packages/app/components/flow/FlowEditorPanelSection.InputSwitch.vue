<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps, ToggleType } from '@unshared/vue'

const props = defineProps<{
  label: string
  hint?: string
} & BaseInputToggleProps<T, U>>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()

// --- Two-way binding.
const model = useVModel(props as { modelValue: T }, 'modelValue', emit, {
  passive: true,
})
</script>

<template>
  <BaseInputToggle
    v-slot="{ isActive }"
    v-bind="props"
    v-model="model"
    as="div"
    class="
      flex items-center space-x-md cursor-pointer w-full
      bg-editor-panel
      not-first:rd-t-0 -mt-px
      not-last:rd-b-0
      input input-sm
      hover:input-hover
      focus:input-focus
      !bg-transparent
    ">

    <!-- Label & Hint -->
    <div class="flex flex-col items-start text-left w-40 border-r border-editor">
      <h3 class="text-xs" v-text="label" />
      <!-- <p class="text-xs text-subtle" v-text="hint" /> -->
    </div>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Switch (like iOS switch) -->
    <div
      class="flex items-center justify-center size-4 rounded"
      :class="{ 'bg-primary-500 text-white': isActive }">
      <BaseIcon
        class="size-3"
        :icon="isActive ? 'i-carbon:checkmark' : 'i-carbon:close'"
      />
    </div>
  </BaseInputToggle>
</template>
