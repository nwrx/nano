<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon?: string
  label?: string
  compact?: boolean
  isActive?: boolean
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    :to="to"
    :label="label"
    :class="{
      'h-8 text-sm': compact,
      'h-10 text-base': !compact,
      '!bg-prominent !text-prominent': isActive,
    }"
    class-active="
      font-medium !bg-prominent !text-prominent
    "
    class="
      flex items-center gap-sm px-md rd
      bg-transparent hover:bg-emphasized
      text-app hover:text-app
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4 aspect-1/1 rd text-app"
      load
    />

    <!-- Label -->
    <span>{{ label }}</span>

  </BaseButton>
</template>
