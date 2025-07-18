<script setup lang="ts">
import IconDialogExplorer from './IconDialogExplorer.vue'
import IconDynamic from './IconDynamic.vue'

const icon = defineModel<string>()
const showDialog = ref(false)
</script>

<template>
  <!-- Trigger -->
  <Button
    class="button-fab"
    @click="() => showDialog = true">
    <IconDynamic
      :name="icon"
      class="size-5"
      load
    />
  </Button>

  <!-- Dialog -->
  <IconDialogExplorer
    v-model="showDialog"
    v-model:icon="icon"
    @submit="(selectedIcon) => icon = selectedIcon"
  />
</template>
