<script setup lang="ts">
import type { UserSessionObject } from '@nwrx/api'

defineProps<{
  sessions: UserSessionObject[]
}>()

const emit = defineEmits<{
  removeSession: [index: number]
}>()
</script>

<template>
  <AppPageForm title="Sessions" vertical>
    <template #text>
      Manage your active sessions and sign out from devices you no longer use.
    </template>

    <!-- Sessions -->
    <div class="w-full rounded border border-black/10">
      <h3 class="text-sm font-medium p-4 bg-primary-50 border-b border-black/10">
        Active Sessions
      </h3>
      <UserSettingsSessionsItem
        v-for="(session, index) in sessions"
        :key="index"
        v-bind="session"
        :is-current="index === 0"
        @remove="() => emit('removeSession', index)"
      />
    </div>
  </AppPageForm>
</template>
