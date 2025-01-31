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
      '!b-editor-active bg-subtle': isSelected,
      'hover:bg-subtle': !isSelected,
    }"
    class="
      flex items-center px-md py-sm space-x-sm w-full
      cursor-pointer bg-app  select-none transition-colors
      b b-transparent b-b-app
    "
    @click="() => emit('click')">

    <!-- Dot -->
    <BaseIcon
      v-if="icon"
      :icon="icon"
      :class="iconClass"
      class="size-5 text-prominent"
    />

    <!-- Badge -->
    <template v-for="badge in badges" :key="badge">
      <Badge class="shrink-0">
        {{ badge }}
      </Badge>
    </template>

    <!-- Title -->
    <p class="text-sm font-mono shrink-0">
      {{ title }}
    </p>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Text -->
    <p class="text-xs font-medium text-subtle truncate">
      {{ text }}
    </p>
  </BaseButton>
</template>
