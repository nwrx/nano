<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function disableVault() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:vault/disable', {
    data: {
      workspace: props.workspace,
      name: props.vault,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { workspace: props.workspace, vault: props.vault }))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:close"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, vault })"
    :text="t('text', { workspace, vault })"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => disableVault()"
  />
</template>

<i18n lang="yaml">
en:
  title: Disable the **{workspace}/{vault}** vault?
  text: Disabling this vault will prevent all flows within the **{workspace}** workspace from reading and writing secrets from this vault. Are you sure you want to proceed?
  confirm: Disable this vault
  cancel: Keep this vault
  success: The **{workspace}/{vault}** vault has been disabled.
</i18n>
