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
  title: Vault Settings
  text: Manage your vault configuration and view security details. Vaults provide encrypted storage for sensitive data within your workspace.
  typeHint: Vault type determines the underlying storage provider and cannot be modified after creation.
fr:
  title: Paramètres du coffre
  text: Gérez la configuration de votre coffre et consultez les détails de sécurité. Les coffres fournissent un stockage chiffré pour les données sensibles de votre espace de travail.
  typeHint: Le type de coffre détermine le fournisseur de stockage sous-jacent et ne peut pas être modifié après la création.
de:
  title: Tresor-Einstellungen
  text: Verwalten Sie Ihre Tresor-Konfiguration und zeigen Sie Sicherheitsdetails an. Tresore bieten verschlüsselte Speicherung für sensible Daten in Ihrem Arbeitsbereich.
  typeHint: Der Tresortyp bestimmt den zugrunde liegenden Speicheranbieter und kann nach der Erstellung nicht geändert werden.
es:
  title: Configuración de bóveda
  text: Administre la configuración de su bóveda y vea los detalles de seguridad. Las bóvedas proporcionan almacenamiento cifrado para datos sensibles dentro de su espacio de trabajo.
  typeHint: El tipo de bóveda determina el proveedor de almacenamiento subyacente y no se puede modificar después de la creación.
zh:
  title: 保险库设置
  text: 管理您的保险库配置并查看安全详细信息。保险库为工作空间内的敏感数据提供加密存储。
  typeHint: 保险库类型决定底层存储提供商，创建后无法修改。
</i18n>
