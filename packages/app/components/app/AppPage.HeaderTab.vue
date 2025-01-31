<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon?: string
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class-active="
      !bg-active !text-active font-medium
    "
    class="
      flex items-center gap-sm cursor-pointer
      text-app rd-t px-sm py-xs
      hover:bg-prominent
    ">

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-4"
    />

    <!-- Label -->
    <span
      class="text-base font-medium"
      v-text="label"
    />
  </BaseButton>
</template>
