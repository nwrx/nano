<script setup lang="ts">
defineProps<{
  color: string
  appearance: 'dot' | 'left' | 'right'
}>()
</script>

<template>
  <div
    class="w-6 h-8 flex items-center self-start"
    :class="{
      'pr-sm': appearance === 'left',
      'pl-sm': appearance === 'right',
    }">
    <div
      class="h-2 shrink-0 transition"
      :style="{ backgroundColor: color }"
      :class="{
        'w-4': appearance !== 'dot',
        'rd-r-lg': appearance === 'left',
        'rd-l-lg': appearance === 'right',
        'w-2 ml-2 rd-lg': appearance === 'dot',
      }"
    />
  </div>
</template>
