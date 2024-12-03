<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
defineProps<{
  icon?: string
  name?: string
  updatedAt?: string
  createdAt?: string
  isSelected?: boolean
}>()

const emit = defineEmits<{
  'click': []
  'archive': []
  // 'rename': [name: string]
}>()
</script>

<template>
  <BaseButton
    eager
    :class="{
      '!b-editor-active bg-prominent': isSelected,
      'hover:bg-prominent': !isSelected,
    }"
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer select-none transition-colors bg-subtle
    "
    @click="() => emit('click')">

    <!-- Dot -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      class="size-5 text-prominent"
    />

    <!-- Title -->
    <p class="text-sm line-clamp-1 text-start">
      {{ name }}
    </p>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Context Menu -->
    <ChatPanelThreadActions
      :name="name"
      @archive="() => emit('archive')"
    />
  </BaseButton>
</template>
