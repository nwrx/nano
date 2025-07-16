<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  vault: string
}>()

const { t } = useI18n()
const client = useClient()
const projects = ref<Array<{ project: string; permissions: VaultPermission[] }>>([])
const showAssignDialog = ref(false)

async function getProjectAssignments() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults/:vault/projects', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
    },
    onData: (data) => {
      projects.value = Object.entries(data).map(([project, permissions]) => ({
        project,
        permissions,
      }))
    },
  })
}

onMounted(getProjectAssignments)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <Table :columns="['project', 'permissions', 'actions']" :rows="projects">

      <!-- Header -->
      <template #header="header">
        {{ t(`header.${header}`) }}
      </template>

      <!-- Cell / Project -->
      <template #cell.project="{ project }">
        <ProjectCard :workspace :project load />
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
      <template #cell.actions="project">
        <WorkspaceSettingsVaultProjectAssignmentsActions
          :workspace="workspace"
          :vault="vault"
          :project="project.project"
          :permissions="project.permissions"
          @submit="() => getProjectAssignments()"
        />
      </template>
    </Table>

    <!-- Add project CTA -->
    <Hyperlink
      eager
      class="text-sm"
      icon="i-carbon:add"
      :label="t('actions.assign')"
      @click="() => showAssignDialog = true"
    />

    <!-- Assign dialog -->
    <WorkspaceSettingsVaultProjectAssignmentsDialogAssign
      v-model="showAssignDialog"
      :workspace="workspace"
      :vault="vault"
      @submit="() => getProjectAssignments()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Project Access Management
  text: Control which projects can access this vault and set appropriate permission levels for each one. Managing project-vault access ensures your secrets are only available to authorized projects.
  header:
    project: Project
    permissions: Permissions
    actions: ''
  permissions:
    Use: Use
    Read: Read
    Write: Write
    Owner: Owner
  actions:
    assign: Add a new project to this vault
</i18n>
