<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/api'

defineProps<{
  event: EditorSessionServerMessage<'thread:start'>
}>()
</script>

<template>
  <EditorPanelDataContainer>
    <EditorPanelData
      v-for="(input, index) in Object.entries(event.input)"
      :key="index"
      :name="input[0]"
      :model-value="input[1]"
    />
  </EditorPanelDataContainer>
</template>
