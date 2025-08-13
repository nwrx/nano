<script setup lang="ts">
import type { ThreadObject } from '@nwrx/nano-api'
import type { UUID } from 'node:crypto'
import PanelItem from '~/components/base/Panel.Item.vue'
import UserAudit from '~/components/user/UserAudit.vue'

defineProps<{
  thread: ThreadObject
}>()

const selectedThread = defineModel<UUID>()
</script>

<template>
  <PanelItem
    icon="i-carbon:dot-mark"
    :label="thread.id.slice(0, 8)"
    :description="thread.createdAt"
    :is-active="selectedThread === thread.id"
    class-label="font-mono"
    @click="() => selectedThread = thread.id">

    <!-- User -->
    <UserAudit
      inline
      :created-at="thread.createdAt"
      :created-by="thread.createdBy"
      class="mr-xl"
    />
  </PanelItem>
</template>
