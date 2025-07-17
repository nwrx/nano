<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Actions from './McpServerFormArguments.Actions.vue'

const props = defineProps<{
  workspace: string
  pool: string
  server: string
  argument: McpServerArgumentObject
}>()

const { t } = useI18n()
const isVariable = computed(() => {
  if (!props.argument) return false
  return !!props.argument.variable
})
</script>

<template>
  <div class="flex items-center px-md py-sm gap-md">

    <!-- Icon -->
    <div class="b b-app bg-app rd p-2">
      <BaseIcon
        :icon="isVariable ? 'i-carbon:password' : 'i-carbon:code'"
        class="text-app"
      />
    </div>

    <!-- Variable -->
    <div v-if="argument && argument.variable">
      <p
        class="text-subtle text-xs"
        v-text="t('argumentVariable')"
      />
      <div class="flex items-center text-app font-mono gap-sm">
        <span
          class="text-subtle"
          v-text="argument.variable.vault?.name"
        />
        <BaseIcon icon="i-carbon:arrow-right" />
        <span
          class="text-app font-mono"
          v-text="argument.variable.name"
        />
      </div>
    </div>

    <!-- Value -->
    <div v-else>
      <p
        class="text-subtle text-xs"
        v-text="t('argumentRawValue')"
      />
      <p
        class="text-app font-mono"
        v-text="argument.value"
      />
    </div>

    <!-- Actions -->
    <Actions
      class="ml-auto"
      :workspace="workspace"
      :pool="pool"
      :server="server"
      :argument="argument"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  argumentRawValue: Value
  argumentVariable: Variable
fr:
  argumentRawValue: Valeur
  argumentVariable: Variable
de:
  argumentRawValue: Wert
  argumentVariable: Variable
es:
  argumentRawValue: Valor
  argumentVariable: Variable
zh:
  argumentRawValue: 值
  argumentVariable: 变量
</i18n>
