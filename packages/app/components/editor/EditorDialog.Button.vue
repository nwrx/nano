<script setup lang="ts">
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'

defineProps<{
  icon?: string
  label?: string
  isActive?: boolean
}>()

const emit = defineEmits<{
  'click': []
}>()
</script>

<template>
  <BaseButton
    eager
    :class="{
      'w-7': !label,
      'px-sm': label,
      '!bg-active !text-active': isActive,
    }"
    class="
       flex items-center justify-center cursor-pointer
        rd transition h-7 space-x-xs
      hover:bg-active hover:text-active
    "
    @click="() => emit('click')">

    <!-- Label -->
    <span v-if="label" class="text-sm">
      {{ label }}
    </span>

    <!-- Icon -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-5"
    />
  </BaseButton>
</template>
