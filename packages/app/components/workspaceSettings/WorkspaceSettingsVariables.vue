<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
}>()

const { t } = useI18n()
const client = useClient()
const variables = ref<VaultVariableObject[]>([])
const showCreateDialog = ref(false)

// Fetch variables for the selected vault
async function getVariables() {
  await client.requestAttempt('GET /api/workspaces/:workspace/variables', {
    data: {
      workspace: props.workspace,
      withVault: true,
    },
    onData: (data) => {
      variables.value = data
    },
  })
}

onMounted(getVariables)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('text')">
    <Table :rows="variables" :columns="['name', 'createdAt', 'actions']">
      <template #header="name">
        {{ t(`header.${name}`) }}
      </template>

      <!-- Name -->
      <template #cell.name="variable">
        <VariableCard :variable="variable" />
      </template>

      <!-- Created At -->
      <template #cell.createdAt="{ createdAt }">
        <TableCellDate :created-at="createdAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="variable">
        <WorkspaceSettingsVariablesActions
          :workspace="workspace"
          :variable="variable.name"
          :vault="variable.vault!.name"
        />
      </template>
    </Table>

    <!-- Add variable button -->
    <Hyperlink
      eager
      class="text-sm"
      icon="i-carbon:add"
      :label="t('actions.create')"
      @click="() => showCreateDialog = true"
    />

    <!-- Create variable dialog -->
    <WorkspaceSettingsVariablesDialogCreate
      v-model="showCreateDialog"
      :workspace="workspace"
      @submit="() => getVariables()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Variables
  text: View and manage your workspace variables. Variables are used to store and manage secrets that are used in your flows. Allowing you to securely share and manage your secrets across your workspace.
  header:
    name: Variable Name
    createdAt: ''
    actions: ''
  actions:
    create: Create a new variable for this workspace
  type:
    variable: Variable
    createdAt: Created At
    actions: Actions
</i18n>
