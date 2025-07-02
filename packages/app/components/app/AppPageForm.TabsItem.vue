<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts" generic="T, U extends ToggleType">
import type { BaseInputToggleProps } from '@unshared/vue/BaseInputToggle'
import type { ToggleType, ToggleValue } from '@unshared/vue/useBaseInputToggle'
import { BaseInputToggle } from '@unshared/vue/BaseInputToggle'

const props = defineProps<BaseInputToggleProps<T, U> & {
  label?: string
}>()

const model = defineModel<ToggleValue<T, U>>()
</script>

<template>
  <BaseInputToggle
    v-slot="{ isActive }"
    v-bind="props"
    v-model="model"
    eager
    class="cursor-pointer select-none"
    as="div">
    <div
      class="pb-4 b-b-2 -mb-px"
      :class="{
        'text-app b-active': isActive,
        'text-subtle b-transparent hover:text-app hover:b-app': !isActive,
      }">
      <slot>
        {{ label }}
      </slot>
    </div>
  </BaseInputToggle>
</template>
