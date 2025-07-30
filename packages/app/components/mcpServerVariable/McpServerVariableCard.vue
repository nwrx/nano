<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'

const props = defineProps<{
  variable: McpServerVariableObject
  inline?: boolean
}>()

const { t } = useI18n()
const isVariable = computed(() => {
  if (!props.variable) return false
  return !!props.variable.variable
})
</script>

<template>
  <BaseButton
    v-if="variable"
    as="div"
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-md bg-subtle': !inline,
    }">

    <!-- Variable Type Icon -->
    <div class="flex items-center gap-md">

      <!-- Icon -->
      <div class="rd p-sm b b-app bg-secondary-500 !text-black">
        <BaseIcon :icon="isVariable ? 'i-carbon:password' : 'i-carbon:code'" class="size-5" />
      </div>

      <!-- Name and optional mount path -->
      <div>
        <div class="flex items-center gap-sm text-sm">
          <span class="font-semibold line-clamp-1">
            {{ variable.name }}
          </span>
          <template v-if="variable.mountAtPath">
            <BaseIcon icon="i-carbon:arrow-right size-3" />
            <span class="text-subtle line-clamp-1">
              {{ variable.mountAtPath }}
            </span>
          </template>
        </div>

        <!-- Variable -->
        <div
          v-if="variable && variable.variable"
          class="flex items-center text-subtle text-xs font-mono gap-xs">
          <span class="line-clamp-1">{{ variable.variable.vault?.name }}</span>
          <BaseIcon icon="i-carbon:arrow-right size-3" />
          <span class="line-clamp-1">{{ variable.variable.name }}</span>
        </div>

        <!-- Value -->
        <p v-else class="text-subtle text-xs font-mono line-clamp-1" :class="{ italic: !variable.value }">
          {{ variable.value ?? t('variableRawValue') }}
        </p>
      </div>
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
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  variableRawValue: Raw value
fr:
  variableRawValue: Valeur brute
de:
  variableRawValue: Rohwert
es:
  variableRawValue: Valor bruto
zh:
  variableRawValue: 原始值
</i18n>
