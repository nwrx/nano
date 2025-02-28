<script setup lang="ts">
import type { WorkspacePermission, WorkspaceUserPermissions } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  assignments: WorkspaceUserPermissions[]
}>()

const emit = defineEmits<{
  submitAssign: [string]
  submitUnassign: [string]
  submitPermissions: [string, WorkspacePermission[]]
}>()

const { t } = useI18n()
const isAssignDialogOpen = ref(false)
</script>

<template>
  <AppPageForm vertical :title="t('title')">
    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline>
          <br><br>
        </template>
        <template #documentation>
          <Hyperlink :label="t('text.documentation')" :to="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- List of assignments -->
    <div class="rounded w-full b b-app">
      <BaseTable
        :columns="['user', 'permissions', 'actions']"
        :rows="assignments!"
        class="w-full"
        class-cell="px-8 py-2"
        class-header="bg-subtle"
        class-row="b-t b-app hover:bg-subtle">

        <!-- Header -->
        <template #header="name">
          <div class="w-full font-medium px-lg py-sm text-sm text-start">
            {{ t(`header.${name}`) }}
          </div>
        </template>

        <!-- Cell / User -->
        <template #cell.user="{ username, displayName }">
          <UserCard :display-name="displayName" :username="username" />
        </template>

        <template #cell.permissions="{ permissions }">
          <WorkspaceSettingsAssignmentsPermissions :permissions="permissions" />
        </template>

        <template #cell.actions="{ username, displayName, permissions }">
          <WorkspaceSettingsAssignmentsActions
            :workspace="workspace"
            :username="username"
            :display-name="displayName"
            :permissions="permissions"
            @submit-unassign="() => emit('submitUnassign', username)"
            @submit-permissions="(permissions) => emit('submitPermissions', username, permissions)"
          />
        </template>
      </BaseTable>
    </div>

    <div class="flex items-center justify-between p-4">
      <Hyperlink
        eager
        class="text-sm"
        icon="i-carbon:add"
        :label="t('button.addMember')"
        @click="() => isAssignDialogOpen = true"
      />
    </div>

    <!-- Assign dialog -->
    <WorkspaceSettingsAssignmentsDialogAssign
      v-model="isAssignDialogOpen"
      :workspace="workspace"
      @submit="(username) => emit('submitAssign', username)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Workspace Assignments
  text: Define who can access and manage the workspace. You can add or remove team members, and assign them different permissions. For more information, please refer to the {documentation}.
  text.documentation: documentation
  button.addMember: Assign a member to the workspace
  header.user: User
  header.permissions: Permissions
  header.actions: ''
</i18n>
