<script setup lang="ts">
const props = defineProps<{
  value?: unknown
  showValues?: boolean
}>()

const { t } = useI18n()

const parts = computed(() => {
  if (!props.value) return []
  if (!isReference(props.value)) return []
  return props.value.$ref.split('/').slice(1)
})

const type = computed(() => {
  if (parts.value.length === 0) return
  return parts.value[0]
})

const values = computed(() => {
  if (parts.value.length === 0) return []
  return parts.value.slice(1)
})

const icon = computed(() => {
  if (!type.value) return
  if (type.value === 'Variables') return 'i-carbon:password'
  if (type.value === 'Nodes') return 'i-carbon:link'
})
</script>

<template>
  <div class="flex items-center space-x-xs text-sm font-mono text-app rd">

    <!-- Icon -->
    <BaseIcon
      :icon="icon"
      class="size-4 text-subtle"
    />

    <!-- Value -->
    <template v-if="showValues">
      <template v-for="(vText, index) in values" :key="index">
        <span
          :class="{
            'text-subtle truncate': index !== values.length - 1,
            'font-normal line-clamp-1': index === values.length - 1,
          }"
          v-text="vText"
        />

        <!-- Separator -->
        <BaseIcon
          v-if="index < values.length - 1"
          icon="i-carbon:chevron-right"
          class="size-3"
        />
      </template>
    </template>

    <template v-else>
      <span class="text-subtle">
        {{ t(type ?? 'Reference') }}
      </span>
    </template>
  </div>
</template>

<i18n lang="yaml">
en:
  Reference: Reference
  Variables: Variable
  Nodes: Link
fr:
  Reference: Référence
  Variables: Variable
  Nodes: Lien
de:
  Reference: Referenz
  Variables: Variable
  Nodes: Link
es:
  Reference: Referencia
  Variables: Variable
  Nodes: Enlace
zh:
  Reference: 引用
  Variables: 变量
  Nodes: 链接
</i18n>
