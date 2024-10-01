<script setup lang="ts">
import type { UserSessionObject } from '@nwrx/api'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

defineProps<{ isCurrent: boolean } & UserSessionObject>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="flex items-center px-8 not-last:border-b border-black/10 py-4 gap-8">

    <!-- Is current indicator (circle) -->
    <div
      class="w-2 h-2 rounded-full border border-black/10"
      :class="isCurrent ? 'bg-success-400' : 'bg-black/10'"
    />

    <!-- Icon -->
    <BaseIcon
      icon="i-carbon:screen"
      class="w-10 h-10 text-black/70 shrink-0"
    />

    <!-- IP Address -->
    <div v-if="address">
      <p class="text-xs text-black/60">IP Address</p>
      <p class="text-sm font-medium text-black/60">{{ address }}</p>
    </div>

    <div v-if="lastUsedAt">
      <p class="text-xs text-black/60">Last used</p>
      <p class="text-sm font-medium text-black/60">{{ formatDistanceToNow(lastUsedAt, { addSuffix: true }) }}</p>
    </div>

    <!-- Browser -->
    <div v-if="browser">
      <p class="text-xs text-black/60">Browser</p>
      <p class="text-sm font-medium text-black/60">{{ browser }}</p>
    </div>

    <!-- System -->
    <div v-if="os">
      <p class="text-xs text-black/60">System</p>
      <p class="text-sm font-medium text-black/60">{{ os }}</p>
    </div>

    <!-- Device -->
    <div v-if="device">
      <p class="text-xs text-black/60">Device</p>
      <p class="text-sm font-medium text-black/60">{{ device }}</p>
    </div>

    <!-- Delete button -->
    <Button
      outlined
      size="sm"
      variant="danger"
      label="Remove"
      class="ml-auto"
      icon-prepend="i-carbon:logout"
      @click="() => emit('remove')"
    />
  </div>
</template>
