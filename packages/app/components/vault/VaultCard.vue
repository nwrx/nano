<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'

const props = defineProps<{
  vault: VaultObject
}>()

const { t } = useI18n()
const icon = computed(() => {
  if (!props.vault) return 'i-carbon:locked'
  if (props.vault.type === 'local') return 'i-carbon:locked'
  if (props.vault.type === 'hashicorp') return 'i-carbon:password'
  if (props.vault.type === 'aws') return 'i-carbon:cloud'
  if (props.vault.type === 'azure') return 'i-carbon:cloud'
  if (props.vault.type === 'gcp') return 'i-carbon:cloud'
})
</script>

<template>
  <div v-if="vault" class="flex space-x-sm items-center">
    <Badge
      class="badge-success"
      :icon="icon"
      :label="t(`type.${vault.type}`)"
    />
    <Hyperlink
      class="text-sm font-bold text-app"
      :label="vault.name"
      :to="{ name: 'WorkspaceSettingsVault', params: { name: vault.name } }"
    />
    <!-- Is Default -->
    <BaseIcon
      v-if="vault.isDefault"
      class="icon-sm"
      icon="i-carbon:star"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  type:
    local: Local
    hashicorp: HashiCorp
    aws: AWS
    azure: Azure
    gcp: GCP
</i18n>
