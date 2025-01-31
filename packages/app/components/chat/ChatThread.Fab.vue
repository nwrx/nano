<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon: string
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class="
      size-10 flex items-center justify-center cursor-pointer rd
      bg-prominent hover:bg-primary-500 hover:text-white transition-colors
    ">

    <!-- Icon -->
    <BaseIcon
      :icon="icon"
      class="size-5"
    />

  </BaseButton>
</template>
