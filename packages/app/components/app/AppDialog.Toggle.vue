<script setup lang="ts" generic="U extends ToggleType">
import type { WorkspaceProjectPermission } from '@nwrx/api'
import type { BaseInputToggleProps, ToggleType } from '@unshared/vue'

const props = defineProps<{
  label: string
  text: string
} & BaseInputToggleProps<WorkspaceProjectPermission, U>>()

const emit = defineEmits<{
  'update:modelValue': [value: WorkspaceProjectPermission]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <BaseInputToggle
    v-bind="props"
    v-model="model"
    :value
    as="button"
    class="
      flex items-start justify-start w-full space-x-4
      transition-opacity duration-200
      opacity-60
      hover:opacity-100
      selected:opacity-100
      group
    ">

    <!-- Circle on/off -->
    <template #default="{ isActive }">
      <div
        class="
        w-2 h-2 mt-2 transition-all duration-100
        ring-1 shrink-0
        ring-black/50
        ring-offset-2
        group-hover:ring-offset-3
      "
        :class="{
          'bg-black': isActive,
          'bg-transparent': !isActive,
          'rounded-full': type === 'radio',
          'rounded-0.2': type !== 'radio',
        }"
      />

      <!-- Title & Text -->
      <div class="text-left">
        <h3 class="text-sm">
          {{ label }}
        </h3>
        <p class="text-sm opacity-60">
          {{ text }}
        </p>
      </div>
    </template>
  </BaseInputToggle>
</template>
