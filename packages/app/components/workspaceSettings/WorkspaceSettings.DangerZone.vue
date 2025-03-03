<script setup lang="ts">
const props = defineProps<{ name: string }>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const router = useRouter()
</script>

<template>
  <Trigger v-slot="dialogs" :keys="['rename', 'archive']">
    <AppPageForm :title="t('title')" :text="t('text')">
      <AppPageFormActions class="border-danger">
        <AppPageFormAction
          class="border-danger"
          class-button="button-danger"
          icon="i-carbon:archive"
          :title="t('archive.actionTitle')"
          :text="t('archive.actionText')"
          :label="t('archive.actionLabel')"
          @click="() => dialogs.open('archive')"
        />
        <AppPageFormAction
          class="border-danger"
          class-button="button-danger"
          icon="i-carbon:edit"
          :title="t('rename.actionTitle')"
          :text="t('rename.actionText')"
          :label="t('rename.actionLabel')"
          @click="() => dialogs.open('rename')"
        />
      </AppPageFormActions>
    </AppPageForm>

    <!-- Rename workspace dialog -->
    <Ephemeral v-slot="{ value, reset }" :initial-value="{ name }">
      <Dialog
        v-model="dialogs.value.rename"
        icon="i-carbon:label"
        class-hint="hint-warning"
        class-button="button-warning"
        :title="t('rename.dialogTitle', { name })"
        :text="t('rename.dialogText', { name })"
        :label-cancel="t('rename.dialogCancel')"
        :label-confirm="t('rename.dialogConfirm')"
        :disabled="value.name === name"
        @open="() => reset()"
        @confirm="() => {
          client.request('PUT /api/workspaces/:workspace', {
            data: { workspace: props.name, name: value.name },
            onSuccess: () => {
              alerts.success(t('rename.success', { name: value.name }))
              router.push({
                name: 'WorkspaceSettings',
                params: { workspace: value.name },
              })
            },
          })
        }">
        <InputText
          v-model="value.name"
          class="mt-2"
          :text-before="`${CONSTANTS.appHost}/`"
          :hint="t('rename.dialogLabel')"
        />
      </Dialog>
    </Ephemeral>

    <!-- Archive workspace dialog -->
    <Ephemeral v-slot="{ value, reset }" :initial-value="{ name: '' }">
      <Dialog
        v-model="dialogs.value.archive"
        icon="i-carbon:archive"
        class-hint="hint-warning"
        class-button="button-warning"
        :title="t('archive.dialogTitle', { name })"
        :text="t('archive.dialogText', { name })"
        :label-cancel="t('archive.dialogCancel')"
        :label-confirm="t('archive.dialogConfirm')"
        :disabled="value.name !== name"
        @open="() => reset()"
        @confirm="() => {
          client.request('DELETE /api/workspaces/:workspace', {
            data: { workspace: props.name },
            onSuccess: () => {
              alerts.success(t('archive.success', { name }))
              router.push({
                name: 'Workspaces',
              })
            },
          })
        }">
        <InputText
          v-model="value.name"
          :label="t('archive.dialogLabel')"
          :placeholder="name"
        />
      </Dialog>
    </Ephemeral>
  </Trigger>
</template>

<i18n lang="yaml">
en:
  title: Danger zone
  text: Be careful with these actions. They are irreversible.
  rename:
    actionTitle: Rename workspace
    actionText: Change the name of your workspace.
    actionLabel: Rename
    dialogTitle: Rename workspace
    dialogText: Change the name of your workspace.
    dialogLabel: Define the new workspace name
    dialogCancel: Cancel
    dialogConfirm: Rename
    success: Workspace renamed to "{name}".
  archive:
    actionTitle: Archive workspace
    actionText: Move your workspace to the archive.
    actionLabel: Archive
    dialogTitle: Archive workspace
    dialogText: Move your workspace to the archive.
    dialogLabel: Type the workspace name to confirm
    dialogCancel: Cancel
    dialogConfirm: Archive
    success: Workspace "{name}" archived.
</i18n>
