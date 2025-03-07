<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  project: string
}>()

// --- Route.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const data = ref<ProjectObject>({} as ProjectObject)
async function getProject() {
  await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project', {
    data: {
      workspace: props.workspace,
      project: props.project,
    },
    onData: (project) => {
      data.value = project
    },
  })
}

async function updateProject() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
    data: {
      workspace: props.workspace,
      project: props.project,
      ...data.value,
    },
    onSuccess: () => {
      alerts.success(t('general.alert.success'))
    },
  })
}

onMounted(getProject)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('form.submit')"
    @submit="() => updateProject()">
    <InputText
      disabled
      :model-value="data.name"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :hint="t('form.name.hint')"
    />
    <InputText
      v-model="data.title"
      icon="i-carbon:label"
      :label="t('form.title.label')"
      :placeholder="t('form.title.placeholder')"
    />
    <InputText
      v-model="data.description"
      :placeholder="t('form.description.placeholder')"
      type="textarea"
      class-input="!h-32"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: General
  description: Update your project settings, manage integrations, and configure your project to meet your team's needs.
  form:
    submit: Save changes
    success: Project **{workspace}/{project}** settings have been updated.
    name:
      hint: The project name is part of your project's URL and cannot be changed here.
    title:
      label: Display name
      placeholder: Enter your project title
    description:
      placeholder: Provide a brief description of your project (optional).
</i18n>
