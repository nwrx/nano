<script setup lang="ts">
import type { VaultType } from '@nwrx/nano-api'
import FormCreateHashicorp from '~/components/vault/VaultFormCreate.Hashicorp.vue'
import FormCreateLocal from '~/components/vault/VaultFormCreate.Local.vue'
import FormCreate from '~/components/vault/VaultFormCreate.vue'

definePageMeta({
  name: 'WorkspaceSettingsVaultCreate',
  parent: 'WorkspaceSettingsVaults',
  path: '/:workspace/settings/vaults/new',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  icon: 'i-carbon:add',
  title: {
    en: 'Create a new vault',
    fr: 'Créer un nouveau coffre',
    de: 'Erstellen Sie einen neuen Tresor',
    es: 'Crear una nueva caja fuerte',
    zh: '创建新的保险库',
  },
  description: {
    en: 'Create a new vault for your workspace.',
    fr: 'Créez un nouveau coffre pour votre espace de travail.',
    de: 'Erstellen Sie einen neuen Tresor für Ihren Arbeitsbereich.',
    es: 'Cree una nueva caja fuerte para su espacio de trabajo.',
    zh: '为您的工作区创建新的保险库。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const type = ref<VaultType>('local')
const name = ref('')
</script>

<template>
  <AppPageContainer contained>
    <FormCreate
      v-model:type="type"
      v-model:name="name"
      :workspace="workspace"
    />
    <FormCreateLocal
      v-if="type === 'local'"
      :workspace="workspace"
      :name="name"
    />
    <FormCreateHashicorp
      v-else-if="type === 'hashicorp'"
      :workspace="workspace"
      :name="name"
    />
  </AppPageContainer>
</template>
