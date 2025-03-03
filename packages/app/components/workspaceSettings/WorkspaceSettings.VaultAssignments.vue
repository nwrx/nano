<script setup lang="ts">
import type { VaultUserPermissions } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  name: string
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const assignments = ref<VaultUserPermissions[]>([])

async function getAssignments() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults/:name/assignments', {
    data: {
      workspace: props.workspace,
      name: props.name,
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
        <Trigger v-slot="dialogs" :keys="['edit', 'remove']">
          <div class="flex items-center justify-end space-x-md">
            <ContextMenu x="right" y="top">
              <template #menu>
                <ContextMenuItem icon="i-carbon:edit" :label="t('actions.edit')" @click="() => dialogs.open('edit')" />
                <ContextMenuItem icon="i-carbon:delete" :label="t('actions.remove')" @click="() => dialogs.open('remove')" />
              </template>
            </ContextMenu>
          </div>

          <!-- Edit dialog -->
          <Ephemeral v-slot="{ value }" :initial-value="{ permissions: [...assignment.permissions] }">
            <Dialog
              v-model="dialogs.value.edit"
              icon="i-carbon:edit"
              class-hint="hint-warning"
              class-button="button-warning"
              :title="t('dialog.edit.title', { username: assignment.username, vault: props.name })"
              :text="t('dialog.edit.text')"
              :label-cancel="t('dialog.edit.cancel')"
              :label-confirm="t('dialog.edit.confirm')"
              @confirm="() => {
                client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/assignments/:username', {
                  data: {
                    name: props.name,
                    workspace: props.workspace,
                    username: assignment.username,
                    permissions: value.permissions,
                  },
                  onSuccess: () => {
                    getAssignments()
                    alerts.success(t('dialog.edit.success'))
                  },
                })
              }">
              <div class="space-y-4">
                <Checkbox
                  v-for="permission in ['Read', 'Write', 'Admin'] as const"
                  :key="permission"
                  v-model="value.permissions"
                  :value="permission"
                  type="checkbox"
                  :label="t(`permissions.${permission}`)"
                  :text="t(`permissionsDescription.${permission}`)"
                />
              </div>
            </Dialog>
          </Ephemeral>

          <!-- Remove dialog -->
          <Dialog
            v-model="dialogs.value.remove"
            icon="i-carbon:delete"
            class-hint="hint-danger"
            class-button="button-danger"
            :title="t('dialog.remove.title', { username: assignment.username, vault: props.name })"
            :text="t('dialog.remove.text')"
            :label-cancel="t('dialog.remove.cancel')"
            :label-confirm="t('dialog.remove.confirm')"
            @confirm="() => {
              client.requestAttempt('DELETE /api/workspaces/:workspace/vaults/:name/assignments/:username', {
                data: {
                  name: props.name,
                  workspace: props.workspace,
                  username: assignment.username,
                },
                onSuccess: () => {
                  getAssignments()
                  alerts.success(t('dialog.remove.success'))
                },
              })
            }">
            <UserCard
              :display-name="assignment.displayName"
              :username="assignment.username"
            />
          </Dialog>
        </Trigger>
      </template>
    </Table>

    <Trigger v-slot="dialogs" :keys="['assign']">
      <Hyperlink
        eager
        class="text-sm"
        icon="i-carbon:add"
        :label="t('actions.addUser')"
        @click="() => dialogs.open('assign')"
      />

      <Ephemeral v-slot="{ value }" :initial-value="{ users: [], permissions: ['Read'] }">
        <Dialog
          v-model="dialogs.value.assign"
          icon="i-carbon:add"
          class-hint="hint-success"
          class-button="button-success"
          :title="t('dialog.assign.title', { vault: props.name })"
          :text="t('dialog.assign.text')"
          :label-cancel="t('dialog.assign.cancel')"
          :label-confirm="t('dialog.assign.confirm')"
          @confirm="() => {
            client.requestAttempt('POST /api/workspaces/:workspace/vaults/:name/assignments', {
              data: {
                workspace: props.workspace,
                name: props.name,
                usernames: value.users,
                permissions: value.permissions,
              },
              onSuccess: () => {
                getAssignments()
                alerts.success(t('dialog.assign.success'))
              },
            })
          }">
          <UserSearch v-model="value.users" />

          <div class="mt-4 space-y-2">
            <div class="font-medium">
              {{ t('dialog.assign.selectPermissions') }}
            </div>
            <Checkbox
              v-for="permission in ['Read', 'Write', 'Admin'] as const"
              :key="permission"
              v-model="value.permissions"
              :value="permission"
              type="checkbox"
              :label="t(`permissions.${permission}`)"
              :text="t(`permissionsDescription.${permission}`)"
            />
          </div>
        </Dialog>
      </Ephemeral>
    </Trigger>
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
