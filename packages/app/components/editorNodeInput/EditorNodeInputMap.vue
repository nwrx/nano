<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  id: string
  name: string
  label: string
  color: string
  modelValue: unknown
  isLinkeable?: boolean
}>()

const emit = defineEmits<{
  linkGrab: [path: string]
  linkAssign: [path: string]
  linkUnassign: []
  'update:modelValue': [value: Record<string, string>]
}>()

const { t } = useI18n()
const isOpen = ref<boolean>(false)
const isChanging = ref<boolean>(false)
const modelEntries = ref<Array<[string, string]>>([])

const isEmpty = computed(() => {
  if (modelEntries.value.length === 0) return true
  return modelEntries.value.every(([key]) => !key)
})

watch(() => props.modelValue, (modelValue) => {
  if (typeof modelValue === 'object' && modelValue !== null)
    modelEntries.value = Object.entries(modelValue)
  if (modelEntries.value.length === 0)
    modelEntries.value = [['', '']]
}, { immediate: true })

watch(modelEntries, (modelEntries) => {
  if (isChanging.value) return
  isChanging.value = true
  emit('update:modelValue', Object.fromEntries(modelEntries))
  if (modelEntries.length === 0) modelEntries.push(['', ''])
  setTimeout(() => isChanging.value = false, 0)
}, { deep: true })
</script>

<template>
  <div class="w-full">

    <!-- Label -->
    <EditorNodeInputGroup
      class="flex items-center justify-start w-full cursor-pointer group"
      @mousedown.stop="() => isOpen = !isOpen">
      <EditorNodeInputLabel :label="label" />
      <Badge
        class="badge-primary badge-sm"
        label="Object"
      />
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
        -translate-x-6 -mr-11
      ">
      <div
        v-for="(entry, index) in modelEntries"
        :key="index"
        class="flex items-center h-8 b-t b-editor bg-emphasized"
        @mouseenter.stop="() => { if (entry[0]) emit('linkAssign', entry[0]) }"
        @mouseleave.stop="() => emit('linkUnassign')">

        <!-- Pin -->
        <EditorNodeInputPin
          :id="id"
          :name="name"
          :color="color"
          :path="entry[0]"
          :is-output="false"
          :is-linkeable="Boolean(entry[0])"
          class="cursor-pointer"
          @mousedown.stop="() => { if (entry[0]) emit('linkGrab', entry[0]) }"
        />

        <!-- Label -->
        <input
          v-model="entry[0]"
          :placeholder="t('key')"
          :class="{ 'text-editor-node italic': !entry[0] }"
          class="cursor-text w-0 grow h-full outline-none bg-transparent text-sm pl-sm">

        <!-- testé aussi avec JSON.parse(model)[index][key] -->
        <input
          v-if="false"
          v-model="entry[1]"
          :placeholder="t('value')"
          :class="{ 'text-editor-node italic': !entry[1] }"
          class="cursor-text w-0 grow h-full outline-none bg-transparent text-sm px-sm b-l b-editor">

        <!-- Add -->
        <div
          v-if="index === modelEntries.length - 1"
          class="flex items-center justify-center w-8 h-full cursor-pointer hover:bg-prominent"
          @click="() => modelEntries.push(['', ''])">
          <BaseIcon
            icon="i-carbon:add"
            class="size-4 text-app my-1"
          />
        </div>

        <!-- Remove -->
        <div
          v-else
          class="flex items-center justify-center w-8 h-full cursor-pointer hover:bg-prominent"
          @click="() => modelEntries.splice(index, 1)">
          <BaseIcon
            icon="i-carbon:close"
            class="size-4 text-app my-1"
          />
        </div>
      </div>
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
