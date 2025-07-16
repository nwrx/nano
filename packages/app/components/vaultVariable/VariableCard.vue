<script setup lang="ts">
import type { VaultVariableObject } from '@nwrx/nano-api'
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<{
  variable?: string | VaultVariableObject
  vault?: string
  inline?: boolean
}>()

const name = computed(() => {
  if (!props.variable) return ''
  if (typeof props.variable === 'string') return props.variable
  return props.variable.name
})

const vaultName = computed(() => {
  if (typeof props.vault === 'string') return props.vault
  if (typeof props.variable === 'string') return ''
  if (!props.variable?.vault) return ''
  return props.variable.vault.name
})
</script>

<template>
  <div
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-4 bg-subtle': !inline,
    }">

    <!-- Icon -->
    <BaseIcon
      icon="i-carbon:password"
      class="size-4"
    />

    <!-- Name & Vault -->
    <div class="flex flex-col items-start">
      <span
        class="text-sm font-medium text-app font-mono"
        v-text="name"
      />

      <!-- Vault name -->
      <span
        v-if="vaultName"
        class="text-xs text-subtle"
        v-text="vaultName"
      />
    </div>
  </div>
</template>
