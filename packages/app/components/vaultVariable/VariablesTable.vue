<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import TableCellDate from '~/components/base/Table.CellDate.vue'
import Table from '~/components/base/Table.vue'
import VariableCard from './VariableCard.vue'
import VariablesActions from './VariablesActions.vue'
import DialogCreate from './VariablesDialogCreate.vue'

const props = defineProps<{
  workspace: string
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const variables = ref<VaultVariableObject[]>([])
const showCreateDialog = ref(false)

// --- Methods.
async function getVariables() {
  await client.requestAttempt(
    'GET /api/workspaces/:workspace/variables',
    {
      parameters: {
        workspace: props.workspace,
      },
      query: {
        withVault: true,
      },
      onData: (data) => {
        variables.value = data
      },
    },
  )
}

onMounted(getVariables)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <Table :rows="variables" :columns="['name', 'createdAt', 'actions']">
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
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
        <VariablesActions
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
      :label="t('actionsCreate')"
      @click="() => showCreateDialog = true"
    />

    <!-- Create variable dialog -->
    <DialogCreate
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
  headerName: Name
  headerCreatedAt: Created
  headerActions: Actions
  actionsCreate: Add Variable
fr:
  title: Variables
  text: Consultez et gérez les variables de votre espace de travail. Les variables sont utilisées pour stocker et gérer les secrets utilisés dans vos flux. Vous permettant de partager et gérer en toute sécurité vos secrets dans votre espace de travail.
  headerName: Nom
  headerCreatedAt: Créé
  headerActions: Actions
  actionsCreate: Ajouter une variable
de:
  title: Variablen
  text: Betrachten und verwalten Sie Ihre Arbeitsbereich-Variablen. Variablen werden verwendet, um Geheimnisse zu speichern und zu verwalten, die in Ihren Workflows verwendet werden. Ermöglicht es Ihnen, Ihre Geheimnisse sicher in Ihrem Arbeitsbereich zu teilen und zu verwalten.
  headerName: Name
  headerCreatedAt: Erstellt
  headerActions: Aktionen
  actionsCreate: Variable hinzufügen
es:
  title: Variables
  text: Ve y gestiona las variables de tu espacio de trabajo. Las variables se utilizan para almacenar y gestionar secretos que se usan en tus flujos. Te permite compartir y gestionar de forma segura tus secretos en tu espacio de trabajo.
  headerName: Nombre
  headerCreatedAt: Creado
  headerActions: Acciones
  actionsCreate: Agregar Variable
zh:
  title: 变量
  text: 查看和管理您的工作空间变量。变量用于存储和管理在您的流程中使用的机密。允许您在工作空间中安全地共享和管理您的机密。
  headerName: 名称
  headerCreatedAt: 创建时间
  headerActions: 操作
  actionsCreate: 添加变量
</i18n>
