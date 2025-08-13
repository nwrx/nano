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
const isOpen = defineModel({ default: false })

async function setDefaultVault() {
  await client.requestAttempt('PUT /workspaces/:workspace/vaults/:vault/default', {
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
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:warning"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, vault })"
    :text="t('text', { workspace, vault })"
    :label-confirm="t('confirm')"
    :label-cancel="t('cancel')"
    @confirm="() => setDefaultVault()"
  />
</template>

<i18n lang="yaml">
en:
  title: Set the **{workspace}/{vault}** vault as the default vault?
  text: Setting this vault as default will allow all flows within the **{workspace}** workspace to read and write secrets from this vault. This can ease the management of secrets across your workspace but can also lead to security risks if not managed properly. Use this feature with caution.
  confirm: Set this vault as default
  cancel: Keep current default
  success: The **{workspace}/{name}** vault has been set as the default vault.
</i18n>
