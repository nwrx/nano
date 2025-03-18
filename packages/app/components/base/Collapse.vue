<script setup lang="ts">
const model = defineModel({ default: false })

const isCollapsed = ref(false)
const isCollapsing = ref(false)

const duration = ref(150)
let timeout: NodeJS.Timeout

watch(model, () => {
  clearTimeout(timeout)
  if (model.value) isCollapsed.value = false
  else timeout = setTimeout(() => isCollapsed.value = true, duration.value)

  isCollapsing.value = true
  setTimeout(() => isCollapsing.value = false, duration.value)
}, { immediate: true })
</script>

<template>
  <BaseCollapse
    :is-open="model"
    :duration="duration"
    vertical
    class="transition-all"
    :class="{
      'h-0': isCollapsed,
      'overflow-hidden': isCollapsing,
      'op-50 pointer-events-none': model !== true,
    }">
    <div v-if="model || isCollapsing">
      <slot />
    </div>
  </BaseCollapse>
</template>
