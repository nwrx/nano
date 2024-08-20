<script setup lang="ts">
import type { FlowNodePortJSON } from '@nanoworks/core'

const props = defineProps<{
  nodeId: string
  portId: string
  port: FlowNodePortJSON
  kind: 'data' | 'result'
  value: unknown
  valueIsDynamic: boolean
}>()

const emit = defineEmits<{
  setValue: [unknown]
  dragLinkStart: [FlowDragState | void]
  dragLinkTarget: [FlowDragState | void]
  dragLinkDrop: []
}>()

// --- Use the `useModel` composition function to create a two-way binding.
const model = useVModel(props, 'value', emit, {
  passive: true,
  eventName: 'setValue',
})

// --- Reference to the color pin HTML element.
const pin = ref<HTMLDivElement>()
defineExpose({ pin })

// --- Handle dragging from this pin to create a new port.
function setDragLinkStart(event: MouseEvent) {
  if (props.port.disallowDynamic) return
  if (event.target instanceof HTMLInputElement) return
  if (event.target instanceof HTMLTextAreaElement) return
  if (event.target instanceof HTMLSelectElement) return
  const { x, y, width, height } = pin.value!.getBoundingClientRect()
  emit('dragLinkStart', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.port.type.color,
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// --- When the mouse hovers over a pin, set the target of the new port.
function setDragLinkTarget() {
  if (props.port.disallowDynamic) return
  const { x, y, width, height } = pin.value!.getBoundingClientRect()
  emit('dragLinkTarget', {
    id: `${props.nodeId}:${props.portId}`,
    color: props.port.type.color,
    kind: props.kind,
    position: {
      x: x + width / 2,
      y: y + height / 2,
    },
  })
}

// --- On input on the text area element, automatically resize the height.
function onTextAreaInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight + 2}px`
}
</script>

<template>
  <div
    class="
      flex items-start gap-2
      w-full group
    "
    :class="{
      'h-8': port.display !== 'textarea',
      'pr-2 flex-row': kind === 'data',
      'pl-2 flex-row-reverse': kind === 'result',
      'hover:bg-primary-200': port.display === undefined,
    }"
    @mousedown="(event: MouseEvent) => setDragLinkStart(event)"
    @mouseover="() => setDragLinkTarget()"
    @mouseout="() => emit('dragLinkTarget')"
    @mouseup="() => emit('dragLinkDrop')">

    <!-- Node pin, used to connect to other nodes. -->
    <div
      :id="`${nodeId}:${portId}`"
      ref="pin"
      class="h-2 group-hover:scale-115 transition-transform duration-50 shrink-0 mt-3"
      :style="{ backgroundColor: port.type.color }"
      :class="{
        'rounded-r-lg': kind === 'data',
        'rounded-l-lg': kind === 'result',
        'w-4': !port.disallowDynamic,
        'w-2 ml-2 rounded-lg': port.disallowDynamic,
      }"
    />

    <!-- Display the name -->
    <span
      v-if="port.display === 'none' || port.display === undefined"
      class="truncate text-start px-2 py-1 outline-none"
      v-text="port.name"
    />

    <!-- Display an input field -->
    <input
      v-else-if="port.display === 'text'"
      v-model="model"
      :placeholder="port.name"
      :class="{
        italic: model,
      }"
      class="
        w-full text-start px-2 py-1 outline-none
        bg-transparent border-transparent border
        appearance-none rounded-md
        hover:bg-primary-200
        focus:bg-primary-200
        focus:border-primary-500
        placeholder-black/50
      "
    />

    <!-- Display a select field -->
    <select
      v-else-if="port.display === 'select'"
      v-model="model"
      :class="{
        'text-black/50': model === undefined,
      }"
      class="
        w-full text-start px-2 py-1 outline-none
        bg-transparent border-transparent border
        appearance-none rounded-md
        hover:bg-primary-200
        focus:bg-primary-200
        focus:border-primary-500
        placeholder-black/50
      ">
      <option value="undefined" disabled selected>{{ port.name }}</option>
      <template v-if="Array.isArray(port.values)">
        <option
          v-for="value in port.values"
          :key="value"
          :value="value"
          v-text="value"
        />
      </template>
      <template v-else>
        <option
          v-for="(value, label) in port.values"
          :key="value"
          :value="value"
          v-text="label"
        />
      </template>
    </select>

    <!-- Display a textarea field -->
    <textarea
      v-else-if="port.display === 'textarea'"
      v-model="model"
      :placeholder="port.name"
      autocapitalize="sentences"
      autocomplete="off"
      spellcheck="false"
      wrap="hard"
      rows="1"
      :class="{ italic: !model }"
      class="
        w-full text-start px-2 py-1 outline-none
        bg-transparent border-transparent border
        appearance-none rounded-md
        hover:bg-primary-200
        focus:bg-primary-200
        focus:border-primary-500
        placeholder-black/50
        resize-none
        max-h-128
      "
      @input="(el) => onTextAreaInput(el)"
    />
  </div>
</template>
