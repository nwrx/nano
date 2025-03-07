<script setup lang="ts">
import type { VaultType } from '@nwrx/nano-api'

const props = defineProps<{
  type: VaultType
  name: string
  workspace: string
}>()

const { t } = useI18n()
const type = useVModel(props, 'type')
const name = useVModel(props, 'name')
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <InputList
      v-model="type"
      type="radio"
      :hint="t('type.hint')"
      :options="[
        {
          value: 'local',
          icon: 'i-carbon:cloud',
        },
        {
          value: 'hashicorp',
          icon: 'i-simple-icons:hashicorp',
        },
        {
          value: 'aws',
          icon: 'i-simple-icons:awssecretsmanager',
          disabled: true,
        },
        {
          value: 'gcp',
          icon: 'i-simple-icons:googlecloud',
          disabled: true,
        },
        {
          value: 'azure',
          icon: 'i-simple-icons:microsoftazure',
          disabled: true,
        },
      ]"
      :option-value="(option) => option.value"
      :option-icon="(option) => option.icon"
      :option-label="(option) => t(`type.options.${option.value}.label`)"
      :option-text="(option) => t(`type.options.${option.value}.text`)"
      :option-filter="(search, option) => option.value.toLowerCase().includes(search.toLowerCase())"
    />
    <InputText
      v-model="name"
      :text-before="`${CONSTANTS.appHost}/${workspace}/vaults/`"
      hint="The name of the vault will determine its URL."
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Vault Type
  text: Create a new vault to securely store and manage your sensitive data. Vaults provide encrypted storage with fine-grained access control, allowing your team to safely share credentials, API keys, and other secrets while maintaining compliance and reducing security risks.
  type:
    hint: The type of vault you choose will determine where your data is stored and how it is managed.
    options:
      local:
        label: Local Vault
        text: Create a new local vault.
      hashicorp:
        label: HashiCorp Vault
        text: Create a new HashiCorp Vault.
      aws:
        label: AWS Secrets Manager
        text: Create a new AWS Secrets Manager Vault.
      gcp:
        label: Google Cloud Secrets Manager
        text: Create a new Google Cloud Secrets Manager Vault.
      azure:
        label: Azure Key Vault
        text: Create a new Azure Key Vault.
</i18n>
