<script setup lang="ts">
import type { McpServerVariableObject } from '@nwrx/nano-api'
import { BaseButton } from '@unshared/vue/BaseButton'
import { BaseIcon } from '@unshared/vue/BaseIcon'

defineProps<{
  variable: McpServerVariableObject
  inline?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <BaseButton
    v-if="variable"
    as="div"
    class="flex items-center space-x-md"
    :class="{
      'b b-app rd p-4 bg-subtle': !inline,
    }">

    <!-- Variable Type Icon -->
    <div class="b b-app rd p-2">
      <BaseIcon
        :icon="variable.variable ? 'i-carbon:password' : 'i-carbon:code'"
        class="text-app size-4"
      />
    </div>

    <!-- Variable Name & Details -->
    <div class="flex flex-col items-start flex-1">
      <!-- Variable Name -->
      <span
        class="text-sm font-medium text-app font-mono"
        v-text="variable.name"
      />

      <!-- Variable Details -->
      <div class="text-xs text-subtle">
        <!-- Linked Variable -->
        <div v-if="variable.variable" class="flex items-center gap-1">
          <span>{{ variable.variable.vault?.name }}</span>
          <BaseIcon icon="i-carbon:arrow-right" class="size-3" />
          <span class="font-mono">{{ variable.variable.name }}</span>
        </div>
        <!-- Raw Value -->
        <div v-else class="font-mono">
          {{ variable.value }}
        </div>
      </div>

      <!-- Mount Path -->
      <div v-if="variable.mountAtPath" class="text-xs text-subtle font-mono mt-1">
        {{ t('mountPath') }}: {{ variable.mountAtPath }}
      </div>
    </div>
  </BaseButton>
</template>

<i18n lang="yaml">
en:
  mountPath: Mount Path
fr:
  mountPath: Chemin de Montage
de:
  mountPath: Mount-Pfad
es:
  mountPath: Ruta de Montage
zh:
  mountPath: 挂载路径
</i18n>
