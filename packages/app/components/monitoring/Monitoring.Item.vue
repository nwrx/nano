<script setup lang="ts">
defineProps<{
  title: string
  text: string
  badges?: string[]
  icon?: string
  iconClass?: string
  isSelected?: boolean
}>()

const emit = defineEmits<{
  click: []
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
      cursor-pointer  select-none transition-colors
    "
    @click="() => emit('click')">

    <!-- Dot -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      :class="iconClass"
      class="size-3 shrink-0"
    />

    <!-- Badge -->
    <template v-for="badge in badges" :key="badge">
      <Badge class="shrink-0">
        {{ badge }}
      </Badge>
    </template>

    <!-- Title -->
    <p class="text-base shrink-0">
      {{ title }}
    </p>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Text -->
    <p class="text-xs text-subtle truncate">
      {{ text }}
    </p>
  </BaseButton>
</template>
