<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon?: string
  disabled?: boolean
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class-active="
      !b-active font-medium
    "
    class="
      flex items-center gap-sm cursor-pointer
      text-app px-md py-xs b-b-2 b-transparent
      hover:bg-prominent rd-t
    "
    :class="{
      'cursor-not-allowed opacity-50': disabled,
    }">

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
