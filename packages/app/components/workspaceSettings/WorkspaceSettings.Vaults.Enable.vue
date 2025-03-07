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

async function enableVault() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:vault/enabled', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
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
    icon="i-carbon:checkmark"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace, vault })"
    :text="t('text', { workspace, vault })"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => enableVault()"
  />
</template>

<i18n lang="yaml">
en:
  title: Enable the **{workspace}/{vault}** vault?
  text: Enabling this vault will allow all flows within the **{workspace}** workspace to read and write secrets from this vault. Are you sure you want to proceed?
  confirm: Enable this vault
  cancel: Keep this vault
  success: The **{workspace}/{vault}** vault has been enabled.
</i18n>
