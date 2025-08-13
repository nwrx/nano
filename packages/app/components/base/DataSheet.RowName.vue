<script setup lang="ts">
const props = defineProps<{
  modelValue?: number | string
  isEditable?: boolean
  depth?: number
}>()

const value = useVModel(props, 'modelValue')
</script>

<template>
  <div class="flex items-start text-start select-none h-full">

    <!-- Depth indicator -->
    <div
      v-if="depth && depth > 0"
      class="b-solid b-app left-0 h-full"
      :style="{ borderWidth: `${(depth ?? 0) * 4}px` }"
    />

    <!-- Editable model -->
    <input
      v-if="isEditable"
      v-model="value"
      class="shrink-0 px-sm bg-transparent outline-none w-full">

    <!-- From prop or slot -->
    <div v-else class="px-sm py-sm w-full max-w-80 line-clamp-1">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>
