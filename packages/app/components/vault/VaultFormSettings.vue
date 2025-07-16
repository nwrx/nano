<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'

// --- Props.
const props = defineProps<{
  workspace: string
  vault: string
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const data = ref<VaultObject>({} as VaultObject)

// --- Methods.
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
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Name -->
    <InputText
      :model-value="vault"
      :text-before="`${CONSTANTS.appHost}/${workspace}/vaults/`"
      disabled
    />

    <!-- Description -->
    <InputText
      v-if="data.type"
      :model-value="getVaultTypeName(data.type)"
      :icon="getVaultTypeIcon(data.type)"
      :hint="t('typeHint')"
      disabled
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vault Details
  text: A vault is a secure place to store sensitive information, it belongs to a workspace and can only be accessed by users with the right permissions.
  typeHint: The vault type determines where the secrets are stored. This cannot be changed once the vault is created.
</i18n>
