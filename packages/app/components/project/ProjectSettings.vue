<script setup lang="ts">
import type { UserObject, WorkspaceProjectObject, WorkspaceProjectPermission } from '@nwrx/api'
import type { ProjectSetSettingsOptions } from '~/composables/useProject'

defineProps<{
  workspace: string
  searchUsers: (search: string) => Promise<UserObject[]>
} & WorkspaceProjectObject>()

const emit = defineEmits<{
  'submitName': [name: string]
  'submitSettings': [ProjectSetSettingsOptions]
  'submitUserAssignment': [username: string, permissions: WorkspaceProjectPermission[]]
  'submitDelete': []
  'submitTransfer': [username: string]
}>()
</script>

<template>
  <ProjectSettingsGeneral
    :name="name"
    :title="title"
    :description="description"
    :workspace="workspace"
    @submit="({ title, description }) => emit('submitSettings', { title, description })"
  />
  <AppPageDivider />
  <ProjectSettingsAssigments
    v-if="assignments"
    :assigments="assignments"
    :searchUsers="searchUsers"
    @submit="(username, permissions) => emit('submitUserAssignment', username, permissions)"
  />
  <AppPageDivider />
  <ProjectSettingsDangerZone
    :searchUsers="searchUsers"
    :workspace="workspace"
    :project="name"
    :title="title"
    @submitName="name => emit('submitName', name)"
    @submitDelete="() => emit('submitDelete')"
    @submitTransfer="username => emit('submitTransfer', username)"
  />
</template>
