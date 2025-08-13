<script setup lang="ts">
import type { WorkspaceUserPermissions } from '@nwrx/nano-api'

const props = defineProps<{ name: string }>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const assignments = ref<WorkspaceUserPermissions[]>([])

async function getAssignments() {
  await client.requestAttempt('GET /workspaces/:workspace/assignments', {
    data: {
      workspace: props.name,
    },
    onData: (data) => {
      assignments.value = data
    },
  })
}

onMounted(getAssignments)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('description')">
    <Table :columns="['user', 'permissions', 'actions']" :rows="assignments!">

      <!-- Header -->
      <template #header="header">
        {{ t(`table.header.${header}`) }}
      </template>

      <!-- Cell / User -->
      <template #cell.user="{ username, displayName }">
        <UserCard
          class="!px-0"
          :display-name="displayName"
          :username="username"
        />
      </template>

      <!-- Cell / Permissions -->
      <template #cell.permissions="{ permissions }">
        <div class="flex items-center space-x-sm">
          <Badge
            v-for="permission in permissions"
            :key="permission"
            :label="t(`roles.${permission}.label`)"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.actions="assignment">
        <Flags v-slot="dialogs" :keys="['edit', 'unassign']">
          <ContextMenu x="right" y="top">
            <template #menu>
              <ContextMenuItem icon="i-carbon:edit" :label="t('actions.manage')" @click="() => dialogs.open('edit')" />
              <ContextMenuItem icon="i-carbon:delete" :label="t('actions.unassign')" @click="() => dialogs.open('unassign')" />
            </template>
          </ContextMenu>

          <!-- Edit dialog -->
          <WorkspaceSettingsAssignmentsDialogEdit
            v-model="dialogs.value.edit"
            :workspace="name"
            :username="assignment.username"
            :initial-value="assignment.permissions"
            @submit="() => getAssignments()"
          />

          <!-- Unassign dialog -->
          <WorkspaceSettingsAssignmentsDialogUnassign
            v-model="dialogs.value.unassign"
            :workspace="name"
            :username="assignment.username"
            :display-name="assignment.displayName"
            @submit="() => getAssignments()"
          />
        </Flags>
      </template>
    </Table>

    <Flags v-slot="dialogs" :keys="['assign']">
      <Hyperlink
        eager
        class="text-sm"
        icon="i-carbon:add"
        :label="t('actions.addMember')"
        @click="() => dialogs.open('assign')"
      />

      <WorkspaceSettingsAssignmentsDialogAssign
        v-model="dialogs.value.assign"
        :workspace="name"
        @submit="() => getAssignments()"
      />
    </Flags>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Access & Permissions
  description: Manage workspace members and their permissions. Control who can access and modify resources in this workspace.
  table:
    header:
      user: User
      permissions: Permissions
      actions: ''
  actions:
    addMember: Add a new member to the workspace
    manage: Manage permissions
    unassign: Remove from workspace
  roles:
    Admin:
      label: Admin
      text: Full control over the workspace, including managing members and settings.
    Member:
      label: Member
      text: Can create and access projects within the workspace.
    Owner:
      label: Owner
      text: Full control over the workspace, including managing members and settings.
</i18n>
