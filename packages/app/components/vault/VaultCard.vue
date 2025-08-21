<script setup lang="ts">
import type { VaultObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import { NuxtLink } from '#components'
import Badge from '~/components/base/Badge.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import { getVaultTypeIcon, getVaultTypeName } from '~/utils/getVaultType'

const props = defineProps<{
  vault: VaultObject
  isLink?: boolean
  inline?: boolean
}>()

const linkTo = computed(() => ({
  name: 'WorkspaceSettingsVault',
  params: { vault: props.vault.name },
}))
</script>

<template>
  <BaseButton
    v-if="vault"
    :as="isLink ? NuxtLink : 'div'"
    :to="isLink ? linkTo : undefined"
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-4 bg-subtle': !inline,
    }">

    <!-- Type icon -->
    <Badge
      class="badge-success"
      :icon="getVaultTypeIcon(vault.type)"
      :label="getVaultTypeName(vault.type)"
    />

    <!-- Name & Details -->
    <div class="flex flex-col items-start">
      <!-- If link -->
      <Hyperlink v-if="isLink">
        <span
          class="text-sm font-medium text-app"
          v-text="vault.name"
        />
      </Hyperlink>

      <!-- If not -->
      <span
        v-else
        class="text-sm font-medium text-app"
        v-text="vault.name"
      />
    </div>

    <!-- Disabled Status -->
    <BaseIcon
      v-if="vault.disabledAt"
      class="size-4 text-danger"
      icon="i-carbon:dot-mark"
      title="Vault is disabled"
    />
  </BaseButton>
</template>
