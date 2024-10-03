<script setup lang="ts">
defineProps<{ groups: NavItem[] }>()
</script>

<template>
  <div
    class="
      flex flex-col w-full h-full max-w-80 gap-2 pr-6
      bg-white border-r border-black/10
    ">

    <AppPageNavGroup
      v-for="group in groups"
      :key="group.label"
      :label="group.label"
      :items="group.items"
    />
  </div>
</template>
