<script setup lang="ts">
import type { VaultHashicorpOptions, VaultLocalOptions } from '@nwrx/nano-api'

definePageMeta({
  name: 'WorkspaceSettingsVaultNew',
  path: '/:workspace/settings/vaults/new',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  icon: 'i-carbon:add',
  title: {
    en: 'New Vault',
    fr: 'Nouveau coffre',
    de: 'Neuer Tresor',
    es: 'Nueva caja fuerte',
    zh: '新保险库',
  },
  description: {
    en: 'Create a new vault for your workspace.',
    fr: 'Créez un nouveau coffre pour votre espace de travail.',
    de: 'Erstellen Sie einen neuen Tresor für Ihren Arbeitsbereich.',
    es: 'Cree una nueva caja fuerte para su espacio de trabajo.',
    zh: '为您的工作区创建新的保险库。',
  },
})

const { t } = useI18n()
const route = useRoute()
const routes = useRouteLocation()
const router = useRouter()
const workspace = computed(() => route.params.workspace as string)

const client = useClient()
const alerts = useAlerts()
async function createVault(options: VaultCreateOptions) {
  await client.requestAttempt('POST /api/workspaces/:workspace/vaults', {
    data: { workspace: unref(workspace), ...options },
    onSuccess: async() => {
      alerts.success(t('vaults.create.success'))
      const redirect = routes.getWorkspaceSettingsVaults(unref(workspace))
      await router.push(redirect)
    },
  })
}

const type = ref('local')
const name = ref('')
</script>

<template>
  <AppPageContainer contained>

    <!-- Tabs -->
    <AppPageForm title="Create a New Vault" text="Choose the type of vault you want to create.">
      <InputList
        v-model="type"
        label="Type"
        type="radio"
        :options="[
          {
            key: 'local',
            value: 'Local',
            icon: 'i-carbon:cloud',
            text: 'A local vault stored on the server.',
          },
          {
            key: 'hashicorp',
            value: 'HashiCorp',
            icon: 'i-simple-icons:hashicorp',
            text: 'A connection to an existing HashiCorp Vault server.',
          },
          {
            key: 'aws',
            value: 'AWS Secrets Manager',
            icon: 'i-simple-icons:aws',
            text: 'A connection to an existing AWS Secrets Manager.',
            disabled: true,
          },
          {
            key: 'gcp',
            value: 'Google Secret Manager',
            icon: 'i-simple-icons:googlecloud',
            text: 'A connection to an existing Google Secret Manager.',
            disabled: true,
          },
          {
            key: 'azure',
            value: 'Azure Key Vault',
            icon: 'i-simple-icons:microsoftazure',
            text: 'A connection to an existing Azure Key Vault.',
            disabled: true,
          },
        ]"
        :option-value="(option) => option.key"
        :option-label="(option) => option.value"
        :option-icon="(option) => option.icon"
        :option-text="(value) => value.text"
        :option-filter="(search, option) => option.value.toLowerCase().includes(search.toLowerCase())"
      />
      <InputText
        v-model="name"
        :text-before="`${CONSTANTS.appHost}/${workspace}/vaults/`"
        hint="The name of the vault will determine its URL."
      />
    </AppPageForm>

    <!-- Local -->
    <template v-if="type === 'local'">
      <Ephemeral
        v-slot="{ value: configuration }"
        :initial-value="{ algorithm: 'aes-256-gcm', secret: '' } as VaultLocalOptions">
        <AppPageForm
          title="Local Vault"
          text="Create a new local vault."
          label="Create a new local vault"
          @submit="() => createVault({ name, type: 'local', configuration })">
          <InputList
            v-model="configuration.algorithm"
            label="Encryption Algorithm"
            type="radio"
            :options="[
              { key: 'aes-256-gcm', value: 'AES-256-GCM (Recommended)' },
              { key: 'aes-192-gcm', value: 'AES-192-GCM' },
              { key: 'aes-128-gcm', value: 'AES-128-GCM' },
            ]"
            :option-value="(value) => value.key"
            :option-label="(value) => value.value"
          />
          <InputText
            v-model="configuration.secret"
            label="Secret Key"
            hint="The secret key used to encrypt and decrypt the vault data."
            type="password"
          />
        </AppPageForm>
      </Ephemeral>
    </template>

    <!-- HashiCorp -->
    <template v-if="type === 'hashicorp'">
      <Ephemeral v-slot="{ value: configuration }" :initial-value="{} as VaultHashicorpOptions">
        <AppPageForm
          title="HashiCorp Vault"
          text="Connect to an existing HashiCorp Vault."
          label="Create a new HashiCorp Vault"
          @submit="() => createVault({ name, type: 'hashicorp', configuration })">
          <div class="grid md:cols-2 w-full items-start gap-md md:gap-lg">
            <InputText
              v-model="configuration.endpoint"
              label="Vault Endpoint"
              hint="The address of the HashiCorp Vault server."
              placeholder="https://vault.example.com"
            />
            <InputText
              v-model="configuration.token"
              label="Vault Token"
              placeholder="SUPER_SECRET_TOKEN"
              hint="The token to authenticate with the HashiCorp Vault server."
              type="password"
            />
            <InputText
              v-model="configuration.namespace"
              placeholder="default"
              label="Namespace (Optional)"
              hint="The namespace to use when connecting to the HashiCorp Vault server."
            />
            <InputText
              v-model="configuration.path"
              placeholder="/secret"
              label="Path (Optional)"
              hint="The path to the secrets engine in the HashiCorp Vault server."
            />
          </div>
        </AppPageForm>
      </Ephemeral>
    </template>
  </AppPageContainer>
</template>
