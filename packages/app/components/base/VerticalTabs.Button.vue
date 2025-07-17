<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseButtonProps } from '@unshared/vue'

const props = defineProps<BaseButtonProps & {
  icon?: string
  label?: string
}>()
</script>

<template>
  <BaseButton
    v-bind="props"
    eager>
    <div
      class="
        flex flex-col items-center justify-center size-16 cursor-pointer
        b b-transparent hover:b-active
      "
      :class="{
        'bg-active b-prominent': isActive === true,
      }">
      <BaseIcon
        :icon="icon"
        class="size-6"
        :class="{ 'text-active': isActive }"
      />
    </div>
  </BaseButton>
</template>
