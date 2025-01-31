<script setup lang="ts">
import type { InputJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'
import { isReferenceLink } from '#imports'

const props = defineProps<{
  id: string
  isOutput?: boolean
  value: unknown
  secrets?: string[]
  variables?: string[]
  socket: InputJSON
  getOptions?: (key: string, query: string) => Promise<SocketListOption[]>
}>()

const emit = defineEmits<{
  setValue: [unknown]
  searchOptions: [string, string]
  linkGrab: [path?: string]
  linkAssign: [path?: string]
  linkUnassign: []
}>()

// --- Use the `useModel` composition function to create a two-way binding.
const model = useVModel(props, 'value', emit, {
  passive: true,
  eventName: 'setValue',
})

// --- Determine if the pin is linked to another node.
const isLinked = computed(() => {
  if (!model.value) return false
  return isReferenceLink(model.value)
})

// --- Assert if the control is linkea to another node.
const isLinkeable = computed(() =>
  props.socket.control === 'socket'
  || props.socket.control === undefined
  || props.isOutput
  || isLinked.value)
</script>

<template>
  <div
    class="flex items-center w-full relative"
    :class="{
      'pr-5 flex-row': !isOutput,
      'pl-5 flex-row-reverse': isOutput,
      'hover:bg-emphasized cursor-pointer': isLinkeable,
    }"
    @mousedown.left="() => { if (isLinkeable) emit('linkGrab') }"
    @mouseenter="() => emit('linkAssign')"
    @mouseleave="() => emit('linkUnassign')">

    <!-- Node pin, used to connect to other nodes. -->
    <EditorNodeSocketPin
      :id="id"
      :name="socket.key"
      :color="socket.typeColor"
      :is-output="isOutput"
      :is-linkeable="isLinkeable"
    />

    <!-- Linkeable pin, used to connect to other nodes. -->
    <EditorNodeSocketLink
      v-if="isLinkeable"
      :label="socket.name"
      :is-linked="isLinked"
      :default-value="socket.defaultValue"
    />

    <!-- Variable & secret input -->
    <EditorNodeSocketVariable
      v-else-if="socket.control === 'variable'"
      v-model="model"
      :name="socket.name"
      :secrets="secrets"
      :variables="variables"
      :default-value="socket.defaultValue"
    />

    <!-- Text input -->
    <EditorNodeSocketText
      v-else-if="socket.control === 'text'"
      v-model="model"
      :name="socket.name"
      :default-value="socket.defaultValue"
    />

    <!-- Select input -->
    <EditorNodeSocketSelect
      v-else-if="socket.control === 'select'"
      v-model="model"
      :name="socket.name"
      :default-value="socket.defaultValue"
      :options="socket.options"
      :get-options="getOptions ? (query) => getOptions!(socket.key, query) : undefined"
    />

    <!-- Radio -->
    <EditorNodeSocketRadio
      v-else-if="socket.control === 'radio'"
      v-model="model"
      :name="socket.name"
      :default-value="socket.defaultValue"
      :options="socket.options"
    />

    <!-- Textarea input -->
    <EditorNodeSocketTextarea
      v-else-if="socket.control === 'textarea'"
      v-model="model"
      :name="socket.name"
      :description="socket.description"
      :default-value="socket.defaultValue"
    />

    <!-- Slider -->
    <EditorNodeSocketSlider
      v-else-if="socket.control === 'slider'"
      v-model="model"
      :name="socket.name"
      :min="socket.sliderMin"
      :max="socket.sliderMax"
      :step="socket.sliderStep"
      :default-value="socket.defaultValue"
    />

    <!-- Display a select field -->
    <EditorNodeSocketMap
      v-else-if="socket.control === 'map'"
      :id="id"
      v-model="model"
      :name="socket.key"
      :label="socket.name"
      :color="socket.typeColor ?? 'var(--theme-textColor-app)'"
      @link-grab="(path) => emit('linkGrab', path)"
      @link-assign="(path) => emit('linkAssign', path)"
      @link-unassign="() => emit('linkUnassign')"
    />

    <!-- Linkeable pin, used to connect to other nodes. -->
    <EditorNodeSocketLink
      v-else
      :label="socket.name"
      :is-linked="isLinked"
      :default-value="socket.defaultValue"
    />
  </div>
</template>
