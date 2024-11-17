<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  path?: string
  color?: string
  isOutput?: boolean
  isLinkeable?: boolean
}>()

const dataId = computed(() => {
  const type = props.isOutput ? 'out' : 'in'
  return ['pin', type, props.id, props.name, props.path].filter(Boolean).join('-')
})
</script>

<template>
  <div
    class="h-8 flex items-center self-start"
    :class="{
      'pr-sm': !isOutput,
      'pl-sm': isOutput,
    }">
    <div
      :data-id="dataId"
      class="h-2 shrink-0 transition"
      :style="{ backgroundColor: color }"
      :class="{
        'rd-r-lg': !isOutput,
        'rd-l-lg': isOutput,
        'w-4': isLinkeable,
        'w-2 ml-2 rd-lg': !isLinkeable,
      }"
    />
  </div>
</template>
