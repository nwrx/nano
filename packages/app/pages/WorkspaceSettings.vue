<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettings',
  path: '/:workspace/settings',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Settings',
    fr: 'Paramètres',
    de: 'Einstellungen',
    es: 'Configuración',
    zh: '工作区设置',
  },
  description: {
    en: 'Manage your workspace settings and configurations.',
    fr: 'Gérez les paramètres et configurations de votre espace.',
    de: 'Verwalten Sie Ihre Arbeitsbereich-Einstellungen und Konfigurationen.',
    es: 'Administre la configuración de su espacio de trabajo.',
    zh: '管理您的工作区设置和配置。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const url = computed(() => `${CONSTANTS.appHost}/`)

// --- Data and actions.
const { data, getWorkspace, rename, archive } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- General Settings -->
    <AppPageForm
      :title="t('general.title')"
      :text="t('general.text')">
      <InputText
        disabled
        :model-value="workspace"
        :text-before="url"
        :hint="t('general.name.hint')"
      />
    </AppPageForm>

    <!-- Danger Zone -->
    <Trigger v-slot="trigger" :keys="['rename', 'archive']">
      <AppPageForm :title="t('dangerZone.title')" :text="t('dangerZone.text')">
        <AppPageFormActions class="border-danger">
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:archive"
            :title="t('dangerZone.archive.title')"
            :text="t('dangerZone.archive.text')"
            :label="t('dangerZone.archive.label')"
            @click="() => trigger.open('archive')"
          />
          <AppPageFormAction
            class="border-danger"
            class-button="button-danger"
            icon="i-carbon:edit"
            :title="t('dangerZone.rename.title')"
            :text="t('dangerZone.rename.text')"
            :label="t('dangerZone.rename.label')"
            @click="() => trigger.open('rename')"
          />
        </AppPageFormActions>
      </AppPageForm>

      <!-- Rename workspace dialog -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.rename"
          icon="i-carbon:label"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('rename.title', { workspace })"
          :text="t('rename.text', { workspace })"
          :label-cancel="t('rename.cancel')"
          :label-confirm="t('rename.confirm')"
          @open="() => value.name = data.name || ''"
          @confirm="() => rename(value.name)">
          <InputText
            v-model="value.name"
            class="mt-2"
            :text-before="`${CONSTANTS.appHost}/`"
            :placeholder="t('rename.label')"
          />
        </Dialog>
      </Ephemeral>

      <!-- Archive workspace dialog -->
      <Ephemeral v-slot="{ value }" :initial-value="{ name: '' }">
        <Dialog
          v-model="trigger.value.archive"
          icon="i-carbon:archive"
          class-hint="hint-warning"
          class-button="button-warning"
          :title="t('archive.title', { workspace })"
          :text="t('archive.text', { workspace })"
          :label-cancel="t('archive.cancel')"
          :label-confirm="t('archive.confirm')"
          :disabled="value.name !== workspace"
          @open="() => value.name = ''"
          @confirm="() => archive()">
          <InputText
            v-model="value.name"
            :label="t('archive.label')"
            :placeholder="workspace"
          />
        </Dialog>
      </Ephemeral>
    </Trigger>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  general:
    title: Workspace settings
    text: Manage your workspace settings and configurations.
    name:
      hint: The workspace name is part of your workspace's URL and cannot be changed here.
  dangerZone:
    title: Danger zone
    text: Proceed with caution. Actions here can permanently affect your workspace and its integrations.
    rename:
      title: Rename workspace
      text: Renaming your workspace will update its URL. Existing integrations and bookmarks may break. Proceed carefully.
      label: Rename
    archive:
      title: Archive workspace
      text: Archiving makes your workspace read-only and hides it from active workspaces. All existing integrations will still work.
      label: Archive
  rename:
    title: Rename workspace **{workspace}**
    text: Renaming your workspace will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
    cancel: Cancel
    confirm: Rename
    label: Enter new workspace name
  archive:
    title: Archive workspace **{workspace}**
    text: The workspace will become read-only and will be hidden from active workspaces. All existing integrations will continue to work, but no new changes can be made.
    cancel: Cancel
    confirm: Archive
    label: Type the workspace name to confirm
</i18n>
