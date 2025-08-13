<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  vault: string
}>()

const { t } = useI18n()
const client = useClient()
const assignments = ref<Array<{ username: string; permissions: VaultPermission[] }>>([])
const showAssignDialog = ref(false)

async function getAssignments() {
  await client.requestAttempt('GET /workspaces/:workspace/vaults/:vault/assignments', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
    },
    onData: (data) => {
      assignments.value = Object.entries(data).map(([username, permissions]) => ({
        username,
        permissions,
      }))
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
        {{ t(`header.${header}`) }}
      </template>

      <!-- Cell / User -->
      <template #cell.user="{ username }">
        <UserCard :username load />
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
        <WorkspaceSettingsVaultAssignmentsActions
          :workspace="workspace"
          :vault="vault"
          :username="assignment.username"
          :permissions="assignment.permissions"
          @submit="() => getAssignments()"
        />
      </template>
    </Table>

    <!-- Add user CTA -->
    <Hyperlink
      eager
      class="text-sm"
      icon="i-carbon:add"
      :label="t('actions.assign')"
      @click="() => showAssignDialog = true"
    />

    <!-- Assign dialog -->
    <WorkspaceSettingsVaultAssignmentsDialogAssign
      v-model="showAssignDialog"
      :workspace="workspace"
      :vault="vault"
      @submit="() => getAssignments()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vault Access Management
  text: Control who can access this vault and set appropriate permission levels for each user. Properly managing permissions ensures data security while enabling effective team collaboration.
  header:
    user: User
    permissions: Permissions
    actions: ''
  permissions:
    Use: Use
    Read: Read
    Write: Write
    Owner: Owner
  actions:
    assign: Assign a new user to this vault
</i18n>
