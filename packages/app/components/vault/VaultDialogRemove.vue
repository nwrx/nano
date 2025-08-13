<script setup lang="ts">
const props = defineProps<{
  workspace: string
  vault: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const confirm = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => { confirm.value = '' }, { immediate: true })

async function removeVault() {
  await client.requestAttempt('DELETE /workspaces/:workspace/vaults/:vault', {
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
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, name: vault })"
    :text="t('text', { workspace, name: vault })"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    :disabled="confirm !== vault"
    @confirm="() => removeVault()">
    <InputText
      v-model="confirm"
      :label="t('confirmLabel')"
      :placeholder="vault"
      :text-before="`${CONSTANTS.appHost}/${workspace}`"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove the **{workspace}/{vault}** vault?
  text: Removing this vault will permanently delete all secrets stored within it. This action cannot be undone. Are you sure you want to proceed?
  confirm: Remove this vault
  confirmLabel: Type the name of the vault to confirm
  cancel: Keep this vault
  success: The **{workspace}/{vault}** vault has been removed.
</i18n>
