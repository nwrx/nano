<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

const props = defineProps<{
  workspace: string
  vault: string
}>()

const { t } = useI18n()
const client = useClient()
const data = ref<VaultObject>({} as VaultObject)
async function getVault() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults/:vault', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
    },
    onData: (vault) => {
      data.value = vault
    },
  })
}

onMounted(getVault)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <InputText
      :model-value="vault"
      :text-before="`${CONSTANTS.appHost}/${workspace}/vaults/`"
      disabled
    />
    <InputText
      v-if="data.type"
      :model-value="t(`type.${data.type}`)"
      :hint="t('form.type.hint')"
      :icon="getVaultTypeIcon(data.type)"
      disabled
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vault Details
  text: A vault is a secure place to store sensitive information, it belongs to a workspace and can only be accessed by users with the right permissions.
  form:
    type:
      hint: The vault type determines where the secrets are stored. This cannot be changed once the vault is created.
  type:
    local: Local
    hashicorp: HashiCorp
    aws: AWS Secrets Manager
    azure: Azure Key Vault
    gcp: Google Cloud Secrets Manager
</i18n>
