<script setup lang="ts">
defineProps<{
  isOutput?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <div
    class="
      w-6 h-8 self-start flex items-center justify-center shrink-0
      hover:bg-prominent cursor-pointer op-0 group-hover:op-100
    "
    :class="{
      'rd-l': !isOutput,
      'rd-r': isOutput,
    }"
    @mousedown.stop="() => emit('click')">
    <BaseIcon icon="i-carbon:subtract" class="size-4" />
  </div>
</template>
