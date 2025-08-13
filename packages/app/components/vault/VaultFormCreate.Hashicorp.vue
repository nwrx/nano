<script setup lang="ts">
import type { VaultHashicorpOptions } from '@nwrx/nano-api'

defineProps<{ workspace: string; name: string }>()

const { t } = useI18n()
const router = useRouter()
const client = useClient()
const alerts = useAlerts()

const configuration = ref<VaultHashicorpOptions>({
  endpoint: '',
  token: '',
  namespace: '',
  path: '',
})
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')"
    :label="t('label')"
    @submit="() => {
      client.requestAttempt('POST /workspaces/:workspace/vaults', {
        data: { workspace, name, type: 'hashicorp', configuration: unref(configuration) },
        onSuccess: async() => {
          alerts.success(t('vaults.create.success'))
          await router.push({ name: 'WorkspaceSettingsVaults', params: { workspace } })
        },
      })
    }">
    <div class="grid md:cols-2 w-full items-start gap-md md:gap-lg">
      <InputText
        v-model="configuration.endpoint"
        :label="t('endpoint.label')"
        :hint="t('endpoint.hint')"
        :placeholder="t('endpoint.placeholder')"
      />
      <InputText
        v-model="configuration.token"
        :label="t('token.label')"
        :placeholder="t('token.placeholder')"
        :hint="t('token.hint')"
        type="password"
      />
      <InputText
        v-model="configuration.namespace"
        :placeholder="t('namespace.placeholder')"
        :label="t('namespace.label')"
        :hint="t('namespace.hint')"
      />
      <InputText
        v-model="configuration.path"
        :placeholder="t('path.placeholder')"
        :label="t('path.label')"
        :hint="t('path.hint')"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: HashiCorp Vault
  text: Connect to an existing HashiCorp Vault instance to securely manage and store secrets. HashiCorp Vault provides centralized secret management with robust access control and encryption.
  label: Connect
  endpoint:
    label: Vault Endpoint
    hint: The address of the HashiCorp Vault server.
    placeholder: https://vault.example.com
  token:
    label: Vault Token
    placeholder: SUPER_SECRET_TOKEN
    hint: The token to authenticate with the HashiCorp Vault server.
  namespace:
    label: Namespace (Optional)
    placeholder: default
    hint: The namespace to use when connecting to the HashiCorp Vault server.
  path:
    label: Path (Optional)
    placeholder: /secret
    hint: The path to the secrets engine in the HashiCorp Vault server.
</i18n>
