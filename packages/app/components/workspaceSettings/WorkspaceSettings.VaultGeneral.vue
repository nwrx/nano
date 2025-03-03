<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

const props = defineProps<{ workspace: string; name: string }>()

const { t } = useI18n()
const client = useClient()
const vault = ref<VaultObject>({} as VaultObject)
async function getVault() {
  await client.requestAttempt('GET /api/workspaces/:workspace/vaults/:name', {
    data: { workspace: props.workspace, name: props.name },
    onData: data => vault.value = data,
  })
}

onMounted(getVault)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <InputText
      :model-value="vault.name"
      :text-before="`${CONSTANTS.appHost}/${workspace}/vaults/`"
      :label="t('fields.name')"
      disabled
    />
    <InputText
      :model-value="t(`type.${vault.type}`)"
      :label="t('fields.type')"
      disabled
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Details
  text: Vault name and type cannot be changed. If you need to change the name or type, create a new vault and move the data.
  fields:
    name: Name of the vault
    type: Type of the vault
  type:
    local: Local
    hashicorp: HashiCorp
    aws: AWS Secrets Manager
    azure: Azure Key Vault
    gcp: Google Cloud Secrets Manager
</i18n>
