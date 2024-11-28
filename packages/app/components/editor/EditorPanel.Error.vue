<script setup lang="ts">
defineProps<{
  name?: string
  message?: string
  context?: Record<string, unknown>
}>()
</script>

<template>
  <div class="flex flex-col items-start hint hint-danger p-md b-x-0 rd-0 select-text">

    <!-- Code -->
    <Badge
      v-if="name"
      :label="name"
      class="badge-sm badge-danger mb-xs font-mono"
    />

    <!-- Error -->
    <span class="text-sm">
      <slot>
        {{ message }}
      </slot>
    </span>

    <!-- Context -->
    <EditorPanelDataContainer v-if="context && Object.keys(context).length > 0">
      <EditorPanelData
        v-for="(value, key) in context"
        :key="key"
        :name="key"
        :model-value="value"
      />
    </EditorPanelDataContainer>
  </div>
</template>
