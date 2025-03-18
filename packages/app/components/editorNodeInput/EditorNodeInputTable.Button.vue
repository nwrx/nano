<script setup lang="ts">
import { BaseIcon } from '@unshared/vue/BaseIcon'

defineProps<{
  icon: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <BaseButton
    eager
    class="flex items-center justify-center w-8 h-full cursor-pointer hover:bg-active hover:text-active"
    @click="() => emit('click')">
    <BaseIcon :icon="icon" class="size-4 my-1" />
  </BaseButton>
</template>
