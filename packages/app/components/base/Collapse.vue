<script setup lang="ts">
const model = defineModel({ default: false })

const isCollapsed = ref(false)
const isCollapsing = ref(false)

const duration = ref(300)
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
    class="transition-all duration-slow"
    :class="{
      'h-0': isCollapsed,
      'overflow-hidden': isCollapsing,
      'op-50 pointer-events-none': model !== true,
    }">
    <KeepAlive v-if="model || isCollapsing">
      <div>
        <slot />
      </div>
    </KeepAlive>
  </BaseCollapse>
</template>
