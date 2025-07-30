<script setup lang="ts">
import type { McpServerArgumentObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<{
  argument: McpServerArgumentObject
  inline?: boolean
}>()

const { t } = useI18n()
const isVariable = computed(() => {
  if (!props.argument) return false
  return !!props.argument.variable
})
</script>

<template>
  <BaseButton
    v-if="argument"
    as="div"
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-md bg-subtle': !inline,
    }">

    <!-- Argument Type Icon -->
    <div class="flex items-center gap-md">

      <!-- Icon -->
      <div class="rd p-sm b b-app bg-secondary-500 !text-black">
        <BaseIcon :icon="isVariable ? 'i-carbon:password' : 'i-carbon:code'" class="size-5" />
      </div>

      <!-- Value and type -->
      <div>
        <!-- Variable -->
        <div
          v-if="argument && argument.variable"
          class="flex items-center text-subtle text-xs font-mono gap-xs">
          <span class="line-clamp-1">{{ argument.variable.vault?.name }}</span>
          <BaseIcon icon="i-carbon:arrow-right size-3" />
          <span class="line-clamp-1">{{ argument.variable.name }}</span>
        </div>

        <!-- Value -->
        <p v-else class="text-sm font-mono line-clamp-1" :class="{ italic: !argument.value }">
          {{ argument.value ?? t('argumentRawValue') }}
        </p>

        <!-- Type label -->
        <p class="text-subtle text-xs">
          {{ isVariable ? t('argumentVariable') : t('argumentValue') }}
        </p>
      </div>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Audit -->
    <UserAudit
      :created-at="argument.createdAt"
      :created-by="argument.createdBy"
      :updated-at="argument.updatedAt"
      :updated-by="argument.updatedBy"
    />
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  argumentRawValue: Raw value
  argumentVariable: Variable
  argumentValue: Value
fr:
  argumentRawValue: Valeur brute
  argumentVariable: Variable
  argumentValue: Valeur
de:
  argumentRawValue: Rohwert
  argumentVariable: Variable
  argumentValue: Wert
es:
  argumentRawValue: Valor bruto
  argumentVariable: Variable
  argumentValue: Valor
zh:
  argumentRawValue: 原始值
  argumentVariable: 变量
  argumentValue: 值
</i18n>
