<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

// --- Form data reactive state
const title = ref()
const description = ref('')

watch(() => props.pool, (pool) => {
  title.value = pool.title
  description.value = pool.description
}, { immediate: true })

// --- Handle form submission
async function handleSubmit() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/pools/:pool', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
      title: title.value,
      description: description.value,
    },
    onSuccess: () => {
      alerts.success(t('success.update'))
      emit('refresh')
    },
  })
}
</script>

<template>
  <AppPageForm
    v-if="pool"
    vertical
    :title="t('title')"
    :text="t('description')"
    :label="t('submit.label')"
    @submit="() => handleSubmit()">

    <!-- Name and Title -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-md w-full">
      <InputText
        class="md:col-span-2"
        :model-value="pool.name"
        :label="t('form.name.label')"
        :placeholder="t('form.name.placeholder')"
        :hint="t('form.name.hint')"
        :text-before="`${CONSTANTS.appHost}/${workspace}/pools/`"
        disabled
      />

      <!-- Title -->
      <InputText
        v-model="title"
        :label="t('form.title.label')"
        :placeholder="t('form.title.placeholder')"
        :hint="t('form.title.hint')"
      />
    </div>

    <!-- Description -->
    <InputText
      v-model="description"
      :label="t('form.description.label')"
      :placeholder="t('form.description.placeholder')"
      :hint="t('form.description.hint')"
      type="textarea"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: General Settings
  description: Configure basic pool information including name, title, and description. These settings help identify and organize your MCP server pools.
  success:
    update: Pool settings have been updated successfully
  submit:
    label: Save Changes
  form:
    name:
      label: Pool Name
      placeholder: production-pool
      hint: Unique identifier for the pool within the workspace
    title:
      label: Pool Title
      placeholder: Production MCP Pool
      hint: A human-readable title for the pool
    description:
      label: Description
      placeholder: Production MCP servers pool for high-availability workloads
      hint: A brief description of the pool's purpose and usage
fr:
  title: Paramètres généraux
  description: Configurez les informations de base du pool, y compris le nom, le titre et la description. Ces paramètres aident à identifier et organiser vos pools de serveurs MCP.
  success:
    update: Les paramètres du pool ont été mis à jour avec succès
  form:
    name:
      label: Nom du pool
      placeholder: pool-production
      hint: Identifiant unique pour le pool dans l'espace de travail
    title:
      label: Titre du pool
      placeholder: Pool MCP de Production
      hint: Un titre lisible par l'homme pour le pool
    description:
      label: Description
      placeholder: Pool de serveurs MCP de production pour les charges de travail haute disponibilité
      hint: Une brève description de l'objectif et de l'utilisation du pool
de:
  title: Allgemeine Einstellungen
  description: Konfigurieren Sie grundlegende Pool-Informationen einschließlich Name, Titel und Beschreibung. Diese Einstellungen helfen dabei, Ihre MCP-Server-Pools zu identifizieren und zu organisieren.
  success:
    update: Pool-Einstellungen wurden erfolgreich aktualisiert
  form:
    name:
      label: Pool-Name
      placeholder: produktions-pool
      hint: Eindeutiger Bezeichner für den Pool im Arbeitsbereich
    title:
      label: Pool-Titel
      placeholder: Produktions-MCP-Pool
      hint: Ein menschenlesbarer Titel für den Pool
    description:
      label: Beschreibung
      placeholder: Produktions-MCP-Server-Pool für hochverfügbare Arbeitslasten
      hint: Eine kurze Beschreibung des Zwecks und der Verwendung des Pools
es:
  title: Configuración General
  description: Configure la información básica del pool incluyendo nombre, título y descripción. Estas configuraciones ayudan a identificar y organizar sus pools de servidores MCP.
  success:
    update: La configuración del pool se ha actualizado exitosamente
  form:
    name:
      label: Nombre del Pool
      placeholder: pool-produccion
      hint: Identificador único para el pool dentro del espacio de trabajo
    title:
      label: Título del Pool
      placeholder: Pool MCP de Producción
      hint: Un título legible por humanos para el pool
    description:
      label: Descripción
      placeholder: Pool de servidores MCP de producción para cargas de trabajo de alta disponibilidad
      hint: Una breve descripción del propósito y uso del pool
zh:
  title: 常规设置
  description: 配置包括名称、标题和描述在内的基本池信息。这些设置有助于识别和组织您的 MCP 服务器池。
  success:
    update: 池设置已成功更新
  form:
    name:
      label: 池名称
      placeholder: 生产池
      hint: 工作区内池的唯一标识符
    title:
      label: 池标题
      placeholder: 生产 MCP 池
      hint: 池的可读标题
    description:
      label: 描述
      placeholder: 用于高可用性工作负载的生产 MCP 服务器池
      hint: 池的目的和用途的简要描述
</i18n>
