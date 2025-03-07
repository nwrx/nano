<script setup lang="ts">
import type { VaultUserPermissions } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  vault: string
}>()

const { t } = useI18n()
const client = useClient()
const assignments = ref<VaultUserPermissions[]>([])

async function getAssignments() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults/:name/assignments', {
    data: {
      workspace: props.workspace,
      name: props.vault,
    },
    onData: (data) => {
      assignments.value = data
    },
  })
}

onMounted(getAssignments)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <Table :columns="['user', 'permissions', 'actions']" :rows="assignments">

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
        <div class="flex items-center flex-wrap gap-2">
          <Badge
            v-for="permission in permissions"
            :key="permission"
            :label="t(`permissions.${permission}`)"
          />
        </div>
      </template>

      <!-- Cell / Actions -->
      <template #cell.actions="assignment">
        <Flags v-slot="dialogs" :keys="['edit', 'remove']">
          <div class="flex items-center justify-end space-x-md">
            <ContextMenu x="right" y="top">
              <template #menu>
                <ContextMenuItem icon="i-carbon:edit" :label="t('actions.edit')" @click="() => dialogs.open('edit')" />
                <ContextMenuItem icon="i-carbon:delete" :label="t('actions.remove')" @click="() => dialogs.open('remove')" />
              </template>
            </ContextMenu>
          </div>

          <!-- Edit dialog -->
          <WorkspaceSettingsVaultAssignmentsDialogEdit
            v-model="dialogs.value.edit"
            :workspace="workspace"
            :vault="vault"
            :assignment="assignment"
            @submit="() => getAssignments()"
          />

          <!-- Remove dialog -->
          <WorkspaceSettingsVaultAssignmentsDialogRemove
            v-model="dialogs.value.remove"
            :workspace="workspace"
            :vault="vault"
            :assignment="assignment"
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
        :label="t('actions.addUser')"
        @click="() => dialogs.open('assign')"
      />

      <WorkspaceSettingsVaultAssignmentsDialogAssign
        v-model="dialogs.value.assign"
        :workspace="workspace"
        :vault="vault"
        @submit="() => getAssignments()"
      />
    </Flags>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: User Access
  text: Manage which users can access this vault and their permission levels.
  table:
    header:
      user: User
      permissions: Permissions
      actions: ''
  actions:
    addUser: Add user access
    edit: Edit permissions
    remove: Remove access
  permissions:
    Read: Read
    Write: Write
    Admin: Admin
  permissionsDescription:
    Read: Can view and use secrets from this vault
    Write: Can add, modify and delete secrets in this vault
    Admin: Full control over this vault, including managing access
  dialog:
    assign:
      title: Add users to {vault} vault
      text: Select users and assign appropriate permission levels.
      selectPermissions: Select permissions to grant
      cancel: Cancel
      confirm: Add user(s)
      success: User(s) successfully added to the vault
    edit:
      title: Edit {username}'s access to {vault}
      text: Modify the permission levels for this user.
      cancel: Cancel
      confirm: Update permissions
      success: Permissions updated successfully
    remove:
      title: Remove {username}'s access to {vault}
      text: This user will no longer be able to access this vault.
      cancel: Cancel
      confirm: Remove access
      success: User access removed successfully
</i18n>
