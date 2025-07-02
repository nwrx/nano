<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'
import RecordsField from './Records.Field.vue'

defineProps<{
  icon?: string
  title?: string
  fields?: Array<{ label: string; value?: number | string }>
}>()

defineSlots<{
  title?: []
  fields?: []
  default?: []
}>()
</script>

<template>
  <div class="flex items-start space-x-md p-md w-full">

    <!-- Icon -->
    <div v-if="icon" class="flex items-center justify-center w-12 shrink-0">
      <BaseIcon
        :icon="icon"
        class="size-8 text-app"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-col space-y-md">
      <p class="text-md text-app font-medium">
        <slot name="title">
          {{ title }}
        </slot>
      </p>

      <!-- Fields -->
      <div class="flex flex-col space-y-xs">
        <slot name="fields">
          <RecordsField
            v-for="(field, index) in fields"
            :key="index"
            :label="field.label"
            :value="field.value"
          />
        </slot>
      </div>

      <!-- Content -->
      <slot />
    </div>
  </div>
</template>
