<script setup lang="ts">
import type { VaultLocalOptions } from '@nwrx/nano-api'

defineProps<{
  workspace: string
  name: string
}>()

const { t } = useI18n()
const router = useRouter()
const client = useClient()
const alerts = useAlerts()
const configuration = ref<VaultLocalOptions>({ algorithm: 'aes-256-gcm', secret: '' })
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')"
    :label="t('label')"
    @submit="() => {
      client.requestAttempt('POST /workspaces/:workspace/vaults', {
        data: { workspace, name, type: 'local', configuration: unref(configuration) },
        onSuccess: async() => {
          alerts.success(t('vaults.create.success'))
          await router.push({ name: 'WorkspaceSettingsVaults', params: { workspace } })
        },
      })
    }">
    <InputList
      v-model="configuration.algorithm"
      :label="t('algorithm.label')"
      type="radio"
      :options="[
        { key: 'aes-256-gcm', value: t('algorithm.options.aes256') },
        { key: 'aes-192-gcm', value: t('algorithm.options.aes192') },
        { key: 'aes-128-gcm', value: t('algorithm.options.aes128') },
      ]"
      :option-value="(value) => value.key"
      :option-label="(value) => value.value"
    />
    <InputText
      v-model="configuration.secret"
      :label="t('secret.label')"
      :hint="t('secret.hint')"
      type="password"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Local Vault
  text: Create a new local vault to securely store your sensitive data locally. Local vaults provide strong encryption while keeping your secrets within your infrastructure's boundaries.
  label: Create a new local vault
  algorithm:
    label: Encryption Algorithm
    options:
      aes256: AES-256-GCM (Recommended)
      aes192: AES-192-GCM
      aes128: AES-128-GCM
  secret:
    label: Secret Key
    hint: The secret key used to encrypt and decrypt the vault data.
</i18n>
