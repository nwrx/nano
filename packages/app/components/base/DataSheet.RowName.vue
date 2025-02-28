<script setup lang="ts">
const props = defineProps<{
  modelValue?: number | string
  isEditable?: boolean
  depth?: number
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <div class="flex items-center text-start max-w-80 select-none">

    <!-- Depth indicator -->
    <div
      v-if="depth && depth > 0"
      class="b-solid b-editor left-0 h-8"
      :style="{ borderWidth: `${(depth ?? 0) * 4}px` }"
    />

    <!-- Editable model -->
    <input
      v-if="isEditable"
      v-model="model"
      class="shrink-0 px-sm bg-transparent outline-none w-full">

    <!-- From prop or slot -->
    <div v-else class="px-sm bg-transparent w-full max-w-80 line-clamp-1">
      <slot>{{ model }}</slot>
    </div>
  </div>
</template>
