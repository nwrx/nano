<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import Actions from './McpServerVariablesActions.vue'
import UserAudit from '~/components/user/UserAudit.vue'

const props = defineProps<{
  workspace: string
  pool: string
  server: string
  variable: McpServerVariableObject
}>()

const { t } = useI18n()
const isVariable = computed(() => {
  if (!props.variable) return false
  return !!props.variable.variable
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
    <div v-if="variable && variable.variable">

      <!-- Name and optional mount path -->
      <div class="flex items-center gap-sm text-sm mt-1">
        <span class="font-semibold" v-text="variable.name" />
        <span v-if="variable.mountAtPath">
          → {{ variable.mountAtPath }}
        </span>
      </div>
      
      <!-- Variable -->
      <div class="flex items-center text-subtle text-xs font-mono gap-sm">
        <span v-text="variable.variable.vault?.name" />
        <BaseIcon icon="i-carbon:arrow-right size-3" />
        <span v-text="variable.variable.name" />
      </div>
    </div>

    <!-- Value -->
    <div v-else>
      <p
        class="text-subtle text-xs"
        v-text="t('variableRawValue')"
      />
      <div class="flex items-center gap-sm text-xs text-subtle">
        <span v-text="variable.name" />
        <span v-if="variable.mountAtPath">
          → {{ variable.mountAtPath }}
        </span>
      </div>
      <p
        class="text-app font-mono"
        v-text="variable.value"
      />
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Audit -->
     <UserAudit
       :created-at="variable.createdAt"
       :created-by="variable.createdBy"
       :updated-at="variable.updatedAt"
       :updated-by="variable.updatedBy"
       />

    <!-- Actions -->
    <Actions
      class="ml-auto"
      :workspace="workspace"
      :name="pool"
      :server="server"
      :variable="variable"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  variableRawValue: Value
  variableLinked: Linked Variable
fr:
  variableRawValue: Valeur
  variableLinked: Variable liée
de:
  variableRawValue: Wert
  variableLinked: Verknüpfte Variable
es:
  variableRawValue: Valor
  variableLinked: Variable vinculada
zh:
  variableRawValue: 值
  variableLinked: 链接的变量
</i18n>
