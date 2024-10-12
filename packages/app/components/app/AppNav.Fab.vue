<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<{ icon?: string } & BaseButtonProps>()
</script>

<template>
  <BaseButton
    v-bind="props"
    class="
        flex items-center justify-center
        transition rounded size-12
        hover:bg-layout-prominent
      ">

    <!-- Icon -->
    <slot>
      <BaseIcon :icon="icon" class="size-5" />
    </slot>
  </BaseButton>
</template>
