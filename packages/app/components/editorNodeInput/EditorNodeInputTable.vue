<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const model = computed({
  get: () => props.node.input[props.name],
  set: (value: any) => props.editor.model.setNodesInputValue({
    id: props.node.id,
    name: props.name,
    value,
  }),
})

const isOpen = ref<boolean>(false)
const isChanging = ref<boolean>(false)
const entries = ref<Array<[string, string]>>([])
const entriesCount = computed(() => entries.value.filter(([key, value]) => key && value).length)

const isEmpty = computed(() => {
  if (entries.value.length === 0) return true
  return entries.value.every(([key]) => !key)
})

watch(model, (model) => {
  if (typeof model === 'object' && model !== null) entries.value = Object.entries(model)
  if (entries.value.length === 0) entries.value = [['', '']]
}, { immediate: true })

watch(entries, (modelEntries) => {
  if (isChanging.value) return
  isChanging.value = true
  model.value = Object.fromEntries(modelEntries)
  if (modelEntries.length === 0) modelEntries.push(['', ''])
  setTimeout(() => isChanging.value = false, 0)
}, { deep: true })
</script>

<template>
  <div class="w-full">

    <!-- Label -->
    <EditorNodeInputGroup
      class="flex h-8 items-center justify-start w-full cursor-pointer group"
      @mousedown.stop="() => isOpen = !isOpen">

      <!-- Label -->
      <EditorNodeInputLabel
        :editor="editor"
        :node="node"
        :name="name"
      />

      <!-- Badge -->
      <Badge
        class="badge-success badge-sm"
        :label="`${entriesCount} entries`"
      />

      <!-- Empty -->
      <span class="flex-1" />

      <BaseIcon
        v-if="isEmpty"
        icon="i-carbon:chevron-down"
        class="size-5 transition-transform transform op-0 group-hover:op-100"
        :class="{ 'rotate-180': isOpen }"
      />
    </EditorNodeInputGroup>

    <BaseCollapse
      vertical
      :is-open="isOpen || !isEmpty"
      :class="{ 'op-0': !isOpen && isEmpty }"
      class="
        transition-all overflow-hidden b-b b-editor
        -translate-x-6 -mr-10
      ">

      <EditorNodeInputTableProperty
        v-for="(entry, index) in entries"
        :key="index"
        v-model="entry[1]"
        v-model:property="entry[0]"
        :editor="editor"
        :node="node"
        :name="name"
        :is-first="index === 0"
        :is-last="index === entries.length - 1"
        @remove="() => entries.splice(index, 1)"
        @add="() => entries.push(['', ''])"
      />
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
en:
  key: Name
  value: Value
  empty: Empty
fr:
  key: Nom
  value: Valeur
  empty: Vide
de:
  key: Name
  value: Wert
  empty: Leer
es:
  key: Nombre
  value: Valor
  empty: Vacío
zh:
  key: 名称
  value: 值
  empty: 空
</i18n>
