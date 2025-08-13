<script setup lang="ts">
import type { Editor } from '@nwrx/nano-api'

const props = defineProps<{
  id?: unknown
  name?: string
  path?: string
  nodes?: Editor.NodeObject[]
}>()

const { t } = useI18n()
const node = computed(() => props.nodes?.find(n => n.id === props.id))
const socket = computed(() => node.value?.outputSchema?.find(s => s.key === props.name))
const label = computed(() => `${node.value?.label ?? node.value?.name} (${socket.value?.name})`)
</script>

<template>
  <div class="w-full h-full flex items-center px-sm">
    <template v-if="node && socket">
      <Badge
        v-if="node.id"
        class="text-white badge-sm font-mono px-xs"
        :style="{ backgroundColor: socket.typeColor }"
        :label="label"
        :icon="node.icon"
        icon-load
      />
    </template>
    <template v-else>
      <span class="text-subtle italic">
        {{ t('placeholder') }}
      </span>
    </template>
  </div>
</template>

<i18n lang="yaml">
en:
  placeholder: No input link
fr:
  placeholder: Pas de lien d'entrée
de:
  placeholder: Kein Eingangslink
es:
  placeholder: Sin enlace de entrada
zh:
  placeholder: 没有输入链接
</i18n>
