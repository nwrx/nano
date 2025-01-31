<script setup lang="ts">
import type { ProjectAssigmentUser, UserObject, WorkspaceProjectPermission } from '@nwrx/api'
import type { UUID } from 'node:crypto'

const props = defineProps<{
  assigments: ProjectAssigmentUser[]
  searchUsers: (search: string) => Promise<UserObject[]>
}>()

const emit = defineEmits<{
  submit: [username: string, permissions: WorkspaceProjectPermission[]]
}>()

const assigments = useVModel(props, 'assigments', emit, { passive: true })
const assigmentsSelectedIds = ref<UUID[]>([])
const isAssignDialogOpen = ref(false)
</script>

<template>
  <AppPageForm title="Members">
    <template #text>
      Define who can access and manage your project. You can add or remove team members, and assign them
      different permissions. For more information, please refer to the <Button link variant="primary" href="#">documentation</Button>.
    </template>

    <!-- List of assignments -->
    <div class="rounded w-full border border-black/10">
      <ProjectSettingsAssignment
        v-for="assignment in assigments"
        :key="assignment.userName"
        v-model="assigmentsSelectedIds"
        :userId="assignment.userName"
        :userName="assignment.userName"
        :userDisplayName="assignment.userDisplayName"
        :permissions="assignment.permissions"
        @submit="value => emit('submit', assignment.userName, value)"
      />

      <div class="flex items-center justify-between p-4">
        <Button
          link
          eager
          size="sm"
          icon="i-carbon:add"
          label="Add Team Member"
          @click="() => isAssignDialogOpen = true"
        />
        <ProjectSettingsAssignmentDialogAssign
          v-model="isAssignDialogOpen"
          :searchUsers="searchUsers"
        />
      </div>
    </div>
  </AppPageForm>
</template>
