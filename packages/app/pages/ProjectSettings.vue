<script setup lang="ts">
import type { ProjectObject } from '@nwrx/nano-api'

definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:project/settings',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
  group: 'project-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Settings',
    fr: 'Paramètres du projet',
    de: 'Projekteinstellungen',
    es: 'Configuración del proyecto',
    zh: '项目设置',
  },
  description: {
    en: 'Update your project settings, manage integrations, and configure your project to meet your team\'s needs.',
    fr: 'Mettez à jour les paramètres de votre projet, gérez les intégrations et configurez votre projet pour répondre aux besoins de votre équipe.',
    de: 'Aktualisieren Sie Ihre Projekteinstellungen, verwalten Sie Integrationen und konfigurieren Sie Ihr Projekt, um den Anforderungen Ihres Teams gerecht zu werden.',
    es: 'Actualice la configuración de su proyecto, administre las integraciones y configure su proyecto para satisfacer las necesidades de su equipo.',
    zh: '更新您的项目设置，管理集成，并配置您的项目以满足团队的需求。',
  },
})

// --- Route.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const name = computed(() => route.params.project as string)

// --- Model
const alerts = useAlerts()
const router = useRouter()
const client = useClient()
const project = ref<ProjectObject>({} as ProjectObject)
async function getProject() {
  await client.requestAttempt('GET /api/workspaces/:workspace/projects/:project', {
    data: {
      workspace: unref(workspace),
      project: unref(name),
    },
    onData: (data) => {
      project.value = data
    },
  })
}

onMounted(getProject)
</script>

<template>
  <AppPageContainer contained>

    <!-- General Settings -->
    <AppPageForm
      :title="localize(route.meta.title)"
      :text="localize(route.meta.description)"
      :label="t('general.form.submit')"
      @submit="() => client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
        data: {
          workspace,
          project: unref(name),
          title: project.title,
          description: project.description,
        },
        onSuccess: async() => {
          alerts.success(t('general.form.success', { workspace, project: project.title }))
          getProject()
        },
      })">
      <InputText
        disabled
        :model-value="project.name"
        :text-before="`${CONSTANTS.appHost}/${workspace}/`"
        :hint="t('general.name.hint')"
      />
      <InputText
        v-model="project.title"
        icon="i-carbon:label"
        :label="t('general.title.label')"
        :placeholder="t('general.title.placeholder')"
      />
      <InputText
        v-model="project.description"
        :placeholder="t('general.description.placeholder')"
        type="textarea"
        class-input="!h-32"
      />
    </AppPageForm>

    <!-- Danger Zone -->
    <Trigger v-slot="trigger" :keys="['rename', 'transfer', 'delete']">
      <AppPageForm :title="t('dangerZone.title')" :text="t('dangerZone.text')">
        <AppPageFormActions class="border-danger">
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:edit"
            :title="t('dangerZone.rename.title')"
            :text="t('dangerZone.rename.text')"
            :label="t('dangerZone.rename.label')"
            @click="() => trigger.open('rename')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:status-change"
            :title="t('dangerZone.transfer.title')"
            :text="t('dangerZone.transfer.text')"
            :label="t('dangerZone.transfer.label')"
            @click="() => trigger.open('transfer')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:trash-can"
            :title="t('dangerZone.delete.title')"
            :text="t('dangerZone.delete.text')"
            :label="t('dangerZone.delete.label')"
            @click="() => trigger.open('delete')"
          />
        </AppPageFormActions>
      </AppPageForm>

      <!-- Rename project dialog - Simple Text input to rename the project -->
      <Ephemeral v-slot="{ value }" :initial-value="project">
        <Dialog
          v-model="trigger.value.rename"
          icon="i-carbon:label"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('rename.title', { workspace, project: project.name })"
          :text="t('rename.text', { workspace, project: project.name })"
          :label-cancel="t('rename.cancel')"
          :label-confirm="t('rename.confirm')"
          @open="() => value.name = project.name"
          @confirm="() => client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project', {
            data: {
              workspace,
              project: unref(name),
              title: value.title,
              description: value.description,
            },
            onSuccess: async() => {
              alerts.success(t('rename.success', { workspace, project: value.title }))
              await getProject()
            },
          })">
          <InputText
            v-model="value.name"
            class="mt-2"
            :text-before="`api.nwrx.io/${workspace}/`"
            :placeholder="t('rename.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Transfer project dialog - Search for a user to transfer the project to -->
      <Ephemeral v-slot="{ value, reset }" :initial-value="{ usernames: [] as string[] }">
        <Dialog
          v-model="trigger.value.transfer"
          icon="i-carbon:status-change"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('transfer.title', { workspace, project: project.name })"
          :text="t('transfer.text', { workspace, project: project.name })"
          :label-cancel="t('transfer.cancel')"
          :label-confirm="t('transfer.confirm')"
          @open="() => reset()"
          @confirm="() => console.log('Transfer project')">
          <UserSearch
            v-model="value.usernames"
            class="mt-2"
            :placeholder="t('transfer.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Delete project dialog - Confirm the deletion of the project by typing the {workspace}/{project} name -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.delete"
          icon="i-carbon:trash-can"
          class-hint="hint-danger"
          class-button="button-danger"
          :title="t('delete.title', { workspace, project: project.name })"
          :text="t('delete.text', { workspace, project: project.name })"
          :label-cancel="t('delete.cancel')"
          :label-confirm="t('delete.confirm')"
          :disabled="value.name !== project.name"
          @open="() => value.name = ''"
          @confirm="() => client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
            data: {
              workspace,
              project: unref(name),
            },
            onSuccess: async() => {
              alerts.success(t('delete.success', { workspace, project: project.name }))
              router.push(`/${workspace}`)
            },
          })">
          <InputText
            v-model="value.name"
            :text-before="`api.nwrx.io/${workspace}/`"
            :placeholder="t('delete.label')"
          />
        </Dialog>
      </Ephemeral>
    </Trigger>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  general:
    form:
      submit: Save changes
      success: Project **{workspace}/{project}** settings have been updated.
    title:
      label: Display name
      placeholder: Enter your project title
    name:
      hint: The project name is part of your project's URL and cannot be changed here.
    description:
      placeholder: Provide a brief description of your project (optional).
  dangerZone:
    title: Danger zone
    text: Proceed with caution. Actions here can permanently affect your project and its integrations.
    rename:
      title: Rename project
      text: Renaming your project will update its URL. Existing integrations and bookmarks may break. Proceed carefully.
      label: Rename
    transfer:
      title: Transfer ownership
      text: Transfer this project to another workspace or user. Ensure the new owner is aware of this change.
      label: Transfer
    delete:
      title: Permanently delete project
      text: This action is **irreversible**. All project project will be permanently lost.
      label: Delete
  rename:
    title: Rename project **{workspace}/{project}**
    text: Renaming your project will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
    cancel: Cancel
    confirm: Rename
    label: Enter new project name
    success: Project **{workspace}/{project}** has been renamed to **{workspace}/{project}**
  delete:
    title: Confirm deletion of **{workspace}/{project}**
    text: This action **cannot be undone**. To confirm deletion, please type the exact project path below.
    cancel: Cancel
    confirm: Delete
    label: Confirm deletion by typing the name of the project
    success: Project **{workspace}/{project}** has been deleted.
  transfer:
    title: Transfer project **{workspace}/{project}**
    text: Transferring ownership will move the project to another workspace. Ensure the new owner is prepared for this change.
    cancel: Cancel
    confirm: Transfer
    label: Search and select new owner
    success: Project **{workspace}/{project}** has been transferred to **{workspace}/{newWorkspace}**
</i18n>
