<script setup lang="ts">
import type { WorkspaceProjectAssignmentObject } from '@nwrx/api'

defineProps<{
  assignments?: WorkspaceProjectAssignmentObject[]
}>()
</script>

<template>
  <div class="flex items-center justify-center -space-x-2">
    <div
      v-for="assignment in assignments"
      :key="assignment.userName"
      class="w-8 h-8 rounded-full ring-1 ring-black/10 bg-center bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url(${assignment.userImageUrl})` }"
    />
  </div>
</template>
