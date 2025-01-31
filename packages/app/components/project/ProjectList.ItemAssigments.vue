<script setup lang="ts">
import type { WorkspaceProjectUserPermissionsObject } from '@nwrx/api'

defineProps<{
  assignments?: WorkspaceProjectUserPermissionsObject[]
}>()
</script>

<template>
  <div class="flex items-center justify-center -space-x-2">
    <div
      v-for="assignment in assignments"
      :key="assignment.user.username"
      class="w-8 h-8 rounded-full border-1 border-black/10 bg-center bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url(${assignment.user.avatarUrl})` }"
    />
  </div>
</template>
