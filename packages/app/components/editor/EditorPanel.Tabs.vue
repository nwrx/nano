<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  values: string[]
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div class="flex items-center w-full px-sm h-12 b-b b-editor space-x-sm">
    <BaseInputToggle
      v-for="value in values"
      :key="value"
      v-model="model"
      :value="value"
      eager
      as="div"
      type="radio"
      class="
        flex items-center justify-center
        last:rd-r first:rd-l line-clamp-1 rd
        cursor-pointer px-md h-8 font-medium transition
        !selected:text-editor-active
        !selected:bg-editor-active
        hover:bg-editor-active/20
      ">
      {{ t(value) }}
    </BaseInputToggle>
  </div>
</template>

<i18n lang="yaml">
en:
  flow: Flow
  node: Node
  events: Events
  playground: Sandbox
fr:
  flow: Flux
  node: Noeud
  events: Événements
  playground: Bac à sable
de:
  flow: Fluss
  node: Knoten
  events: Ereignisse
  playground: Sandkasten
es:
  flow: Flujo
  node: Nodo
  events: Eventos
  playground: Caja de arena
zh:
  flow: 流程
  node: 节点
  events: 事件
  playground: 沙盒
</i18n>
