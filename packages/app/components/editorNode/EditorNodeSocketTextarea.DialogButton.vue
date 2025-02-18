<script setup lang="ts">
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
      '!bg-editor-active !text-editor-active': isActive,
    }"
    class="
       flex items-center justify-center cursor-pointer
      hover:bg-prominent rd transition h-7 space-x-xs
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
