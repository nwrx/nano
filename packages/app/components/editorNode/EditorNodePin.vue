<script setup lang="ts">
defineProps<{
  color: string
  appearance: 'dot' | 'left' | 'right'
}>()
</script>

<template>
  <div
    class="w-6 h-8 flex items-center self-start transition duration-fast"
    :class="{
      'pr-sm -translate-x-2px': appearance === 'left',
      'pl-sm translate-x-2px': appearance === 'right',
    }">
    <div
      class="h-2 shrink-0 transition duration-fast"
      :style="{ backgroundColor: color }"
      :class="{
        'w-4': appearance !== 'dot',
        'rd-r rd-l-sm': appearance === 'left',
        'rd-l rd-r-sm': appearance === 'right',
        'w-2 ml-2 rd-lg': appearance === 'dot',
      }"
    />
  </div>
</template>
