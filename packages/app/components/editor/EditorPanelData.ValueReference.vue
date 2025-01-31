<script setup lang="ts">
import { type ComponentInstanceJSON } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: unknown
  nodes?: ComponentInstanceJSON[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// --- Localization
const { t } = useI18n()

// --- Two-way binding
const model = useVModel(props, 'modelValue', emit, { passive: true })

// --- Extract the source node and socket from the model value.
const source = computed(() => {
  if (!model.value) return { key: undefined, id: undefined }
  if (typeof model.value !== 'string') return { key: undefined, id: undefined }
  const [id, key] = model.value.slice(6).split(':')
  return { id, key }
})

// --- Resolve the target node and socket.
const node = computed(() => props.nodes?.find(n => n.id === source.value.id))
const socket = computed(() => node.value?.outputSchema?.find(s => s.key === source.value.key))
</script>

<template>
  <div class="w-full flex items-center px-sm py-xs">
    <template v-if="node && socket">
      <Badge
        v-if="node.id"
        class="text-white badge-sm font-mono"
        :style="{ backgroundColor: node.categoryColor }"
        :label="node.name"
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
