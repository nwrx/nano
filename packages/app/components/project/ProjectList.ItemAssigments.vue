<script setup lang="ts">
import type { WorkspaceProjectUserPermissionsObject } from '@nwrx/nano-api'

defineProps<{
  assignments?: WorkspaceProjectUserPermissionsObject[]
}>()
</script>

<template>
  <div class="flex items-center justify-center -space-x-sm">
    <div
      v-for="assignment in assignments"
      :key="assignment.user.username"
      class="size-8 rounded-full border border-app-active bg-center bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url(${assignment.user.avatarUrl})` }"
    />
  </div>
</template>
