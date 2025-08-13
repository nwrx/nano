<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue/BaseButton'
import { BaseButton } from '@unshared/vue/BaseButton'

const props = defineProps<BaseButtonProps & {
  icon?: string
  description?: string
  classLabel?: string
  classDescription?: string
}>()

const slots = defineSlots<{
  default?: []
  menu?: []
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :class="{
      'hover:bg-subtle !b-active': isActive,
      'hover:bg-subtle': !isActive,
    }"
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer select-none
      b b-transparent b-b-app hover:b-active
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-5 text-prominent shrink-0"
    />

    <!-- Title -->
    <div class="flex min-w-0 grow flex-row space-x-sm text-start">
      <span
        v-if="label"
        :class="classLabel"
        class="text-sm font-medium whitespace-nowrap">
        {{ label }}
      </span>

      <!-- Description -->
      <span
        v-if="description"
        :class="classDescription"
        class="text-sm text-subtle line-clamp-1">
        {{ description }}
      </span>
    </div>

    <!-- Spacer -->
    <div
      v-if="slots.default || slots.menu"
      class="grow"
    />

    <!-- Actions -->
    <slot name="default" />

    <slot name="menu" />
  </BaseButton>
</template>
