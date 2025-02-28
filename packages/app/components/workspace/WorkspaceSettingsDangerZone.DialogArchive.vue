<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
</script>

<template>
  <AppDialog
    v-model="model"
    icon="i-carbon:archive"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('button.cancel')"
    :label-confirm="t('button.confirm')"
    :disabled="confirm !== workspace"
    @confirm="() => emit('submit')">

    <InputText
      v-model="confirm"
      :label="t('input.name.label')"
      :placeholder="workspace"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Archive the **{workspace}** workspace
  text: You are about to archive this workspace. The workspace will become read-only but can be restored later. All existing integrations will still work but no new changes can be made.
  input.name.label: Type the workspace name to confirm
  button.confirm: I understand, archive the workspace
  button.cancel: Keep workspace active
fr:
  title: Archiver l'espace **{workspace}**
  text: Vous êtes sur le point d'archiver cet espace. L'espace deviendra en lecture seule mais pourra être restauré ultérieurement. Toutes les intégrations existantes continueront de fonctionner mais aucune nouvelle modification ne pourra être effectuée.
  input.name.label: Tapez le nom de l'espace pour confirmer
  button.confirm: Je comprends, archiver l'espace
  button.cancel: Garder l'espace actif
</i18n>
