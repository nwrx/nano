<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { FlowNodeObject } from '@nwrx/nano-api'
import type { Schema, SchemaOption } from '@nwrx/nano/utils'
import { BaseIcon } from '@unshared/vue/BaseIcon'
import EditorMenuItem from '../editor/EditorMenu.Item.vue'
import EditorMenu from '../editor/EditorMenu.vue'
import EditorNodeInputGroup from './EditorNodeInput.Group.vue'
import EditorNodeInputLabel from './EditorNodeInput.Label.vue'
import EditorNodeInputValue from './EditorNodeInput.Value.vue'

const props = defineProps<{
  name?: string
  node?: FlowNodeObject
  schema?: Schema
  searchOptions?: (search: string) => Promise<SchemaOption[]>
}>()

const isFocused = ref(false)
const value = defineModel()
const options = ref<SchemaOption[]>([])
const search = ref('')
const searchElement = ref<HTMLInputElement>()
const isSearching = ref(false)

function onFocus() {
  isFocused.value = true
  void refreshOptions()
}

function onBlur() {
  isFocused.value = false
  search.value = ''
}

async function refreshOptions() {
  if (!props.searchOptions) return
  isSearching.value = true
  options.value = await props.searchOptions(search.value)
  isSearching.value = false
}

watchDebounced(
  search,
  () => void refreshOptions(),
  { debounce: 200 },
)
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text relative"
    :class="{ '!b-app-active': isFocused }"
    @mousedown.prevent="() => searchElement!.focus()">

    <!-- Label -->
    <EditorNodeInputLabel
      :node="node"
      :name="name"
      :schema="schema"
    />

    <!-- Current -->
    <EditorNodeInputValue
      v-if="!isFocused"
      :name="name"
      :schema="schema"
      :model-value="value"
      :readonly="true"
    />

    <!-- Field -->
    <input
      ref="searchElement"
      v-model="search"
      class="outline-none bg-transparent text-sm grow w-0 font-mono"
      @focus="() => onFocus()"
      @blur="() => onBlur()">

    <!-- Clear -->
    <BaseIcon
      v-if="isSearching"
      icon="i-line-md:loading-loop"
      class="op-0 group-hover:op-100 size-4 text-app cursor-pointer shrink-0"
    />

    <!-- Clear -->
    <BaseIcon
      v-else-if="!isFocused && value"
      icon="i-carbon:close"
      class="op-0 group-hover:op-100 size-4 text-app cursor-pointer shrink-0"
      @mousedown.stop="() => value = undefined"
    />

    <!-- List -->
    <EditorMenu
      :show="isFocused"
      :is-loading="isSearching"
      :is-empty="options.length === 0">
      <EditorMenuItem
        v-for="(option, index) in options"
        :key="index"
        :icon="option.icon"
        :label="option.label"
        :is-selected="JSON.stringify(value) === JSON.stringify(option.value)"
        @mousedown.stop="() => value = option.value"
      />
    </EditorMenu>
  </EditorNodeInputGroup>
</template>
