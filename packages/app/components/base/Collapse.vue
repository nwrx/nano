<script setup lang="ts">
import type { VNode } from 'vue'
import { BaseCollapse } from '@unshared/vue/BaseCollapse'

const model = defineModel({ default: false })
const isCollapsed = ref(false)
const isCollapsing = ref(false)
const duration = ref(150)
let timeout: NodeJS.Timeout

const slots = defineSlots<{
  default: () => VNode
}>()

watch(model, () => {
  clearTimeout(timeout)
  if (model.value) isCollapsed.value = false
  else timeout = setTimeout(() => isCollapsed.value = true, duration.value)
  isCollapsing.value = true
  setTimeout(() => isCollapsing.value = false, duration.value)
})

const isOpen = computed(() => model.value || isCollapsing.value)
const view = computed(() => (isOpen.value ? slots.default : 'div'))
const key = computed(() => (isOpen.value ? 'open' : 'closed'))
</script>

<template>
  <BaseCollapse
    as="div"
    :is-open="model"
    :duration="duration"
    vertical
    class="transition-all will-change-height"
    :class="{
      'h-0': isCollapsed,
      'overflow-clip': isCollapsing,
      'op-0 pointer-events-none': model !== true,
    }">
    <KeepAlive>
      <component :is="view" :key="key" />
    </KeepAlive>
  </BaseCollapse>
</template>
