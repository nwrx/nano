<script setup lang="ts">
import { type ComponentInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  id?: unknown
  name?: string
  path?: string
  nodes?: ComponentInstanceJSON[]
}>()

const { t } = useI18n()
const node = computed(() => props.nodes?.find(n => n.id === props.id))
const socket = computed(() => node.value?.outputSchema?.find(s => s.key === props.name))
</script>

<template>
  <div class="w-full h-full flex items-center px-sm">
    <template v-if="node && socket">
      <Badge
        v-if="node.id"
        class="text-white badge-sm font-mono"
        :style="{ backgroundColor: node.categoryColor }"
        :label="node.label ?? node.name"
        :icon="node.icon"
        icon-load
      />
      <BaseIcon
        class="text-subtle mx-sm"
        icon="i-carbon:chevron-right"
      />
      <Badge
        v-if="socket.key"
        class="text-white badge-sm font-mono"
        :style="{ backgroundColor: socket.typeColor }"
        :label="socket.name"
      />
    </template>
    <template v-else>
      <span class="text-subtle italic">{{ t('noLink') }}</span>
    </template>
  </div>
</template>

<i18n lang="yaml">
en:
  noLink: No input link
fr:
  noLink: Pas de lien d'entrée
de:
  noLink: Kein Eingangslink
es:
  noLink: Sin enlace de entrada
zh:
  noLink: 没有输入链接
</i18n>
