<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<!-- eslint-disable sonarjs/no-nested-assignment -->
<script setup lang="ts">
import type { UUID } from 'node:crypto'
import { useThreads, useThreadTree } from '~/composables/useThread'
import Event from './ThreadTree.Event.vue'

const props = defineProps<{
  workspace: string
  project: string
  flow: string
  id?: UUID
  follow?: boolean
}>()

const threads = useThreads(props)
const threadId = computed(() => props.id)
const thread = threads.threadById(threadId)
const tree = computed(() => useThreadTree(thread.value))

// --- Virtual scrolling for performance optimization
// --- Initially render 2x visible items, then incrementally load more on scroll
const ITEMS_PER_PAGE = 50
const triggerLoad = ref<HTMLElement>()
const displayedCount = ref(ITEMS_PER_PAGE * 2)
const hiddenCount = computed(() => tree.value.items.length - displayedCount.value)
const visibleItems = computed(() => tree.value.items.slice(0, displayedCount.value))

// Use IntersectionObserver to detect when user scrolls near the end
useIntersectionObserver(triggerLoad, ([{ isIntersecting }]) => {
  if (isIntersecting && hiddenCount.value > 0) {
    displayedCount.value = Math.min(
      displayedCount.value + ITEMS_PER_PAGE,
      tree.value.items.length,
    )
  }
})

// Load thread and events when ID changes. This ensures we fetch the latest data
// and also reset the displayed count to show the initial items.
watch(() => props.id, async(id) => {
  if (!id) return
  await threads.fetchThread(id)
  await threads.subscribeToThread(id)
  displayedCount.value = ITEMS_PER_PAGE * 2
  await new Promise(resolve => setTimeout(resolve, 1))
}, { immediate: true })

// Bind the scroll controls to the controller. Everytime new events are inserted
// in the tree, scroll to the bottom
const container = ref<HTMLElement>()
watchDebounced(() => tree.value.items, async() => {
  if (!props.follow) return
  await new Promise(resolve => setTimeout(resolve, 100))
  if (!container.value) return
  const height = container.value.scrollHeight
  container.value.scrollTo({ top: height + 100, behavior: 'smooth' })
}, { deep: true, debounce: 10 })

// Unsubscribe from thread updates when component is destroyed.
onBeforeUnmount(() => {
  if (!props.id) return
  threads.unsubscribeFromThread(props.id)
})
</script>

<template>
  <div ref="container" class="flex flex-col grow w-full overflow-y-auto overflow-x-clip">
    <div class="pt-md px-md pb-xl">
      <Event
        v-for="item in visibleItems"
        :key="item.event.index"
        :max-depth="tree.maxDepth"
        :item="item"
      />

      <!-- Load trigger - sentinel element for lazy loading -->
      <!-- Fill up with empty space to avoid scrollbar flicker -->
      <div v-if="hiddenCount > 0" ref="triggerLoad">
        <div v-for="n in Math.min(hiddenCount, ITEMS_PER_PAGE)" :key="n" class="h-7" />
      </div>
    </div>
  </div>
</template>
